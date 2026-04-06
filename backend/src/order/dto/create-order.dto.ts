import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsPositive,
    ValidateNested,
    IsOptional,
    IsString,
    Length,
    IsNumber,
} from 'class-validator';

// 1. DTO Auxiliar para o Item do Pedido
export class CreateOrderItemDto {
    @ApiProperty({ example: 1, description: 'ID do Produto Base' })
    @IsInt()
    @IsPositive()
    productId!: number;

    @ApiPropertyOptional({
        example: 5,
        description: 'ID da Variação do Produto (se houver)',
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    variantId?: number; // <-- AGORA O BACKEND ACEITA A VARIAÇÃO!

    @ApiProperty({ example: 2, description: 'Quantidade comprada' })
    @IsInt()
    @IsPositive()
    quantity!: number;

    @IsOptional()
    customData?: any;
}

// 2. DTO Principal do Pedido
export class CreateOrderDto {
    @ApiProperty({ example: 1, description: 'ID do Endereço de entrega' })
    @IsInt()
    @IsNotEmpty()
    addressId!: number;

    @ApiProperty({
        type: [CreateOrderItemDto],
        description: 'Lista de itens do pedido',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items!: CreateOrderItemDto[];

    @IsNotEmpty({ message: 'O CPF é obrigatório para finalizar a compra.' })
    @IsString()
    @Length(14, 14, { message: 'O CPF deve ter 14 caracteres (com a máscara)' })
    cpf?: string;

    @IsOptional()
    @IsNumber()
    shippingCost?: number;
}
