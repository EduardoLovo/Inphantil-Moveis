import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    // Função utilitária para garantir que os campos numéricos sejam tratados corretamente
    private parseProductData(dto: CreateProductDto | UpdateProductDto) {
        const data: any = { ...dto };

        // Converte Price e Stock para o tipo Number se existirem
        if (data.price !== undefined) {
            data.price = Number(data.price);
        }
        if (data.stock !== undefined) {
            data.stock = Number(data.stock);
        }
        if (data.categoryId !== undefined) {
            data.categoryId = Number(data.categoryId);
        }

        // Converte slug se o nome for fornecido e o slug não
        if (data.name && !data.slug) {
            // Simple slug generation: lowercase, replace spaces with hyphens (idealmente, usar uma lib)
            data.slug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-*|-*$/g, '');
        }

        return data;
    }

    // 1. Criar Produto
    async create(createProductDto: CreateProductDto) {
        // Separa as imagens do resto dos dados
        const { images, ...rest } = this.parseProductData(createProductDto);

        return this.prisma.product.create({
            data: {
                ...rest,
                images: {
                    create:
                        images && Array.isArray(images)
                            ? images.map((url: string) => ({ url }))
                            : [],
                },
            },
            include: { images: true }, // Retorna o produto com as imagens criadas
        });
    }

    // 2. Listar Todos (Inclui a categoria para contexto)
    async findAll() {
        return this.prisma.product.findMany({
            include: {
                category: true, // Inclui os dados da categoria relacionada
                images: true, // <--- IMPORTANTE: Incluir as imagens na busca
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    // 3. Buscar por ID
    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true, // Inclui os dados da categoria
                images: true, // <--- IMPORTANTE: Incluir as imagens
            },
        });

        if (!product) {
            throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
        }
        return product;
    }

    // 4. Atualizar Produto
    async update(id: number, updateProductDto: UpdateProductDto) {
        await this.findOne(id);

        const { images, ...rest } = this.parseProductData(updateProductDto);

        return this.prisma.product.update({
            where: { id },
            data: {
                ...rest,
                images: images
                    ? {
                          deleteMany: {}, // 1. Apaga todas as imagens antigas deste produto
                          create: images.map((url: string) => ({ url })),
                      }
                    : undefined,
            },
            include: { images: true },
        });
    }

    // 5. Remover Produto
    async remove(id: number) {
        await this.findOne(id); // Verifica se existe e lança 404

        return this.prisma.product.delete({
            where: { id },
        });
    }
}
