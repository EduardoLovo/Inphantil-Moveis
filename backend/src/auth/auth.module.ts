import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 1. Importe o PrismaModule
import { PassportModule } from '@nestjs/passport'; // 2. Importe o PassportModule
import { JwtModule } from '@nestjs/jwt'; // 3. Importe o JwtModule
import { ConfigModule, ConfigService } from '@nestjs/config'; // 4. Importe Configs
import { JwtStrategy } from './jwt.strategy';
import { RecaptchaModule } from 'src/recaptcha/recaptcha.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule,
        PrismaModule, // Para o AuthService poder usar o PrismaClient
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule], // Importe o ConfigModule aqui
            inject: [ConfigService], // Injete o ConfigService
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'), // Use o ConfigService para ler a variável
                signOptions: {
                    expiresIn: '1d', // Token expira em 1 dia
                },
            }),
        }),
        ConfigModule,
        RecaptchaModule, // Garante que o ConfigService está disponível
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [PassportModule], // (Mais tarde adicionaremos a JwtStrategy aqui)
})
export class AuthModule {}
