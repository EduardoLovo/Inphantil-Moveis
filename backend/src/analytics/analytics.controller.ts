import { Controller, Post, Get, Body, Ip } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Public()
    @Post('visit')
    registerVisit(@Body('path') path: string, @Ip() ip: string) {
        return this.analyticsService.logAccess(path, ip);
    }

    @Get('stats')
    async getStats() {
        // CORREÇÃO: Chama o método certo "getStats()" em vez de "getTotalAccesses()"
        return this.analyticsService.getStats();
    }
}
