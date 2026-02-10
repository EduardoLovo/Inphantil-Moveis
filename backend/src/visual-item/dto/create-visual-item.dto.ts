import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
// 1. Importe os ENUMs diretamente do Prisma Client
import { ItemColor, ItemSize, VisualItemType } from '@prisma/client';

export class CreateVisualItemDto {
    @ApiProperty({
        example: 'Capa Protetora de Parede',
        description: 'Nome do item.',
        required: false,
    })
    @IsString()
    @IsOptional() // 3. Use IsOptional no lugar de IsNotEmpty (se houver)
    name?: string; // 4. Adicione o '?' aqui também e remova o '!'

    @ApiProperty({
        example: 'PRT-CAPA-AZL',
        description: 'Código de referência/SKU do item.',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    code!: string;

    @ApiProperty({
        example: 'https://cdn.img/capa.jpg',
        description: 'URL da imagem.',
        required: false,
    })
    @IsString()
    @IsOptional()
    imageUrl?: string;

    // 2. Campo Discriminador
    @ApiProperty({
        example: VisualItemType.APLIQUE,
        description: 'Tipo de item no catálogo (Ex: Aplique, Tecido).',
        enum: VisualItemType,
    })
    @IsEnum(VisualItemType)
    @IsNotEmpty()
    type!: VisualItemType;

    // 3. ENUMs de Características (Opcionais)
    @ApiProperty({
        example: ItemColor.AZUL,
        description: 'Cor do item.',
        enum: ItemColor,
        required: false,
    })
    @IsEnum(ItemColor)
    @IsOptional()
    color?: ItemColor;

    @ApiProperty({
        example: ItemSize.BERCO,
        description: 'Tamanho (padrão de berço/cama).',
        enum: ItemSize,
        required: false,
    })
    @IsEnum(ItemSize)
    @IsOptional()
    size?: ItemSize;

    // 4. Campos de Organização
    @ApiProperty({
        example: 10,
        description: 'Ordem de exibição no catálogo.',
        type: Number,
        required: false,
    })
    @IsInt()
    @IsOptional()
    sequence?: number;

    @ApiProperty({
        example: 3,
        description: 'Quantidade em um set (Ex: 3 apliques).',
        type: Number,
        required: false,
    })
    @IsInt()
    @IsOptional()
    quantity?: number;

    @ApiProperty({
        example: true,
        description: 'Disponível para demonstração.',
        default: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    inStock?: boolean = true;

    @ApiProperty({
        example: false,
        description: 'Faz tapete.',
        default: false,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isExternal?: boolean = false;

    @ApiProperty({
        example: false,
        description: 'Faz externo.',
        default: false,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isTapete?: boolean = false;
}
