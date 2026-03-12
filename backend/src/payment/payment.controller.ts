import {
    Controller,
    Post,
    Body,
    UseGuards,
    HttpException,
    HttpStatus,
    BadRequestException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateCreditCardPaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderService } from '../order/order.service'; // <-- Importar o OrderService
import { OrderStatus } from '@prisma/client'; // <-- Importar o Enum do Prisma

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly orderService: OrderService, // <-- Injetar o OrderService aqui
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('credit-card')
    async payWithCreditCard(@Body() paymentData: CreateCreditCardPaymentDto) {
        try {
            // 1. Envia os dados para a API da Rede
            const result =
                await this.paymentService.createCreditCardTransaction(
                    paymentData.orderId,
                    paymentData.amount,
                    paymentData.cardData,
                );

            // 2. Verifica se a transação foi aprovada (código '00' na e-Rede)
            const isSuccess = result.returnCode === '00';

            if (isSuccess) {
                // 3. Se aprovado, atualiza o status no Prisma!
                // Como o ID no Prisma é Int e no DTO vem como String, usamos Number()
                await this.orderService.updateStatus(
                    Number(paymentData.orderId),
                    {
                        status: OrderStatus.PAID,
                    },
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

    @Post('pix')
    async createPixPayment(@Body() body: { orderId: string; amount: number }) {
        if (!body.orderId || !body.amount) {
            throw new BadRequestException(
                'ID do pedido e valor são obrigatórios para gerar o Pix.',
            );
        }
        return this.paymentService.createPixTransaction(
            body.orderId,
            body.amount,
        );
    }
}
