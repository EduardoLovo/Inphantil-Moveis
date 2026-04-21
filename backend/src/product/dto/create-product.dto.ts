import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsBoolean,
    Min,
    IsArray,
    ValidateNested,
} from 'class-validator';

export class CreateVariantImageDto {
    @IsString()
    @IsNotEmpty()
    url!: string;
}

export class CreateVariantDto {
    @IsOptional()
    id?: number;

    // Ainda aceitamos isso do front para jogar pro JSON depois
    @IsString()
    @IsOptional()
    color?: string;

    @IsString()
    @IsOptional()
    size?: string;

    @IsOptional()
    @IsString()
    complement?: string;

    @IsNumber()
    @Min(0)
    price!: number;

    @IsNumber()
    @Min(0)
    stock!: number;

    @IsString()
    @IsOptional()
    sku?: string;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateVariantImageDto)
    images?: CreateVariantImageDto[];
}

export class CreateProductDto {
    @ApiProperty({ example: 'Sofá', description: 'Nome do produto.' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    sku?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    description?: string;

    // Deixamos opcionais pois o Prisma não pede mais isso no Produto
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    price?: number;

    @IsNumber()
    @IsOptional()
    stock?: number;

    @IsString()
    @IsOptional()
    mainImage?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @IsBoolean()
    @IsOptional()
    isAvailable?: boolean = true;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean = false;

    @IsNumber()
    @IsOptional()
    categoryId?: number;

    @ApiProperty({
        description: 'Variações do produto',
        required: false,
        type: [CreateVariantDto],
    })
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateVariantDto)
    variants?: CreateVariantDto[];
}
