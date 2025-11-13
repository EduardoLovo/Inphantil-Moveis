import { ApiProperty } from '@nestjs/swagger'; // 1. Importe
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'João da Silva',
        description: 'Nome completo do usuário',
    }) // 2. Adicione
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        example: 'joao.silva@email.com',
        description: 'Email único do usuário',
    }) // 3. Adicione
    @IsEmail({}, { message: 'Por favor, informe um email válido' })
    email!: string;

    @ApiProperty({
        example: '11999998888',
        description: 'Telefone do usuário (com DDD)',
    })
    @IsString()
    @IsNotEmpty({ message: 'O telefone é obrigatório' })
    fone!: string;

    @ApiProperty({
        example: 'MinhaSenhaForte123',
        description: 'Senha com no mínimo 8 caracteres',
        minLength: 8,
    }) // 4. Adicione
    @IsString()
    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
    password!: string;
}
