import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule], // Importante: Importamos o Prisma para acessar o banco
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
    exports: [AnalyticsService], // Opcional, caso outro módulo precise usar o serviço
})
export class AnalyticsModule {}
