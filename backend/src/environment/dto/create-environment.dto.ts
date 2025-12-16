import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsUrl } from 'class-validator';

export class CreateEnvironmentDto {
    @ApiProperty({
        example: 'Quarto Azul',
        description: 'Título do ambiente/inspiração',
    })
    @IsString()
    @IsNotEmpty()
    title!: string; // O "!" diz ao TypeScript que essa propriedade vai existir

    @ApiProperty({
        example:
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765558529/capa.jpg',
        description: 'URL da imagem de capa',
    })
    @IsString()
    @IsNotEmpty()
    cover!: string;

    @ApiProperty({
        example: [
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765558529/foto1.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765558534/foto2.jpg',
        ],
        description: 'Lista de URLs das imagens da galeria',
        type: [String],
    })
    @IsArray()
    @IsString({ each: true }) // Valida se cada item DENTRO do array é uma string
    images!: string[];
}
