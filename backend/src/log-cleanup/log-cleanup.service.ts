import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

// Definição: 30 dias em milissegundos
const LOG_RETENTION_DAYS = 3;

@Injectable()
export class LogCleanupService {
    private readonly logger = new Logger(LogCleanupService.name);

    constructor(private prisma: PrismaService) {}

    /**
     * Tarefa Cron que roda todo dia à meia-noite (00:00) para limpar logs antigos.
     * CronExpression.EVERY_DAY_AT_MIDNIGHT é um padrão seguro.
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleLogCleanup() {
        this.logger.log('Iniciando limpeza de logs antigos...');

        // 1. Calcula a data limite (30 dias atrás)
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - LOG_RETENTION_DAYS);

        try {
            // 2. Executa a deleção no banco de dados
            const result = await this.prisma.authLog.deleteMany({
                where: {
                    createdAt: {
                        // lt: "Less Than" - deleta todos os logs *anteriores* à data limite
                        lt: thresholdDate,
                    },
                },
            });

            this.logger.log(
                `Limpeza concluída. ${result.count} logs (anteriores a ${thresholdDate.toISOString().split('T')[0]}) foram excluídos.`,
            );
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
