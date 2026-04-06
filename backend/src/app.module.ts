import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'; // ⬅️ Importe o APP_GUARD
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importe
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
import { ProxyModule } from './proxy/proxy.module';
import { ShippingQuoteModule } from './shipping-quote/shipping-quote.module';
import { PaymentModule } from './payment/payment.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'; // <-- 1. Importar aqui

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // Tempo em milissegundos (60.000 = 1 minuto)
                limit: 10, // Limite de requisições nesse tempo
            },
        ]),
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            // Adicione esta linha
            isGlobal: true, // Torna as configs globais
        }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get('SMTP_HOST'),
                    port: config.get('SMTP_PORT'),
                    secure: true, // true para a porta 465 do Zoho
                    auth: {
                        user: config.get('SMTP_USER'),
                        pass: config.get('SMTP_PASS'),
                    },
                },
                defaults: {
                    // IMPORTANTE: O Zoho exige que o "from" seja EXATAMENTE o mesmo do SMTP_USER
                    from: `"Inphantil Móveis" <${config.get('SMTP_USER')}>`,
                },
            }),
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
        ProxyModule,
        ShippingQuoteModule,
        PaymentModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard, // ⬅️ Aplica este guarda a toda a aplicação
        },
        AppService,
    ],
})
export class AppModule {}
