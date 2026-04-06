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

        return this.paymentService.createPixTransaction(
            body.orderId,
            secureAmount, // <-- Envia para a Rede o valor 100% seguro!
        );
    }

    // =========================================================
    // 🔔 WEBHOOK: RECEBE AVISOS DA REDE (PIX PAGO, BOLETO, ETC)
    // =========================================================
    @Post('webhook')
    async redeWebhook(
        @Body() payload: any,
        @Query('token') token: string, // <-- ISSO AQUI LÊ A SENHA DA URL!
    ) {
        // 🔒 BLINDAGEM DO WEBHOOK: Verifica se a senha bate
        const minhaSenhaSecreta = process.env.WEBHOOK_SECRET_TOKEN; // Mesma senha que você colocou na Rede

        if (token !== minhaSenhaSecreta) {
            console.warn(
                '🚨 Tentativa de invasão no Webhook! Token inválido:',
                token,
            );
            // Retornamos OK só para despistar o hacker, mas não fazemos nada no banco!
            return { received: true };
        }

        // Extraímos o número do pedido (reference) e o status do pagamento
        const { reference, status } = payload;

        if (!reference) {
            return { received: true, message: 'Payload ignorado' };
        }

        try {
            if (status === 'Approved' || status === 'Paid') {
                await this.orderService.updateStatus(Number(reference), {
                    status: OrderStatus.PAID,
                });
                console.log(
                    `✅ Pedido ${reference} atualizado para PAGO via Webhook!`,
                );
            } else if (status === 'Canceled' || status === 'Denied') {
                await this.orderService.updateStatus(Number(reference), {
                    status: OrderStatus.CANCELED,
                });
                console.log(`❌ Pedido ${reference} CANCELADO via Webhook.`);
            }

            return { received: true };
        } catch (error) {
            console.error(
                `Erro ao processar webhook do pedido ${reference}:`,
                error,
            );
            return { received: true, error: 'Erro interno ao processar' };
        }
    }
}
