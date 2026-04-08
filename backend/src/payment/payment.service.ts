import {
    Injectable,
    HttpException,
    HttpStatus,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios'; // <-- 1. Importar o AxiosError
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
    private readonly apiUrl: string;
    private readonly credentialsBase64: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly prisma: PrismaService,
    ) {
        const isProd = process.env.REDE_ENVIRONMENT === 'production';
        this.apiUrl = isProd
            ? 'https://api.userede.com.br/erede/v1/transactions'
            : 'https://api.userede.com.br/desenvolvedores/v1/transactions';

        const pv = process.env.REDE_PV || 'teste';
        const token = process.env.REDE_TOKEN || 'teste';

        this.credentialsBase64 = Buffer.from(`${pv}:${token}`).toString(
            'base64',
        );
    }

    async createCreditCardTransaction(
        orderId: string,
        amount: number,
        cardData: any,
    ) {
        const amountInCents = Math.round(amount * 100);

        const payload = {
            capture: true,
            reference: orderId,
            amount: amountInCents,
            cardholderName: cardData.holderName,
            cardNumber: cardData.number,
            expirationMonth: cardData.expMonth,
            expirationYear: cardData.expYear,
            securityCode: cardData.cvv,
            kind: 'credit',
            installments: parseInt(cardData.installments) || 1,
        };

        try {
            const response = await firstValueFrom(
                this.httpService.post(this.apiUrl, payload, {
                    headers: {
                        Authorization: `Basic ${this.credentialsBase64}`,
                        'Content-Type': 'application/json',
                    },
                }),
            );

            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                // AQUI ESTÁ A MÁGICA:
                // Se a Rede enviou um status de recusa (ex: 58), nós devolvemos isso como um "sucesso de comunicação"
                // para o Controller tratar amigavelmente, em vez de estourar um erro de servidor.
                if (error.response?.data?.returnCode) {
                    console.warn(
                        `Transação Recusada pela Rede: ${error.response.data.returnMessage}`,
                    );
                    return error.response.data;
                }

                console.error(
                    'Erro de conexão com a Rede:',
                    error.response?.data || error.message,
                );
            }

            throw new HttpException(
                'Falha ao processar pagamento com a Rede. Tente novamente mais tarde.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createPixTransaction(orderId: string, amount: number) {
        const amountInCents = Math.round(amount * 100);

        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
        const formattedDate = expirationDate.toISOString().split('.')[0];

        // 🛡️ Puxamos a senha do .env para montar a URL segura
        const webhookToken = process.env.WEBHOOK_SECRET_TOKEN;
        const baseUrl = process.env.API_URL;

        // 🚨 Trava de segurança: Se esquecer de configurar no Render, o servidor avisa!
        if (!baseUrl || !webhookToken) {
            console.error(
                '⚠️ ALERTA: API_URL ou WEBHOOK_SECRET_TOKEN não estão configurados no .env!',
            );
        }

        const payload = {
            reference: orderId,
            amount: amountInCents,
            kind: 'pix',
            qrCode: {
                dateTimeExpiration: formattedDate,
            },
            // 👉 A MÁGICA: Dizemos para a Rede enviar o aviso de pagamento direto pra cá!
            urls: [
                {
                    kind: 'callback',
                    url: `${baseUrl}/payment/webhook?token=${webhookToken}`,
                },
            ],
        };

        try {
            const response = await firstValueFrom(
                this.httpService.post(this.apiUrl, payload, {
                    headers: {
                        Authorization: `Basic ${this.credentialsBase64}`,
                        'Content-Type': 'application/json',
                    },
                }),
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                // Se a Rede der erro, nós imprimimos o erro exato para sabermos o que falta!
                console.error('Erro exato da Rede:', error.response.data);
            } else {
                console.error('Erro de conexão ao gerar Pix:', error);
            }

            throw new HttpException(
                'Falha ao gerar o Pix. Tente novamente.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // =========================================================
    // 🔄 GERA NOVO PIX PARA UM PEDIDO EXISTENTE (CHAMADO PELO REACT)
    // =========================================================
    async gerarNovoPixParaPedido(orderId: number) {
        // 1. Busca o pedido para saber o valor exato
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            throw new NotFoundException(`Pedido #${orderId} não encontrado.`);
        }

        if (order.status === 'PAID') {
            throw new BadRequestException('Este pedido já está pago.');
        }

        // 👉 DICA DE PRODUÇÃO: Para a Rede aceitar um pedido duplicado,
        // precisamos colocar uma "marca de tempo" no ID só para o banco,
        // mas salvamos o ID original no nosso sistema.
        const referenceAntiBloqueio = `${order.id}-${Date.now()}`;

        // 2. Reaproveita a sua própria função que já fala com a e.Rede!
        const dadosDaRede = await this.createPixTransaction(
            referenceAntiBloqueio,
            Number(order.total),
        );

        // 3. Salva o TID gerado no banco de dados para o Webhook achar depois
        await this.prisma.order.update({
            where: { id: order.id },
            data: {
                tid: dadosDaRede.tid,
                paymentMethod: 'pix', // Atualiza a escolha do cliente
            },
        });

        // 4. Extrai o copia e cola e a imagem EXATAMENTE como a e.Rede manda!
        const copiaECola = dadosDaRede.qrCodeResponse?.qrCodeData || '';
        const imagemBase64 = dadosDaRede.qrCodeResponse?.qrCodeImage || '';

        // 5. Devolve para o React
        return {
            qrCodeUrl: imagemBase64
                ? `data:image/png;base64,${imagemBase64}`
                : '',
            pixCode: copiaECola,
        };
    }
}
