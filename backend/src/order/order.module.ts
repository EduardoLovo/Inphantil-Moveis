import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { HttpModule } from '@nestjs/axios';
import { SevenService } from 'src/integrations/seven/seven.service';
import { OrderSyncService } from './order-sync.service';

@Module({
    imports: [PrismaModule, MailModule, HttpModule], // Importe o Prisma
    controllers: [OrderController],
    providers: [OrderService, SevenService, OrderSyncService],
    exports: [OrderService],
})
export class OrderModule {}
