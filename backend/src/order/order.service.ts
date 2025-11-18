import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
// import { UpdateOrderDto } from './dto/update-order.dto'; // Usaremos depois para status

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    async create(userId: number, dto: CreateOrderDto) {
        // 1. Buscar Endereço (e verificar se pertence ao usuário)
        const address = await this.prisma.address.findUnique({
            where: { id: dto.addressId },
        });
        if (!address || address.userId !== userId) {
            throw new BadRequestException(
                'Endereço inválido ou não pertence ao usuário.',
            );
        }

        // 2. Buscar Produtos para pegar preço atual e validar estoque
        // Extrai os IDs dos produtos enviados
        const productIds = dto.items.map((item) => item.productId);

        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        // 3. Validar Produtos e Calcular Total
        let total = 0;
        const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

        for (const itemDto of dto.items) {
            const product = products.find((p) => p.id === itemDto.productId);

            if (!product) {
                throw new BadRequestException(
                    `Produto ID ${itemDto.productId} não encontrado.`,
                );
            }

            if (!product.isAvailable) {
                throw new BadRequestException(
                    `Produto "${product.name}" indisponível.`,
                );
            }

            if (product.stock < itemDto.quantity) {
                throw new BadRequestException(
                    `Estoque insuficiente para "${product.name}". Restam: ${product.stock}.`,
                );
            }

            // Calcula preço * quantidade
            // Convertendo Decimal do Prisma para Number JS para cálculo
            const unitPrice = Number(product.price);
            total += unitPrice * itemDto.quantity;

            // Prepara dados para criar o OrderItem
            orderItemsData.push({
                quantity: itemDto.quantity,
                price: unitPrice, // PREÇO CONGELADO NO MOMENTO DA COMPRA
                product: {
                    // <-- Usa o nome do relacionamento (model 'product')
                    connect: { id: product.id }, // <-- Diz ao Prisma para conectar a um produto existente
                },
            });
        }

        // 4. Transação Atômica (Tudo ou Nada)
        return this.prisma.$transaction(async (tx) => {
            // A. Criar o Pedido
            const order = await tx.order.create({
                data: {
                    userId,
                    addressId: dto.addressId,
                    total: total,
                    status: 'PENDING', // Padrão
                    items: {
                        create: orderItemsData, // Cria os itens e vincula automaticamente
                    },
                },
                include: {
                    items: true, // Retorna os itens criados na resposta
                },
            });

            // B. Baixar Estoque dos Produtos
            for (const item of dto.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity, // Subtrai a quantidade vendida
                        },
                    },
                });
            }

            return order;
        });
    }

    async findAll(userId: number) {
        return this.prisma.order.findMany({
            where: { userId }, // Apenas pedidos do usuário
            include: {
                items: {
                    include: { product: true }, // Inclui detalhes do produto no item
                },
                address: true, // Inclui detalhes do endereço
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number, userId: number) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: { include: { product: true } },
                address: true,
            },
        });

        if (!order) throw new NotFoundException('Pedido não encontrado.');

        // Regra de Segurança: Só o dono (ou Admin) pode ver
        // (Aqui simplificado para o dono)
        if (order.userId !== userId) {
            // Em um cenário real, ADMIN poderia ver. Aqui bloqueamos.
            throw new NotFoundException('Pedido não encontrado.');
        }

        return order;
    }

    async findAllAdmin() {
        return this.prisma.order.findMany({
            include: {
                user: true, // Inclui dados do usuário que fez o pedido
                items: {
                    include: { product: true },
                },
                address: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Atualiza o status de um pedido específico
     */
    async updateStatus(id: number, updateDto: UpdateOrderStatusDto) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            select: { status: true }, // Seleciona apenas o status para a verificação inicial
        });

        if (!order) {
            throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
        }

        return this.prisma.order.update({
            where: { id },
            data: {
                status: updateDto.status, // Novo status (válido pelo DTO)
            },
            include: {
                user: true,
                items: true,
            },
        });
    }
}
