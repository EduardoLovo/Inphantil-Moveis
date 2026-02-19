// src/shipping-quote/dto/update-shipping-quote.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateShippingQuoteDto } from './create-shipping-quote.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { ItemSize } from '@prisma/client';

export class UpdateShippingQuoteDto extends PartialType(
    CreateShippingQuoteDto,
) {
    @ApiProperty({ description: 'Nome da Transportadora', required: false })
    @IsOptional()
    @IsString()
    carrierName?: string;

    @ApiProperty({
        description: 'Prazo de entrega (ex: 15 dias úteis)',
        required: false,
    })
    @IsOptional()
    @IsString()
    deliveryDeadline?: string;

    @ApiProperty({ description: 'Quantidade de Volumes', required: false })
    @IsOptional()
    @IsNumber()
    volumeQuantity?: number;

    @ApiProperty({ description: 'Valor do Frete', required: false })
    @IsOptional()
    @IsNumber()
    shippingValue?: number;

    @ApiProperty({
        description: 'Tamanho da Cama',
        enum: ItemSize,
        required: false,
    })
    @IsOptional()
    @IsString() //
    bedSize?: string;

    @ApiProperty({ description: 'Tem protetor de parede?', required: false })
    @IsOptional()
    @IsBoolean()
    hasWallProtector?: boolean;

    @ApiProperty({
        description: 'Tamanho do protetor',
        enum: ItemSize,
        required: false,
    })
    @IsOptional()
    @IsString()
    wallProtectorSize?: string;

    @ApiProperty({ description: 'Tem tapete?', required: false })
    @IsOptional()
    @IsBoolean()
    hasRug?: boolean;

    @ApiProperty({
        description: 'Tamanho do tapete (texto livre)',
        required: false,
    })
    @IsOptional()
    @IsString()
    rugSize?: string;

    @ApiProperty({ description: 'Tem acessórios?', required: false })
    @IsOptional()
    @IsBoolean()
    hasAccessories?: boolean;

    @ApiProperty({ description: 'Quantidade de acessórios', required: false })
    @IsOptional()
    @IsNumber()
    accessoryQuantity?: number;

    @ApiProperty({
        description: 'Marcar solicitação como concluída/respondida',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isConcluded?: boolean;

    @ApiProperty({ description: 'Peso total (ex: 10kg)', required: false })
    @IsOptional()
    @IsString()
    weight?: string;

    @ApiProperty({
        description: 'Valor do Pedido (Nota Fiscal)',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    orderValue?: number;

    @ApiProperty({
        description: 'Se a cotação já foi solicitada para a transp',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isRequested?: boolean;
}
