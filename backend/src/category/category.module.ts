import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        PrismaModule, // 3. Adicione o Prisma aqui para o Service funcionar
        AuthModule, // 4. Adicione o Auth aqui para os Guards funcionarem
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
})
export class CategoryModule {}
