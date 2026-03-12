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

// NOVO DTO: Valida as imagens dentro da variante
export class CreateVariantImageDto {
    @IsString()
    @IsNotEmpty()
    url!: string;
}

// NOVO DTO: Valida cada variante
export class CreateVariantDto {
    @IsOptional()
    id?: number;

    @IsString()
    @IsNotEmpty()
    color!: string;

    @IsString()
    @IsNotEmpty()
    size!: string;

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
    isFeatured?: boolean; // Permite receber isFeatured do Front!

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateVariantImageDto)
    images?: CreateVariantImageDto[];

    @IsOptional()
    @IsString()
    complement?: string;
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

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price!: number; // Pode ser um preço base ou o menor preço

    @IsNumber()
    @Min(0)
    @IsOptional()
    stock?: number = 0;

    // APAGADOS size e color daqui!

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
        description:
            'Variações do produto (cores, tamanhos, preços específicos)',
        required: false,
        type: [CreateVariantDto],
    })
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateVariantDto)
    variants?: CreateVariantDto[];
}
