import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({
        example: 'Sala de Estar',
        description: 'Nome da categoria.',
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        example: 'sala-de-estar',
        description:
            'Slug para URL amigável (opcional, gerado automaticamente se vazio).',
        required: false,
    })
    @IsString()
    @IsOptional()
    slug?: string;
}
