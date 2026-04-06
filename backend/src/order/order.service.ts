import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from 'src/mail/mail.service';
import { SevenService } from '../integrations/seven/seven.service';

const normalizeString = (str: string) =>
    str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

const CAPITALS: Record<string, string> = {
    MS: 'campo grande',
    MT: 'cuiaba',
    GO: 'goiania',
    MA: 'sao luis',
    PI: 'teresina',
    CE: 'fortaleza',
    RN: 'natal',
    PB: 'joao pessoa',
    PE: 'recife',
    AL: 'maceio',
    SE: 'aracaju',
};

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private mailerService: MailerService,
        private mailService: MailService,
        private sevenService: SevenService,
    ) {}

    async create(userId: number, dto: CreateOrderDto) {
        if (dto.cpf) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { cpf: dto.cpf },
            });
        }

        const address = await this.prisma.address.findUnique({
            where: { id: dto.addressId },
        });
        if (!address || address.userId !== userId) {
            throw new BadRequestException(
                'Endereço inválido ou não pertence ao usuário.',
            );
        }

        const productIds = dto.items.map((item) => item.productId);
        const variantIds = dto.items
            .filter((item) => item.variantId)
            .map((item) => item.variantId as number);

        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });
        const variants = await this.prisma.productVariant.findMany({
            where: { id: { in: variantIds } },
        });

        let totalProdutos = 0;
        const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

        for (const itemDto of dto.items) {
            const product = products.find((p) => p.id === itemDto.productId);

            if (!product)
                throw new BadRequestException(
                    `Produto ID ${itemDto.productId} não encontrado.`,
                );
            if (!product.isAvailable)
                throw new BadRequestException(
                    `Produto "${product.name}" indisponível.`,
                );

            let unitPrice = 0;
            const itemCustomData = (itemDto as any).customData; // Pega o JSON de personalização

            if (itemDto.variantId) {
                const variant = variants.find(
                    (v) => v.id === itemDto.variantId,
                );
                if (!variant)
                    throw new BadRequestException(
                        `Variação ID ${itemDto.variantId} não encontrada.`,
                    );
                if (variant.stock < itemDto.quantity) {
                    throw new BadRequestException(
                        `Estoque insuficiente para "${product.name}". Restam: ${variant.stock}.`,
                    );
                }

                unitPrice = Number(variant.price);
                totalProdutos += unitPrice * itemDto.quantity;

                orderItemsData.push({
                    quantity: itemDto.quantity,
                    price: unitPrice,
                    product: { connect: { id: product.id } },
                    variant: { connect: { id: variant.id } },
                    customData: itemCustomData ? itemCustomData : undefined, // 👉 SALVA AS CORES SE EXISTIREM
                });
            } else {
                if (product.stock < itemDto.quantity) {
                    throw new BadRequestException(
                        `Estoque insuficiente para "${product.name}". Restam: ${product.stock}.`,
                    );
                }

                // =========================================================
                // 🛡️ BLINDAGEM DE PREÇO: CÁLCULO SEGURO DO PRODUTO 34
                // =========================================================
                if (product.id === 34 && itemCustomData) {
                    let precoDoTamanho = 0;
                    const tamanhoStr = itemCustomData.tamanho?.toLowerCase();

                    // Tabela de preços internalizada no backend (segura)
                    if (tamanhoStr === 'berço' || tamanhoStr === 'berco')
                        precoDoTamanho = 100;
                    else if (tamanhoStr === 'junior') precoDoTamanho = 200;
                    else if (tamanhoStr === 'solteiro') precoDoTamanho = 300;
                    else if (
                        tamanhoStr === 'solteirão' ||
                        tamanhoStr === 'solteirao'
                    )
                        precoDoTamanho = 400;
                    else if (tamanhoStr === 'viúva' || tamanhoStr === 'viuva')
                        precoDoTamanho = 500;
                    else if (tamanhoStr === 'casal') precoDoTamanho = 600;
                    else if (tamanhoStr === 'queen') precoDoTamanho = 700;
                    else if (tamanhoStr === 'king') precoDoTamanho = 800;

                    const valorLed = itemCustomData.kitLed === 'Sim' ? 50 : 0;

                    // O Servidor calcula o preço real ignorando o que o front mandou
                    unitPrice =
                        precoDoTamanho > 0
                            ? precoDoTamanho + valorLed
                            : Number(product.price);
                } else {
                    unitPrice = Number(product.price);
                }
                // =========================================================

                totalProdutos += unitPrice * itemDto.quantity;

                orderItemsData.push({
                    quantity: itemDto.quantity,
                    price: unitPrice,
                    product: { connect: { id: product.id } },
                    customData: itemCustomData ? itemCustomData : undefined, // 👉 SALVA AS CORES NO BANCO DE DADOS
                });
            }
        }

        // --- CÁLCULO DO FRETE (Mantido original) ---
        let shippingPercentage = 0;
        let requiresQuote = false;
        const uf = address.state.trim().toUpperCase();
        const city = normalizeString(address.city || '');

        const ALWAYS_QUOTE = ['RO', 'AC', 'PA', 'AM', 'RR', 'AP', 'TO', 'DF'];
        if (ALWAYS_QUOTE.includes(uf)) {
            requiresQuote = true;
        } else {
            const isCapital = (stateUf: string) => {
                const capital = CAPITALS[stateUf];
                return capital ? city === capital : false;
            };

            if (['MS', 'MT', 'GO'].includes(uf)) {
                if (isCapital(uf)) shippingPercentage = 13;
                else requiresQuote = true;
            } else if (
                ['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE'].includes(uf)
            ) {
                if (isCapital(uf)) shippingPercentage = 15;
                else requiresQuote = true;
            } else if (uf === 'SC') {
                shippingPercentage = 12;
            } else if (['PR', 'SP'].includes(uf)) {
                shippingPercentage = 10;
            } else if (uf === 'RJ') {
                shippingPercentage = 15;
            } else if (['RS', 'ES', 'MG'].includes(uf)) {
                shippingPercentage = 13;
            } else if (uf === 'BA') {
                shippingPercentage = 13;
            } else {
                requiresQuote = true;
            }
        }

        const calculatedShippingCost = requiresQuote
            ? 0
            : (totalProdutos * shippingPercentage) / 100;
        const finalTotal = totalProdutos + calculatedShippingCost;

        const order = await this.prisma.$transaction(
            async (tx) => {
                const newOrder = await tx.order.create({
                    data: {
                        userId,
                        addressId: dto.addressId,
                        total: finalTotal,
                        shippingCost: calculatedShippingCost,
                        status: 'PENDING',
                        items: { create: orderItemsData },
                    },
                    include: { items: true },
                });

                for (const item of dto.items) {
                    if (item.variantId) {
                        await tx.productVariant.update({
                            where: { id: item.variantId },
                            data: { stock: { decrement: item.quantity } },
                        });
                    } else {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: { stock: { decrement: item.quantity } },
                        });
                    }
                }
                return newOrder;
            },
            { maxWait: 10000, timeout: 15000 },
        );

        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user) {
                await this.mailerService.sendMail({
                    to: user.email,
                    subject: `🛒 Pedido #${order.id} recebido com sucesso! - Inphantil`,
                });
            }
        } catch (error) {
            console.error('Erro ao enviar o e-mail de confirmação:', error);
        }

        return order;
    }

    async findAll(userId: number) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                items: { include: { product: true, variant: true } },
                address: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number, userId: number) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: { include: { product: true, variant: true } },
                address: true,
            },
        });
        if (!order || order.userId !== userId)
            throw new NotFoundException('Pedido não encontrado.');
        return order;
    }

    async findAllAdmin() {
        return this.prisma.order.findMany({
            include: {
                user: true,
                items: { include: { product: true, variant: true } },
                address: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(id: number, updateDto: UpdateOrderStatusDto) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            select: { status: true },
        });

        if (!order)
            throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);

        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: { status: updateDto.status },
            include: {
                user: true,
                address: true,
                items: { include: { variant: true, product: true } }, // 👈 Perfeito, garante o SKU
            },
        });

        if (
            order.status !== 'PAID' &&
            updateDto.status === 'PAID' &&
            updatedOrder.user
        ) {
            // 1. Envia o E-mail de confirmação
            this.mailService
                .sendPaymentApprovedEmail(
                    updatedOrder,
                    updatedOrder.user.email,
                    updatedOrder.user.name,
                )
                .catch((error) =>
                    console.error(
                        `Erro ao disparar e-mail de pagamento do pedido ${id}:`,
                        error,
                    ),
                );

            // 2. Avisa o ERP Seven (a formatação das observações já acontece lá dentro do service)
            this.sevenService
                .enviarPedidoParaOSeven(
                    updatedOrder,
                    updatedOrder.user,
                    updatedOrder.address,
                )
                .catch((err: any) =>
                    console.error(
                        `Erro crítico na integração com o Seven do pedido ${id}:`,
                        err,
                    ),
                );
        }

        return updatedOrder;
    }

    async remove(id: number) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!order)
            throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);

        return this.prisma.$transaction(async (tx) => {
            for (const item of order.items) {
                if (item.variantId) {
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: { stock: { increment: item.quantity } },
                    });
                } else {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { increment: item.quantity } },
                    });
                }
            }
            return tx.order.delete({ where: { id } });
        });
    }
}
