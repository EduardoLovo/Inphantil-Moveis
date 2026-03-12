import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    private parseProductData(dto: CreateProductDto | UpdateProductDto) {
        const data: any = { ...dto };
        if (data.price !== undefined) data.price = Number(data.price);
        if (data.stock !== undefined) data.stock = Number(data.stock);
        if (data.categoryId !== undefined)
            data.categoryId = Number(data.categoryId);
        if (data.name && !data.slug) {
            data.slug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-*|-*$/g, '');
        }
        return data;
    }

    async create(createProductDto: CreateProductDto) {
        const { images, variants, ...rest } =
            this.parseProductData(createProductDto);

        return this.prisma.product.create({
            data: {
                ...rest,
                // Cria imagens do produto base
                images: {
                    create:
                        images && Array.isArray(images)
                            ? images.map((url: string) => ({ url }))
                            : [],
                },
                // Cria Variações e suas Imagens
                variants: {
                    create: variants
                        ? variants.map((v: any) => ({
                              color: v.color,
                              size: v.size,
                              complement: v.complement,
                              price: Number(v.price),
                              stock: Number(v.stock),
                              sku: v.sku,
                              isFeatured: v.isFeatured,
                              images: {
                                  create: v.images
                                      ? v.images.map((img: any) => ({
                                            url: img.url,
                                        }))
                                      : [],
                              },
                          }))
                        : [],
                },
            },
            include: { images: true, variants: { include: { images: true } } },
        });
    }

    async findAll() {
        return this.prisma.product.findMany({
            include: {
                category: true,
                images: true,
                variants: { include: { images: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: true,
                variants: { include: { images: true } },
            },
        });
        if (!product)
            throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        await this.findOne(id);
        const { images, variants, ...rest } =
            this.parseProductData(updateProductDto);

        // O jeito mais simples de atualizar Variações complexas é apagar as antigas e recriar as novas
        if (variants) {
            await this.prisma.productVariant.deleteMany({
                where: { productId: id },
            });
        }

        return this.prisma.product.update({
            where: { id },
            data: {
                ...rest,
                images: images
                    ? {
                          deleteMany: {},
                          create: images.map((url: string) => ({ url })),
                      }
                    : undefined,
                variants: variants
                    ? {
                          create: variants.map((v: any) => ({
                              color: v.color,
                              size: v.size,
                              complement: v.complement,
                              price: Number(v.price),
                              stock: Number(v.stock),
                              sku: v.sku,
                              isFeatured: v.isFeatured,
                              images: {
                                  create: v.images
                                      ? v.images.map((img: any) => ({
                                            url: img.url,
                                        }))
                                      : [],
                              },
                          })),
                      }
                    : undefined,
            },
            include: { images: true, variants: { include: { images: true } } },
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.product.delete({ where: { id } });
    }
}
