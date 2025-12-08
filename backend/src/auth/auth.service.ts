import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client'; // Importe o enum Role
import { randomBytes } from 'crypto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    // 1. Crie a função para salvar o log no banco
    private async createLog(
        email: string,
        success: boolean,
        message: string,
        req?: any, // O request é opcional
        userId?: number,
    ) {
        // Tenta obter o IP real (pode variar dependendo do seu proxy/load balancer)
        // 1. Use req.header() para acessar os cabeçalhos de forma robusta
        const forwardedFor = req?.header('x-forwarded-for') || '';
        const userAgent = req?.header('user-agent') || 'N/A';

        // 2. Simplifique a obtenção do IP
        // Tenta obter o IP real (primeiro IP da lista x-forwarded-for), ou o IP direto, ou N/A
        const ipAddress = forwardedFor.split(',')[0].trim() || req?.ip || 'N/A';

        await this.prisma.authLog.create({
            data: {
                email,
                success,
                message,
                ipAddress,
                userAgent,
                userId,
            },
        });
    }
    /**
     * Registra um novo usuário no sistema
     */
    async register(dto: RegisterDto, req?: any) {
        // 1. Verificar se o usuário já existe
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            // ❌ LOG DE FALHA: Email já existe
            await this.createLog(
                dto.email,
                false,
                'Tentativa de registro falhou: Email já existe',
                req,
            );
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

        // ✅ LOG DE SUCESSO
        await this.createLog(
            user.email,
            true,
            'Registro de usuário bem-sucedido',
            req,
            user.id,
        );

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        // 6. Assinar o Token
        const accessToken = await this.jwtService.signAsync(payload);

        // 7. Preparar o objeto do usuário (sem senha)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;

        return {
            accessToken,
            user: userWithoutPassword,
        };
    }

    /**
     * Valida as credenciais do usuário e retorna um JWT se for bem-sucedido
     */
    async login(dto: LoginDto, req?: any): Promise<{ accessToken: string }> {
        // 1. Encontrar o usuário pelo email
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        // 2. Se o usuário não existir, lançar erro
        // (Usamos a mesma msg de senha inválida para não vazar se o email existe)
        if (!user) {
            // ❌ LOG DE FALHA: Email não encontrado
            await this.createLog(
                dto.email,
                false,
                'Login falhou: Email não encontrado',
                req,
            );
            throw new UnauthorizedException('Email ou senha inválidos');
        }

        // 3. Comparar a senha fornecida com o hash do banco
        const isMatch = await bcrypt.compare(dto.password, user.password);

        if (!isMatch) {
            // ❌ LOG DE FALHA: Senha inválida
            await this.createLog(
                dto.email,
                false,
                'Login falhou: Senha inválida',
                req,
            );
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

        // ✅ LOG DE SUCESSO
        await this.createLog(
            user.email,
            true,
            'Login bem-sucedido',
            req, // <--- Passando o Request
            user.id,
        );

        return {
            accessToken: accessToken,
        };
    }

    async updateProfile(userId: number, dto: UpdateUserDto) {
        const data: any = { ...dto };

        // Se estiver atualizando a senha, precisamos hashear novamente
        if (data.password) {
            const saltRounds = 10;
            data.password = await bcrypt.hash(data.password, saltRounds);
        }

        // Se estiver atualizando e-mail, verifique se já existe (opcional, mas recomendado)
        if (data.email) {
            const existing = await this.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (existing && existing.id !== userId) {
                throw new ConflictException('Email já está em uso.');
            }
        }

        const user = await this.prisma.user.update({
            where: { id: userId },
            data: data,
        });

        // Remove senha do retorno
        const { password, resetPasswordToken, ...result } = user;
        return result;
    }

    // 2. ESQUECI A SENHA (Gera Token)
    async forgotPassword(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Por segurança, não dizemos se o email não existe, apenas retornamos sucesso
            return { message: 'Se o e-mail existir, você receberá um link.' };
        }

        // Gera um token aleatório
        const token = randomBytes(32).toString('hex');
        const expires = new Date();
        expires.setHours(expires.getHours() + 1); // Expira em 1 hora

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: token,
                resetPasswordExpires: expires,
            },
        });

        // 📧 AQUI VOCÊ ENVIARIA O E-MAIL REAL (Nodemailer, SendGrid, etc)
        // Para dev, vamos logar no console:
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
        console.log(
            `\n📧 [SIMULAÇÃO DE EMAIL] Link de recuperação para ${email}: ${resetLink}\n`,
        );

        return {
            message: 'Link de recuperação enviado para o e-mail (ver console).',
        };
    }

    // 3. REDEFINIR SENHA (Usa Token)
    async resetPassword(token: string, newPassword: string) {
        // Busca usuário pelo token E verifica se não expirou
        const user = await this.prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() }, // Expiração > Agora
            },
        });

        if (!user) {
            throw new BadRequestException('Token inválido ou expirado.');
        }

        // Hashear nova senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null, // Limpa o token (uso único)
                resetPasswordExpires: null,
            },
        });

        return { message: 'Senha alterada com sucesso! Faça login.' };
    }
}
