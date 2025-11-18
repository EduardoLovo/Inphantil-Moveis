import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsPositive,
    ValidateNested,
} from 'class-validator';

// 1. DTO Auxiliar para o Item do Pedido
export class CreateOrderItemDto {
    @ApiProperty({ example: 1, description: 'ID do Produto' })
    @IsInt()
    @IsPositive()
    productId!: number;

    @ApiProperty({ example: 2, description: 'Quantidade comprada' })
    @IsInt()
    @IsPositive()
    quantity!: number;
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
    @ValidateNested({ each: true }) // Valida cada item dentro do array
    @Type(() => CreateOrderItemDto) // Converte o JSON para a classe DTO
    items!: CreateOrderItemDto[];
}
