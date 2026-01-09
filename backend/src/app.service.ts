import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
    constructor(private prisma: PrismaService) {}
    getHello(): string {
        // Mude o texto aqui para o que você quiser
        return 'Bem-vindo a API da Inphantil Móveis! 🚀';
    }
}
