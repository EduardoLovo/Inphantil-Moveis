import { Injectable, Logger, OnModuleInit } from '@nestjs/common'; // <-- Importe OnModuleInit
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

const LOG_RETENTION_DAYS = 30; // Coloquei 30 dias de fato

@Injectable()
export class LogCleanupService implements OnModuleInit {
    // <-- Implemente a interface
    private readonly logger = new Logger(LogCleanupService.name);

    constructor(private prisma: PrismaService) {}

    // Roda assim que o servidor subir (Garante a limpeza se o servidor dormir na madrugada)
    async onModuleInit() {
        this.logger.log(
            'Servidor iniciado. Verificando logs antigos para limpeza...',
        );
        await this.handleLogCleanup();
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleLogCleanup() {
        this.logger.log('Iniciando rotina de limpeza de logs antigos...');

        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - LOG_RETENTION_DAYS);

        try {
            const result = await this.prisma.authLog.deleteMany({
                where: {
                    createdAt: {
                        lt: thresholdDate,
                    },
                },
            });

            if (result.count > 0) {
                this.logger.log(
                    `Limpeza concluída. ${result.count} logs (anteriores a ${thresholdDate.toISOString().split('T')[0]}) foram excluídos.`,
                );
            } else {
                this.logger.log('Nenhum log antigo precisou ser apagado hoje.');
            }
        } catch (error) {
            const errorStack =
                error instanceof Error ? error.stack : String(error);
            this.logger.error(
                'Falha ao executar a limpeza de logs:',
                errorStack,
            );
        }
    }
}
