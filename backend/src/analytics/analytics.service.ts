import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) {}

    async logAccess(path: string, ip?: string) {
        const safePath = path ? path.substring(0, 190) : '';
        const safeIp = ip ? ip.substring(0, 45) : '';

        return this.prisma.siteAccess.create({
            data: {
                path: safePath,
                ip: safeIp,
            },
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

        // ====================================================
        // 2. DADOS DIÁRIOS (Últimos 5 dias)
        // ====================================================
        const dailyMap = new Map<string, { total: number; ips: Set<string> }>();

        for (let i = 4; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const key = `${day}/${month}`;
            dailyMap.set(key, { total: 0, ips: new Set() });
        }

        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        fiveDaysAgo.setHours(0, 0, 0, 0);

        const lastDaysRaw = await this.prisma.siteAccess.findMany({
            where: { createdAt: { gte: fiveDaysAgo } },
            select: { createdAt: true, ip: true },
        });

        lastDaysRaw.forEach((access) => {
            const d = new Date(access.createdAt);
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const key = `${day}/${month}`;

            if (dailyMap.has(key)) {
                const entry = dailyMap.get(key)!;
                entry.total += 1;
                if (access.ip) entry.ips.add(access.ip);
            }
        });

        const dailyData = Array.from(dailyMap.entries()).map(
            ([name, data]) => ({
                name,
                acessos: data.total,
                unicos: data.ips.size,
            }),
        );

        // ====================================================
        // 3. DADOS MENSAIS (Ano Atual) - AGORA COM VISTANTES ÚNICOS
        // ====================================================
        const monthlyMap = new Map<
            string,
            { total: number; ips: Set<string> }
        >();
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

        // Inicializa todos os meses do ano
        months.forEach((m) => monthlyMap.set(m, { total: 0, ips: new Set() }));

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const yearRaw = await this.prisma.siteAccess.findMany({
            where: { createdAt: { gte: startOfYear } },
            select: { createdAt: true, ip: true }, // Importante: trazer o IP
        });

        yearRaw.forEach((access) => {
            const monthIndex = new Date(access.createdAt).getMonth();
            const key = months[monthIndex];

            if (monthlyMap.has(key)) {
                const entry = monthlyMap.get(key)!;
                entry.total += 1;
                if (access.ip) entry.ips.add(access.ip);
            }
        });

        const monthlyData = Array.from(monthlyMap.entries()).map(
            ([name, data]) => ({
                name,
                acessos: data.total,
                unicos: data.ips.size,
            }),
        );

        return {
            total,
            today,
            dailyData,
            monthlyData,
        };
    }
}
