import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importe o Prisma

@Module({
    imports: [PrismaModule], // Adicione aos imports
    controllers: [AddressController],
    providers: [AddressService],
})
export class AddressModule {}
