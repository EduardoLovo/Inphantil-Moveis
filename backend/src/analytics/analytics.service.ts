import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) {}

    async logAccess(path: string, ip?: string) {
        return this.prisma.siteAccess.create({
            data: { path, ip },
        });
    }

    async getStats() {
        // 1. Totais Gerais
        const total = await this.prisma.siteAccess.count();

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const today = await this.prisma.siteAccess.count({
            where: { createdAt: { gte: todayStart } },
        });

        // 2. Dados dos Últimos 5 dias
        const dailyMap = new Map<string, number>();

        // Inicializa os ultimos 5 dias (incluindo hoje)
        for (let i = 4; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            // Formata manualmente DD/MM para evitar erro de locale
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const key = `${day}/${month}`;
            dailyMap.set(key, 0);
        }

        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        fiveDaysAgo.setHours(0, 0, 0, 0);

        const lastDaysRaw = await this.prisma.siteAccess.findMany({
            where: { createdAt: { gte: fiveDaysAgo } },
            select: { createdAt: true },
        });

        lastDaysRaw.forEach((access) => {
            const d = new Date(access.createdAt);
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const key = `${day}/${month}`;

            if (dailyMap.has(key)) {
                dailyMap.set(key, dailyMap.get(key)! + 1);
            }
        });

        const dailyData = Array.from(dailyMap.entries()).map(
            ([name, value]) => ({ name, acessos: value }),
        );
        // Não precisa dar reverse() pois inserimos na ordem certa no loop for

        // 3. Dados Mensais
        const monthlyMap = new Map<string, number>();
        const months = [
            'Jan',
            'Fev',
            'Mar',
            'Abr',
            'Mai',
            'Jun',
            'Jul',
            'Ago',
            'Set',
            'Out',
            'Nov',
            'Dez',
        ];
        months.forEach((m) => monthlyMap.set(m, 0));

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const yearRaw = await this.prisma.siteAccess.findMany({
            where: { createdAt: { gte: startOfYear } },
            select: { createdAt: true },
        });

        yearRaw.forEach((access) => {
            const monthIndex = new Date(access.createdAt).getMonth();
            const key = months[monthIndex];
            if (monthlyMap.has(key)) {
                monthlyMap.set(key, monthlyMap.get(key)! + 1);
            }
        });

        const monthlyData = Array.from(monthlyMap.entries()).map(
            ([name, value]) => ({ name, acessos: value }),
        );

        return {
            total,
            today,
            dailyData,
            monthlyData,
        };
    }
}
