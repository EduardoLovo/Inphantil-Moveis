import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisualItemDto } from './dto/create-visual-item.dto';
import { UpdateVisualItemDto } from './dto/update-visual-item.dto';
import { Prisma, Role, VisualItemType } from '@prisma/client';

@Injectable()
export class VisualItemService {
    constructor(private prisma: PrismaService) {}

    // 1. Criar Item Visual
    async create(createVisualItemDto: CreateVisualItemDto) {
        // Verifica se já existe um item com o mesmo código (code)
        const existing = await this.prisma.visualItem.findUnique({
            where: { code: createVisualItemDto.code },
        });

        if (existing) {
            throw new ConflictException(
                `Item visual com código ${createVisualItemDto.code} já existe.`,
            );
        }

        return this.prisma.visualItem.create({
            data: createVisualItemDto,
        });
    }

    // 2. Listar Todos (Opcionalmente com filtros por tipo, cor, etc.)
    async findAll(type?: string, userRole?: Role) {
        let whereCondition: Prisma.VisualItemWhereInput = {};

        // 1. Filtragem por Tipo ("APLIQUE")
        if (type) {
            const typeEnum = type.toUpperCase() as VisualItemType;
            whereCondition.type = typeEnum;
        }

        // 2. LÓGICA DE VISIBILIDADE DE ESTOQUE CORRIGIDA

        // Apenas ADMIN e DEV têm a permissão irrestrita (podem ver inStock: false)
        const isUnrestrictedStaff =
            userRole === Role.ADMIN || userRole === Role.DEV;

        // Se o usuário NÃO for ADMIN ou DEV (ou seja, é USER, SELLER ou Deslogado),
        // APLICAMOS o filtro inStock: true.
        if (!isUnrestrictedStaff) {
            whereCondition = {
                ...whereCondition,
                inStock: true, // Filtra para mostrar apenas o que está em estoque
            };
        }
        // Se for ADMIN ou DEV, o whereCondition não recebe a cláusula inStock: true,
        // e o Prisma retorna todos os itens.

        return this.prisma.visualItem.findMany({
            where: whereCondition,
            orderBy: { code: 'asc' },
        });
    }

    // 3. Buscar por ID
    async findOne(id: number) {
        const item = await this.prisma.visualItem.findUnique({
            where: { id },
        });

        if (!item) {
            throw new NotFoundException(
                `Item visual com ID ${id} não encontrado.`,
            );
        }

        return item;
    }

    // 4. Atualizar Item
    async update(id: number, updateVisualItemDto: UpdateVisualItemDto) {
        await this.findOne(id); // Garante que o item existe (ou lança 404)

        return this.prisma.visualItem.update({
            where: { id },
            data: updateVisualItemDto,
        });
    }

    // 5. Remover Item
    async remove(id: number) {
        await this.findOne(id); // Garante que o item existe (ou lança 404)

        return this.prisma.visualItem.delete({
            where: { id },
        });
    }
}
