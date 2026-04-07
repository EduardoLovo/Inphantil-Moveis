import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderModule } from 'src/order/order.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [HttpModule, OrderModule, PrismaModule],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService], // Exportamos caso o OrderModule precise usar diretamente
})
export class PaymentModule {}
