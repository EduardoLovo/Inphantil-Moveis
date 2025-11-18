import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'; // Importe
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/log.module';
import { RecaptchaModule } from './recaptcha/recaptcha.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

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
    ProductModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
