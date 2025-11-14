import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogService {
    constructor(private prisma: PrismaService) {}

    async findAllAuthLogs() {
        return this.prisma.authLog.findMany({
            orderBy: {
                createdAt: 'desc', // Logs mais recentes primeiro
            },
            take: 100, // Limita para não carregar demais (pega os 100 últimos)
        });
    }
}
