import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    // 1. Limpa os dados velhos que o React envia mas o Prisma não quer mais
    private parseProductData(dto: any) {
        const data: any = { ...dto };
        delete data.price;
        delete data.stock;
        delete data.sku;
        delete data.images;

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

    // 2. ⚡ A MÁGICA: Pega o JSON do banco e espalha para o React entender
    private formatVariantsForResponse(product: any) {
        if (product && product.variants) {
            product.variants = product.variants.map((v: any) => {
                const { attributes, ...rest } = v;
                return {
                    ...rest,
                    // Despeja cor, tamanho, etc do JSON de volta pra raiz do objeto
                    ...(typeof attributes === 'object' && attributes !== null
                        ? attributes
                        : {}),
                };
            });
        }
        return product;
    }

    async create(createProductDto: CreateProductDto) {
        const { variants, ...rawRest } = createProductDto;
        const rest = this.parseProductData(rawRest);

        const createdProduct = await this.prisma.product.create({
            data: {
                ...rest,
                variants: {
                    create: variants
                        ? variants.map((v: any) => ({
                              price: Number(v.price),
                              stock: Number(v.stock),
                              sku: v.sku,
                              isFeatured: v.isFeatured || false,
                              // EMPACOTANDO NO JSON DINÂMICO!
                              attributes: {
                                  color: v.color,
                                  size: v.size,
                                  complement: v.complement,
                              },
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
            include: {
                category: true,
                variants: { include: { images: true } },
            },
        });

        return this.formatVariantsForResponse(createdProduct);
    }

    async findAll() {
        const products = await this.prisma.product.findMany({
            include: {
                category: true,
                variants: { include: { images: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return products.map((p) => this.formatVariantsForResponse(p));
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                variants: { include: { images: true } },
            },
        });
        if (!product)
            throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
        return this.formatVariantsForResponse(product);
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        await this.findOne(id);
        const { variants, ...rawRest } = updateProductDto;
        const rest = this.parseProductData(rawRest);

        // 1. Atualiza os dados básicos do produto
        await this.prisma.product.update({
            where: { id },
            data: rest,
        });

        if (variants) {
            // 2. Busca as variações que já existem no banco
            const existingVariants = await this.prisma.productVariant.findMany({
                where: { productId: id },
            });

            // Cria uma "assinatura" para cada variação nova (Cor + Tamanho + Complemento)
            const incomingSignatures = variants.map((v: any) =>
                `${v.color || ''}|${v.size || ''}|${v.complement || ''}`.toLowerCase(),
            );

            // 3. Limpa as antigas de forma inteligente
            for (const ev of existingVariants) {
                const attrs: any = ev.attributes || {};
                const evSig =
                    `${attrs.color || ''}|${attrs.size || ''}|${attrs.complement || ''}`.toLowerCase();

                // Se a variação do banco NÃO veio na lista do React (foi deletada no Admin)
                if (!incomingSignatures.includes(evSig)) {
                    try {
                        // Tenta deletar a variação de verdade
                        await this.prisma.productVariant.delete({
                            where: { id: ev.id },
                        });
                    } catch (error) {
                        // 🛡️ O BANCO BARROU! Tem pedido salvo nela.
                        // Solução: Zera o estoque para sumir da vitrine, mas preserva a linha!
                        await this.prisma.productVariant.update({
                            where: { id: ev.id },
                            data: { stock: 0 },
                        });
                    }
                }
            }

            // 4. Salva as novas (Atualiza se já existir, Cria se for nova)
            for (const v of variants) {
                const vSig =
                    `${v.color || ''}|${v.size || ''}|${v.complement || ''}`.toLowerCase();

                const existing = existingVariants.find((ev) => {
                    const attrs: any = ev.attributes || {};
                    const evSig =
                        `${attrs.color || ''}|${attrs.size || ''}|${attrs.complement || ''}`.toLowerCase();
                    return evSig === vSig;
                });

                const variantData = {
                    price: Number(v.price),
                    stock: Number(v.stock),
                    sku: v.sku,
                    isFeatured: v.isFeatured || false,
                    attributes: {
                        color: v.color,
                        size: v.size,
                        complement: v.complement,
                    },
                };

                if (existing) {
                    // ATUALIZA a variação que já existe
                    await this.prisma.productVariant.update({
                        where: { id: existing.id },
                        data: variantData,
                    });

                    // Atualiza as fotos (apaga as velhas, insere as novas)
                    if (v.images) {
                        await this.prisma.variantImage.deleteMany({
                            where: { variantId: existing.id },
                        });
                        if (v.images.length > 0) {
                            await this.prisma.variantImage.createMany({
                                data: v.images.map((img: any) => ({
                                    url: img.url,
                                    variantId: existing.id,
                                })),
                            });
                        }
                    }
                } else {
                    // CRIA uma variação totalmente nova
                    await this.prisma.productVariant.create({
                        data: {
                            ...variantData,
                            productId: id,
                            images: {
                                create: v.images
                                    ? v.images.map((img: any) => ({
                                          url: img.url,
                                      }))
                                    : [],
                            },
                        },
                    });
                }
            }
        }

        // 5. Retorna o produto com tudo atualizado
        const finalProduct = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                variants: { include: { images: true } },
            },
        });

        return this.formatVariantsForResponse(finalProduct);
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.product.delete({ where: { id } });
    }
}
