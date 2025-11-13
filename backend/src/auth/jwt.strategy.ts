import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        // 1. Pegue o segredo ANTES do super()
        const secret = configService.get<string>('JWT_SECRET');

        // 2. Verifique se ele existe (melhor prática)
        if (!secret) {
            throw new Error(
                'Segredo JWT (JWT_SECRET) não encontrado nas variáveis de ambiente.',
            );
        }

        // 3. Agora passe a variável 'secret' (que o TS sabe que é uma string)
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret, // <-- Use a variável 'secret' aqui
        });
    }

    /**
     * Este método é chamado pelo Passport DEPOIS que ele verifica
     * com sucesso a assinatura do JWT.
     * O 'payload' é o conteúdo descriptografado do token.
     */
    async validate(payload: { sub: number; email: string; role: string }) {
        // Encontra o usuário no banco com base no ID ('sub') do token
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user) {
            throw new UnauthorizedException(
                'Usuário não encontrado ou token inválido',
            );
        }

        // Remove a senha do objeto de usuário
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;

        // O que for retornado aqui será anexado ao request.user
        return result;
    }
}
