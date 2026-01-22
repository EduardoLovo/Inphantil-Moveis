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
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
    imports: [
        HttpModule,
        PrismaModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '7d',
                },
            }),
        }),
        ConfigModule,
        RecaptchaModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, GoogleStrategy],
    exports: [PassportModule],
})
export class AuthModule {}
