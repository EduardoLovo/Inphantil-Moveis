import {
    Controller,
    Post,
    Body,
    UseGuards,
    HttpException,
    HttpStatus,
    BadRequestException,
    Request,
    Query, // <-- Importamos o Request para pegar quem é o usuário logado
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateCreditCardPaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderService } from '../order/order.service';
import { OrderStatus } from '@prisma/client';

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly orderService: OrderService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('credit-card')
    async payWithCreditCard(
        @Request() req: any, // <-- Pega os dados do usuário autenticado
        @Body() paymentData: CreateCreditCardPaymentDto,
    ) {
        try {
            // =========================================================
            // 🛡️ BLINDAGEM DE VALOR: BUSCANDO A VERDADE NO BANCO
            // =========================================================
            // O req.user.id (ou sub) vem do seu token JWT
            const userId = req.user.id || req.user.sub;

            // Busca o pedido no banco de dados para garantir que é dele e pegar o valor real
            const order = await this.orderService.findOne(
                Number(paymentData.orderId),
                userId,
            );

            // Valor oficial calculado pelo servidor (impossível de ser hackeado pelo navegador)
            const secureAmount = Number(order.total);
            // =========================================================

            // 1. Envia os dados para a API da Rede usando o VALOR SEGURO
            const result =
                await this.paymentService.createCreditCardTransaction(
                    paymentData.orderId,
                    secureAmount, // <-- Passamos o secureAmount no lugar do paymentData.amount
                    paymentData.cardData,
                );

            // 2. Verifica se a transação foi aprovada (código '00' na e-Rede)
            const isSuccess = result.returnCode === '00';

            if (isSuccess) {
                // 3. Se aprovado, atualiza o status no Prisma!
                await this.orderService.updateStatus(
                    Number(paymentData.orderId),
                    { status: OrderStatus.PAID },
                );
            }

            // 4. Retorna a resposta para o React
            return {
                success: isSuccess,
                message: result.returnMessage,
                transactionId: result.tid,
                authorizationCode: result.authorizationCode,
                rawResult: result,
            };
        } catch (error: unknown) {
            if (error instanceof HttpException) {
                throw error;
            }

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Erro ao processar o pagamento';
            throw new HttpException(
                errorMessage,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @UseGuards(JwtAuthGuard) // <-- BLINDAGEM: Exige que o usuário esteja logado para gerar Pix
    @Post('pix')
    async createPixPayment(
        @Request() req: any, // <-- Pega o usuário logado
        @Body() body: { orderId: string; amount?: number }, // amount agora é opcional, pois vamos ignorá-lo
    ) {
        if (!body.orderId) {
            throw new BadRequestException(
                'ID do pedido é obrigatório para gerar o Pix.',
            );
        }

        // =========================================================
        // 🛡️ BLINDAGEM DE VALOR PIX
        // =========================================================
        const userId = req.user.id || req.user.sub;

        // Garante que o pedido existe e pertence a este usuário
        const order = await this.orderService.findOne(
            Number(body.orderId),
            userId,
        );
        const secureAmount = Number(order.total); // Pega o valor real do banco
        // =========================================================

        const pixResult = await this.paymentService.createPixTransaction(
            body.orderId,
            secureAmount,
        );

        // 2. Salva o TID no banco de dados do pedido!
        if (pixResult && pixResult.tid) {
            await this.orderService.updateTid(
                Number(body.orderId),
                pixResult.tid,
            );
        }

        // 3. Devolve pro React mostrar o QR Code
        return pixResult;
    }

    // =========================================================
    // 🔔 WEBHOOK: RECEBE AVISOS DA REDE (PIX PAGO, CARTÃO, ETC)
    // =========================================================
    @Post('webhook')
    async redeWebhook(@Body() payload: any, @Query('token') token: string) {
        // 🔒 BLINDAGEM DO WEBHOOK: Verifica a senha da URL
        const minhaSenhaSecreta = process.env.WEBHOOK_SECRET_TOKEN;

        if (token !== minhaSenhaSecreta) {
            console.warn(
                '🚨 Tentativa de invasão no Webhook! Token inválido:',
                token,
            );
            return { received: true }; // Retorna OK para despistar
        }

        console.log('📦 PAYLOAD RECEBIDO DA REDE:', payload);

        try {
            // 👉 CENÁRIO 1: É UM AVISO DE PIX (Páginas 74 e 75 do Manual)
            // 👉 CENÁRIO 1: É UM AVISO DE PIX
            const eventos = payload.events || [];

            if (eventos.includes('PV.UPDATE_TRANSACTION_PIX')) {
                const tidDaRede = payload.data?.id;

                if (tidDaRede) {
                    // Busca o pedido no banco usando o TID
                    const order = await this.orderService.findByTid(tidDaRede);

                    if (order) {
                        // Achei! Atualiza para pago!
                        await this.orderService.updateStatus(order.id, {
                            status: OrderStatus.PAID,
                        });
                        console.log(
                            `✅ Pix do Pedido ${order.id} (TID: ${tidDaRede}) foi PAGO!`,
                        );
                    } else {
                        console.warn(
                            `⚠️ TID ${tidDaRede} recebido, mas nenhum pedido encontrado.`,
                        );
                    }
                    return { received: true };
                }
            }

            // 👉 CENÁRIO 2: É UM CANCELAMENTO DE PIX
            if (eventos.includes('PV.REFUND_PIX')) {
                console.log(
                    `❌ Pix do TID ${payload.data?.id || payload.id} foi devolvido.`,
                );
                // Implementar cancelamento pelo TID
                return { received: true };
            }

            // 👉 CENÁRIO 3: FLUXO NORMAL (Cartão de Crédito - se a Rede usar o padrão antigo)
            const { reference, status } = payload;

            if (reference) {
                if (status === 'Approved' || status === 'Paid') {
                    await this.orderService.updateStatus(Number(reference), {
                        status: OrderStatus.PAID,
                    });
                    console.log(
                        `✅ Pedido ${reference} PAGO via Webhook de Cartão!`,
                    );
                } else if (status === 'Canceled' || status === 'Denied') {
                    await this.orderService.updateStatus(Number(reference), {
                        status: OrderStatus.CANCELED,
                    });
                    console.log(
                        `❌ Pedido ${reference} CANCELADO via Webhook de Cartão.`,
                    );
                }
                return { received: true };
            }

            // Se chegou até aqui, é um evento que não precisamos tratar
            return { received: true, message: 'Evento não monitorado' };
        } catch (error) {
            console.error(`Erro ao processar webhook da Rede:`, error);
            return { received: true, error: 'Erro interno ao processar' };
        }
    }
}
