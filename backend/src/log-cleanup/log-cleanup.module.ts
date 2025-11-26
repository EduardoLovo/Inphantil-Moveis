import { Module } from '@nestjs/common';
import { LogCleanupService } from './log-cleanup.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule], // Necessário para usar o PrismaService
    providers: [LogCleanupService],
})
export class LogCleanupModule {}
