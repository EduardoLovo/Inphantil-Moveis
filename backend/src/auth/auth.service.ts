import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client'; // Importe o enum Role

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    /**
     * Registra um novo usuário no sistema
     */
    async register(dto: RegisterDto) {
        // 1. Verificar se o usuário já existe
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Um usuário com este email já existe');
        }

        // 2. Hashear a senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

        // 3. Criar o usuário no banco
        // Note: A 'role' será 'USER' por padrão, conforme definido no schema.prisma
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                fone: dto.fone,
                password: hashedPassword,
            },
        });

        // 4. Retornar o usuário (sem a senha)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
    }

    /**
     * Valida as credenciais do usuário e retorna um JWT se for bem-sucedido
     */
    async login(dto: LoginDto): Promise<{ accessToken: string }> {
        // 1. Encontrar o usuário pelo email
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        // 2. Se o usuário não existir, lançar erro
        // (Usamos a mesma msg de senha inválida para não vazar se o email existe)
        if (!user) {
            throw new UnauthorizedException('Email ou senha inválidos');
        }

        // 3. Comparar a senha fornecida com o hash do banco
        const isMatch = await bcrypt.compare(dto.password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Email ou senha inválidos');
        }

        // 4. Criar o payload do JWT
        // O payload é a informação que será armazenada dentro do token
        const payload = {
            sub: user.id, // 'sub' (subject) é o ID do usuário (padrão JWT)
            email: user.email,
            role: user.role as Role, // Incluímos o papel do usuário no token
        };

        // 5. Assinar e retornar o token
        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken: accessToken,
        };
    }
}
