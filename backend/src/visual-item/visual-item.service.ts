import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisualItemDto } from './dto/create-visual-item.dto';
import { UpdateVisualItemDto } from './dto/update-visual-item.dto';

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
    async findAll() {
        return this.prisma.visualItem.findMany({
            orderBy: [
                { sequence: 'asc' }, // Primeira regra
                { name: 'asc' }, // Segunda regra
            ],
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
