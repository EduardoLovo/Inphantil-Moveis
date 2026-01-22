import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
        const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');

        if (!clientID || !clientSecret) {
            throw new Error(
                'As variáveis GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET não estão definidas no arquivo .env',
            );
        }
        super({
            clientID,
            clientSecret,
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
            passReqToCallback: true, // Adicionamos isso para corrigir o erro de tipagem ts(2345)
        });
    }

    // Com passReqToCallback: true, o primeiro argumento vira o 'req'
    async validate(
        _req: any, // O request vem primeiro agora (usamos _ para indicar que não vamos usar aqui)
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, photos } = profile;

        // Verificação de segurança simples
        if (!emails || !emails[0]) {
            return done(
                new UnauthorizedException('Email não fornecido pelo Google'),
                false,
            );
        }

        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            googleId: profile.id,
            accessToken,
        };

        done(null, user);
    }
}
