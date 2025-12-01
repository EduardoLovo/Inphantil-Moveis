import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateContactDto {
    @ApiProperty({ example: 'Maria Silva', description: 'Nome do cliente' })
    @IsString()
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    name!: string;

    @ApiProperty({
        example: 'maria@email.com',
        description: 'Email para contato',
    })
    @IsEmail({}, { message: 'Email inválido' })
    email!: string;

    @ApiProperty({
        example: 'Dúvida sobre entrega',
        description: 'Assunto da mensagem',
    })
    @IsString()
    @IsNotEmpty({ message: 'O assunto é obrigatório' })
    subject!: string;

    @ApiProperty({
        example: 'Gostaria de saber se...',
        description: 'Mensagem detalhada',
    })
    @IsString()
    @IsNotEmpty({ message: 'A mensagem é obrigatória' })
    @MinLength(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' })
    message!: string;
}
