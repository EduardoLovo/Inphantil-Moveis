import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    // Utilitário para gerar slug
    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-*|-*$/g, '');
    }

    async create(createCategoryDto: CreateCategoryDto) {
        // Se não vier slug, gera a partir do nome
        if (!createCategoryDto.slug) {
            createCategoryDto.slug = this.generateSlug(createCategoryDto.name);
        }

        // Verifica se já existe (pelo nome ou slug)
        const existing = await this.prisma.category.findFirst({
            where: {
                OR: [
                    { name: createCategoryDto.name },
                    { slug: createCategoryDto.slug },
                ],
            },
        });

        if (existing) {
            throw new ConflictException(
                'Categoria já existe (nome ou slug duplicado).',
            );
        }

        return this.prisma.category.create({
            data: {
                name: createCategoryDto.name,
                slug: createCategoryDto.slug,
            },
        });
    }

    async findAll() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { products: true }, // Retorna a contagem de produtos na categoria
                },
            },
        });
    }

    async findOne(id: number) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                products: true, // Opcional: trazer os produtos dessa categoria
            },
        });

        if (!category) {
            throw new NotFoundException(
                `Categoria com ID ${id} não encontrada.`,
            );
        }

        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        await this.findOne(id); // Verifica existência

        // Se o nome mudar e o slug não for informado, atualiza o slug também
        if (updateCategoryDto.name && !updateCategoryDto.slug) {
            updateCategoryDto.slug = this.generateSlug(updateCategoryDto.name);
        }

        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
        });
    }

    async remove(id: number) {
        await this.findOne(id); // Verifica existência

        // Opcional: Bloquear deleção se houver produtos vinculados
        // const productsCount = await this.prisma.product.count({ where: { categoryId: id } });
        // if (productsCount > 0) throw new BadRequestException('Categoria possui produtos vinculados.');

        return this.prisma.category.delete({
            where: { id },
        });
    }
}
