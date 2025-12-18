import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
    ForbiddenException, // Adicionado para falha no captcha
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { randomBytes } from 'crypto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpService } from '@nestjs/axios'; // 1. IMPORT NOVO
import { firstValueFrom } from 'rxjs'; // 2. IMPORT NOVO

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private readonly httpService: HttpService, // 3. INJEÇÃO NOVO
    ) {}

    // --- VALIDAÇÃO DO RECAPTCHA (NOVO MÉTODO) ---
    private async validateRecaptcha(token: string) {
        if (!token) {
            throw new BadRequestException('Captcha token é obrigatório.');
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

        try {
            const { data } = await firstValueFrom(
                this.httpService.post(verifyUrl),
            );

            if (!data.success || data.score < 0.5) {
                throw new ForbiddenException(
                    'Atividade suspeita detectada (Bot). Tente novamente.',
                );
            }

            return true;
        } catch (error) {
            throw new ForbiddenException('Não foi possível validar o Captcha.');
        }
    }

    // ... (método createLog permanece igual) ...
    private async createLog(
        email: string,
        success: boolean,
        message: string,
        req?: any,
        userId?: number,
    ) {
        const forwardedFor = req?.header('x-forwarded-for') || '';
        const userAgent = req?.header('user-agent') || 'N/A';
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
        // 4. CHAMADA DA VALIDAÇÃO DO CAPTCHA
        // Se estiver em ambiente de desenvolvimento e quiser pular, pode colocar um if aqui.
        // Mas para produção, isso é essencial:
        if (dto.gRecaptchaResponse) {
            await this.validateRecaptcha(dto.gRecaptchaResponse);
        } else {
            // Se quiser obrigar o captcha, descomente a linha abaixo:
            throw new BadRequestException('Validação anti-robô obrigatória.');
        }

        // 1. Verificar se o usuário já existe
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
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

        const accessToken = await this.jwtService.signAsync(payload);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;

        return {
            accessToken,
            user: userWithoutPassword,
        };
    }

    // ... (métodos login, updateProfile, forgotPassword, resetPassword permanecem iguais) ...
    async login(dto: LoginDto, req?: any): Promise<{ accessToken: string }> {
        if (dto.gRecaptchaResponse) {
            await this.validateRecaptcha(dto.gRecaptchaResponse);
        } else {
            // Se quiser obrigar o captcha, descomente a linha abaixo:
            throw new BadRequestException('Validação anti-robô obrigatória.');
        }

        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            await this.createLog(
                dto.email,
                false,
                'Login falhou: Email não encontrado',
                req,
            );
            throw new UnauthorizedException('Email ou senha inválidos');
        }

        const isMatch = await bcrypt.compare(dto.password, user.password);

        if (!isMatch) {
            await this.createLog(
                dto.email,
                false,
                'Login falhou: Senha inválida',
                req,
            );
            throw new UnauthorizedException('Email ou senha inválidos');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role as Role,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        await this.createLog(
            user.email,
            true,
            'Login bem-sucedido',
            req,
            user.id,
        );

        return {
            accessToken: accessToken,
        };
    }

    async updateProfile(userId: number, dto: UpdateUserDto) {
        const data: any = { ...dto };

        if (data.password) {
            const saltRounds = 10;
            data.password = await bcrypt.hash(data.password, saltRounds);
        }

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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, resetPasswordToken, ...result } = user;
        return result;
    }

    async forgotPassword(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: 'Se o e-mail existir, você receberá um link.' };
        }

        const token = randomBytes(32).toString('hex');
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: token,
                resetPasswordExpires: expires,
            },
        });

        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
        console.log(
            `\n📧 [SIMULAÇÃO DE EMAIL] Link de recuperação para ${email}: ${resetLink}\n`,
        );

        return {
            message: 'Link de recuperação enviado para o e-mail (ver console).',
        };
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() },
            },
        });

        if (!user) {
            throw new BadRequestException('Token inválido ou expirado.');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        return { message: 'Senha alterada com sucesso! Faça login.' };
    }
}
