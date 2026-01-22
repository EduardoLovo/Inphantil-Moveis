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
import { Role, User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpService } from '@nestjs/axios'; // 1. IMPORT NOVO
import { firstValueFrom } from 'rxjs'; // 2. IMPORT NOVO
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private mailerService: MailerService,
        private jwtService: JwtService,
        private readonly httpService: HttpService, // 3. INJEÇÃO NOVO
    ) {}

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

    private async generateToken(user: User) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        return {
            accessToken: await this.jwtService.signAsync(payload),
            user: {
                // Opcional: retornar dados do user se quiser usar no front
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar, // Se tiver adicionado ao schema
            },
        };
    }

    async register(dto: RegisterDto, req?: any) {
        // 1. Validação do Captcha
        if (dto.gRecaptchaResponse) {
            await this.validateRecaptcha(dto.gRecaptchaResponse);
        } else {
            // throw new BadRequestException('Validação anti-robô obrigatória.');
        }

        // 2. Verificar se email existe
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

        // 3. Hashear a senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

        // 4. Criar o usuário
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                fone: dto.fone,
                password: hashedPassword,
            },
        });

        // 5. Log de Sucesso
        await this.createLog(
            user.email,
            true,
            'Registro de usuário bem-sucedido',
            req,
            user.id,
        );

        // ✅ FINAL PADRONIZADO: Chama a função auxiliar
        return this.generateToken(user);
    }

    async login(dto: LoginDto, req?: any) {
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

        // Bloqueia login com senha vazia (usuários Google)
        if (!user.password) {
            await this.createLog(
                dto.email,
                false,
                'Tentativa de login com senha em conta Google',
                req,
            );
            throw new UnauthorizedException('Use o login com Google.');
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

        // ✅ AQUI MUDOU: Em vez de criar payload, chamamos a função auxiliar
        const tokenResult = await this.generateToken(user);

        // Log de sucesso
        await this.createLog(
            user.email,
            true,
            'Login bem-sucedido',
            req,
            user.id,
        );

        return tokenResult;
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

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Recuperação de Senha - Inphantil Móveis',
                html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Olá, ${user.name || 'Cliente'}!</h2>
                    <p>Recebemos uma solicitação para redefinir sua senha.</p>
                    <p>Para continuar, clique no botão abaixo:</p>
                    <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #666;">Se você não solicitou isso, ignore este e-mail.</p>
                    <p style="font-size: 12px; color: #666;">O link expira em 1 hora.</p>
                </div>
            `,
            });

            // Log para debug (opcional)
            console.log(`E-mail de recuperação enviado para: ${email}`);
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            // Opcional: lançar erro ou retornar mensagem genérica
            // throw new InternalServerErrorException('Erro ao enviar e-mail');
        }

        return {
            message: 'Se o e-mail existir, você receberá um link.',
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

    // Adicione ao AuthService
    async validateGoogleUser(googleUser: any) {
        const { email, firstName, lastName, googleId, picture } = googleUser;

        let user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (user) {
            // Se o usuário existe mas não tem googleId, vincula a conta
            if (!user.googleId) {
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: { googleId, avatar: picture },
                });
            }
        } else {
            // Cria novo usuário se não existir
            // Nota: Defina uma senha aleatória ou deixe null se seu schema permitir
            user = await this.prisma.user.create({
                data: {
                    email,
                    name: `${firstName} ${lastName}`,
                    googleId,
                    avatar: picture,
                    password: '', // ou gere um hash aleatório se password for obrigatório
                    fone: '',
                },
            });
        }

        return this.generateToken(user);
    }
}
