import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        PrismaModule, // 3. Adicione o Prisma aqui para o Service funcionar
        AuthModule, // 4. Adicione o Auth aqui para os Guards funcionarem
    ],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
