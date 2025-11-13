import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
// 1. Adicione "extends PrismaClient"
// 2. Adicione "implements OnModuleInit"
export class PrismaService extends PrismaClient implements OnModuleInit {
    // 3. Adicione este método para conectar ao banco
    async onModuleInit() {
        await this.$connect();
    }

    // Opcional, mas boa prática: desconectar ao fechar a app
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
