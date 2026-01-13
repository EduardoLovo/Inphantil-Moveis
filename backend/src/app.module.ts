import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'; // ⬅️ Importe o APP_GUARD
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'; // Importe
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/log.module';
import { RecaptchaModule } from './recaptcha/recaptcha.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { AddressModule } from './address/address.module';
import { OrderModule } from './order/order.module';
import { VisualItemModule } from './visual-item/visual-item.module';
import { SocialModule } from './social/social.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LogCleanupModule } from './log-cleanup/log-cleanup.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'; // ⬅️ Importe seu guarda
import { ContactModule } from './contact/contact.module';
import { EnvironmentModule } from './environment/environment.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AnalyticsModule } from './analytics/analytics.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            // Adicione esta linha
            isGlobal: true, // Torna as configs globais
        }),
        MailerModule.forRoot({
            transport: {
                host: process.env.MAIL_HOST,
                port: Number(process.env.MAIL_PORT),
                secure: false, // true para 465, false para outras portas
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            },
            defaults: {
                from:
                    process.env.MAIL_FROM || '"No Reply" <noreply@example.com>',
            },
        }),
        PrismaModule,
        AuthModule,
        LogModule,
        RecaptchaModule,
        ProductModule,
        CategoryModule,
        AddressModule,
        OrderModule,
        VisualItemModule,
        SocialModule,
        LogCleanupModule,
        ContactModule,
        EnvironmentModule,
        AnalyticsModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard, // ⬅️ Aplica este guarda a toda a aplicação
        },
        AppService,
    ],
})
export class AppModule {}
