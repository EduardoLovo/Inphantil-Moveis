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
import { Cron, CronExpression } from '@nestjs/schedule';

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
                // 🛡️ NOVA BLINDAGEM DE PREÇO ATUALIZADA (ID 34)
                // =========================================================
                if (product.id === 34 && itemCustomData) {
                    const tamanhoStr = normalizeString(
                        itemCustomData.tamanho || '',
                    );
                    const modeloStr = normalizeString(
                        itemCustomData.modelo || '',
                    );
                    const ledTipo = itemCustomData.kitLed; // "Não", "Com Sensor" ou "Sem Sensor"

                    const isEncaixe = modeloStr.includes('encaixe');
                    const temLed = ledTipo !== 'Não';

                    // 1. Tabela de Preços do Servidor (Valores Exatos do Site)
                    const tabelaPrecos: Record<string, any> = {
                        berco: {
                            encaixeSem: 974.43,
                            encaixeCom: 1023.03,
                            outrosSem: 750.87,
                            outrosCom: 799.77,
                        },
                        junior: {
                            encaixeSem: 1098.74,
                            encaixeCom: 1153.54,
                            outrosSem: 846.66,
                            outrosCom: 901.46,
                        },
                        solteiro: {
                            encaixeSem: 1259.14,
                            encaixeCom: 1281.94,
                            outrosSem: 970.26,
                            outrosCom: 1033.06,
                        },
                        solteirao: {
                            encaixeSem: 1291.22,
                            encaixeCom: 1315.62,
                            outrosSem: 994.98,
                            outrosCom: 1059.38,
                        },
                        viuva: {
                            encaixeSem: 1347.36,
                            encaixeCom: 1374.56,
                            outrosSem: 1038.24,
                            outrosCom: 1105.44,
                        },
                        casal: {
                            encaixeSem: 1459.64,
                            encaixeCom: 1492.44,
                            outrosSem: 1124.76,
                            outrosCom: 1197.56,
                        },
                        queen: {
                            encaixeSem: 1579.94,
                            encaixeCom: 1658.74,
                            outrosSem: 1217.46,
                            outrosCom: 1296.26,
                        },
                        king: {
                            encaixeSem: 1736.33,
                            encaixeCom: 1822.93,
                            outrosSem: 1337.97,
                            outrosCom: 1424.57,
                        },
                    };

                    // 2. Busca o preço base na tabela
                    const precosTamanho = tabelaPrecos[tamanhoStr];

                    if (precosTamanho) {
                        let precoBaseProtetor = 0;

                        if (isEncaixe) {
                            precoBaseProtetor = temLed
                                ? precosTamanho.encaixeCom
                                : precosTamanho.encaixeSem;
                        } else {
                            precoBaseProtetor = temLed
                                ? precosTamanho.outrosCom
                                : precosTamanho.outrosSem;
                        }

                        // 3. Soma o valor fixo do Kit LED escolhido
                        let valorDoKit = 0;
                        if (ledTipo === 'Com Sensor') valorDoKit = 269;
                        else if (ledTipo === 'Sem Sensor') valorDoKit = 130;

                        unitPrice = precoBaseProtetor + valorDoKit;
                    } else {
                        // Se der algum erro de nome de tamanho, usa o preço do banco por segurança
                        unitPrice = Number(product.price);
                    }
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
                        paymentMethod: dto.paymentMethod,
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

    // 👉 Salva o TID gerado pela Rede no pedido
    async updateTid(id: number, tid: string) {
        return this.prisma.order.update({
            where: { id },
            data: { tid },
        });
    }

    // 👉 Busca quem é o dono desse TID quando o Webhook chamar
    async findByTid(tid: string) {
        return this.prisma.order.findUnique({
            where: { tid },
        });
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

    @Cron(CronExpression.EVERY_HOUR)
    async cancelarPedidosAbandonados() {
        console.log('🧹 Rodando limpeza de pedidos abandonados...');

        // Calcula a data de 2 horas atrás
        const duasHorasAtras = new Date();
        duasHorasAtras.setHours(duasHorasAtras.getHours() - 2);

        // Busca todos os pedidos que estão PENDING e velhos
        const pedidosAbandonados = await this.prisma.order.findMany({
            where: {
                status: 'PENDING',
                createdAt: {
                    lt: duasHorasAtras, // lt = less than (menor que a data)
                },
            },
            include: { items: true },
        });

        if (pedidosAbandonados.length === 0) return;

        // Para cada pedido velho, devolve o estoque e cancela
        for (const order of pedidosAbandonados) {
            await this.prisma.$transaction(async (tx) => {
                // 1. Devolve o estoque de cada item
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

                // 2. Muda o status para CANCELED
                await tx.order.update({
                    where: { id: order.id },
                    data: { status: 'CANCELED' },
                });
            });

            console.log(
                `❌ Pedido ${order.id} cancelado por falta de pagamento.`,
            );
        }
    }
}
