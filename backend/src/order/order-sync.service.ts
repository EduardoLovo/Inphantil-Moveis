import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SevenService } from '../integrations/seven/seven.service';
import axios from 'axios';

@Injectable()
export class OrderSyncService {
    private readonly logger = new Logger(OrderSyncService.name);

    constructor(
        private prisma: PrismaService,
        private sevenService: SevenService,
    ) {}

    @Cron(CronExpression.EVERY_30_MINUTES)
    async handleCron() {
        this.logger.log('🔄 Iniciando varredura de status no Seven...');

        try {
            const pedidosAbertos = await this.prisma.order.findMany({
                where: {
                    status: { in: ['PAID', 'IN_PRODUCTION'] },
                    sevenId: { not: null }, // 👈 Proteção: Só busca se tiver o ID do ERP
                },
            });

            if (pedidosAbertos.length === 0) return;

            // 👉 Agora usamos a função do seu Service com elegância!
            const token = await this.sevenService.gerarToken();
            const url = String(process.env.SEVEN_API_URL);

            for (const pedido of pedidosAbertos) {
                try {
                    // 2. Usamos o SEVEN_ID na URL ao invés do nosso ID local
                    const response = await axios.get(
                        `${url}/resources/v1/pedido-venda/${pedido.sevenId}`, // 👈 Mudou aqui
                        { headers: { Authorization: token } },
                    );

                    // 👉 PEGANDO O NOME CERTO DA VARIÁVEL AGORA
                    const statusNoSeven =
                        response.data.statusPedido?.toUpperCase() || '';

                    this.logger.log(
                        `🔎 [TESTE] Pedido Site: #${pedido.id} | Status: "${statusNoSeven}"`,
                    );

                    // =========================================================
                    // 🛠️ REGRA 1: De "PAGO" para "EM PRODUÇÃO"
                    // =========================================================
                    if (
                        pedido.status === 'PAID' &&
                        statusNoSeven === 'ABERTO'
                    ) {
                        await this.prisma.order.update({
                            where: { id: pedido.id },
                            data: { status: 'IN_PRODUCTION' },
                        });
                        this.logger.log(
                            `⚙️ Pedido #${pedido.id} atualizado para IN_PRODUCTION!`,
                        );
                    }

                    // =========================================================
                    // 📦 REGRA 2: De "EM PRODUÇÃO" (ou PAGO) para "ENVIADO" (Importado/Faturado)
                    // =========================================================
                    if (statusNoSeven === 'IMPORTADO') {
                        await this.prisma.order.update({
                            where: { id: pedido.id },
                            data: { status: 'SHIPPED' },
                        });
                        this.logger.log(
                            `✅ Pedido #${pedido.id} atualizado para SHIPPED!`,
                        );
                    }
                } catch (error: any) {
                    this.logger.error(
                        `Erro ao checar pedido #${pedido.id}:`,
                        error.message,
                    );
                }
            }
        } catch (error: any) {
            this.logger.error('Erro na varredura geral:', error.message);
        }
    }
}
