import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class CreateAddressDto {
    @ApiProperty({
        example: 'Casa da Vó Maria',
        description: 'Nome do destinatário ou apelido do local.',
    })
    @IsString()
    @IsNotEmpty()
    recipientName!: string;

    @ApiProperty({ example: '86800-000', description: 'CEP do endereço.' })
    @IsString()
    @IsNotEmpty()
    @Length(8, 9) // Aceita com ou sem traço
    zipCode!: string;

    @ApiProperty({ example: 'Rua das Flores', description: 'Logradouro.' })
    @IsString()
    @IsNotEmpty()
    street!: string;

    @ApiProperty({ example: '123', description: 'Número.' })
    @IsString() // String para aceitar 'S/N'
    @IsNotEmpty()
    number!: string;

    @ApiProperty({
        example: 'Apto 402',
        description: 'Complemento.',
        required: false,
    })
    @IsString()
    @IsOptional()
    complement?: string;

    @ApiProperty({ example: 'Centro', description: 'Bairro.' })
    @IsString()
    @IsNotEmpty()
    neighborhood!: string;

    @ApiProperty({ example: 'Jandaia do Sul', description: 'Cidade.' })
    @IsString()
    @IsNotEmpty()
    city!: string;

    @ApiProperty({
        example: 'PR',
        description: 'Sigla do Estado (UF).',
        minLength: 2,
        maxLength: 2,
    })
    @IsString()
    @Length(2, 2)
    state!: string;

    @ApiProperty({
        example: true,
        description: 'Se este é o endereço principal.',
        default: false,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isDefault?: boolean = false;
}
