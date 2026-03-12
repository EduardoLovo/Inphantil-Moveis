import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios'; // <-- 1. Importar o AxiosError

@Injectable()
export class PaymentService {
    private readonly apiUrl: string;
    private readonly credentialsBase64: string;

    constructor(private readonly httpService: HttpService) {
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

        console.log(payload);

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

        const payload = {
            reference: orderId,
            amount: amountInCents,
            kind: 'pix', // A mágica acontece aqui! Dizemos à Rede que queremos um Pix
            qrCode: {
                dateTimeExpiration: formattedDate, // Ex: 2026-03-04T19:27:02
            },
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
}
