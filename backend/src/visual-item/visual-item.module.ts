import { Module } from '@nestjs/common';
import { VisualItemService } from './visual-item.service';
import { VisualItemController } from './visual-item.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 1. Importe o Prisma

@Module({
    imports: [PrismaModule], // 2. Adicione Prisma aos imports
    controllers: [VisualItemController],
    providers: [VisualItemService],
})
export class VisualItemModule {}
