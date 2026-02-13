import { Module } from '@nestjs/common';
import { ShippingQuoteService } from './shipping-quote.service';
import { ShippingQuoteController } from './shipping-quote.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ShippingQuoteController],
    providers: [ShippingQuoteService],
})
export class ShippingQuoteModule {}
