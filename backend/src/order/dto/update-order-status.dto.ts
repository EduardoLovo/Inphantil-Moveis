import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client'; // Importa o enum do Prisma

export class UpdateOrderStatusDto {
    @ApiProperty({
        example: OrderStatus.PAID,
        description: 'Novo status do pedido.',
        enum: OrderStatus, // Documenta as opções do enum no Swagger
    })
    @IsEnum(OrderStatus, {
        message:
            'Status inválido. Deve ser um dos valores do enum OrderStatus.',
    })
    status!: OrderStatus;
}
