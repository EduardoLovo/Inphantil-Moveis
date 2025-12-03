import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsBoolean,
    Min,
    IsArray,
} from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        example: 'Sofá Modular Confort',
        description: 'Nome do produto.',
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        example: 'SOFA-MOD-001',
        description: 'Código de referência/SKU.',
        required: false,
    })
    @IsString()
    @IsOptional()
    sku?: string;

    @ApiProperty({
        example: 'sofa-modular-confort',
        description: 'Slug para URL amigável.',
        required: false,
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        example: 'Estrutura em madeira de reflorestamento e tecido linho.',
        description: 'Descrição detalhada do produto.',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 1250.99,
        description: 'Preço de venda do produto.',
        type: Number,
    })
    @IsNumber(
        { maxDecimalPlaces: 2 },
        {
            message:
                'O preço deve ser um número com no máximo 2 casas decimais.',
        },
    )
    @Min(0, { message: 'O preço deve ser maior ou igual a zero.' })
    @IsNotEmpty()
    price!: number;

    @ApiProperty({
        example: 10,
        description: 'Quantidade em estoque do produto.',
        default: 0,
        type: Number,
    })
    @IsNumber()
    @Min(0, { message: 'O estoque deve ser maior ou igual a zero.' })
    @IsOptional()
    stock?: number = 0;

    @ApiProperty({
        example: '2.0m x 1.0m x 0.8m',
        description: 'Dimensões do produto (tamanho).',
        required: false,
    })
    @IsString()
    @IsOptional()
    size?: string;

    @ApiProperty({
        example: 'Cinza Escuro',
        description: 'Cor principal do produto.',
        required: false,
    })
    @IsString()
    @IsOptional()
    color?: string;

    @ApiProperty({
        example: 'https://exemplo.com/sofa.jpg',
        description: 'URL da imagem principal.',
        required: false,
    })
    @IsString()
    @IsOptional()
    mainImage?: string;

    @ApiProperty({
        example: ['https://img1.com', 'https://img2.com'],
        description: 'Lista de imagens da galeria.',
        required: false,
        type: [String], // Indica array no Swagger
    })
    @IsOptional()
    @IsArray() 
    @IsString({ each: true }) // Valida se cada item do array é string
    images?: string[];

    @ApiProperty({
        example: true,
        description: 'Se o produto está disponível para venda.',
        default: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isAvailable?: boolean = true;

    @ApiProperty({
        example: false,
        description: 'Se o produto deve ser destacado na página inicial.',
        default: false,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean = false;

    @ApiProperty({
        example: 1,
        description: 'ID da categoria à qual o produto pertence.',
        required: false,
        type: Number,
    })
    @IsNumber()
    @IsOptional()
    categoryId?: number;
}
