import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'; // Importe
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/log.module';
import { RecaptchaModule } from './recaptcha/recaptcha.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Adicione esta linha
      isGlobal: true, // Torna as configs globais
    }),
    PrismaModule,
    AuthModule,
    LogModule,
    RecaptchaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
