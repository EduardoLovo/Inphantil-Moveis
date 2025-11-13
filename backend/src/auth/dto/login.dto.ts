import { ApiProperty } from '@nestjs/swagger'; // 1. Importe
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'joao.silva@email.com',
        description: 'Email de login',
    }) // 2. Adicione
    @IsEmail({}, { message: 'Email ou senha inválidos' })
    email!: string;

    @ApiProperty({
        example: 'MinhaSenhaForte123',
        description: 'Senha de login',
    }) // 3. Adicione
    @IsString()
    @IsNotEmpty({ message: 'Email ou senha inválidos' })
    password!: string;
}
