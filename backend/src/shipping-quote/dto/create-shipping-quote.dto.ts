// src/shipping-quote/dto/create-shipping-quote.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingQuoteDto {
    @ApiProperty({
        description: 'Detalhes do orçamento (produtos cotados)',
        example: 'Cama Casinha Solteiro + Colchão',
        required: false,
    })
    @IsOptional()
    @IsString()
    quoteDetails!: string;

    @ApiProperty({
        description: 'Nome do cliente',
        example: 'Maria Silva',
        required: false,
    })
    @IsOptional()
    @IsString()
    customerName!: string;

    @ApiProperty({
        description: 'CPF do cliente',
        example: '123.456.789-00',
        required: false,
    })
    @IsOptional()
    @IsString()
    customerCpf!: string;

    @ApiProperty({
        description: 'CEP do cliente',
        example: '86800-000',
    })
    @IsString()
    @IsNotEmpty()
    customerZipCode!: string;

    @ApiProperty({
        description: 'Endereço completo (Rua, Número, Bairro)',
        example: 'Rua das Flores, 123, Centro',
        required: false,
    })
    @IsOptional()
    @IsString()
    customerAddress!: string;

    @ApiProperty({
        description: 'Cidade',
        example: 'Apucarana',
        required: false,
    })
    @IsOptional()
    @IsString()
    customerCity!: string;

    @ApiProperty({ description: 'Estado (UF)', example: 'PR', required: false })
    @IsOptional()
    @IsString()
    customerState!: string;
}
