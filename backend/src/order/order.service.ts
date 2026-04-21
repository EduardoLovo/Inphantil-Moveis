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

            // ⚡ NA NOVA ARQUITETURA, O ITEM DEVE TER UMA VARIAÇÃO (Nem que seja a "Cor Única")
            if (!itemDto.variantId) {
                throw new BadRequestException(
                    `O produto "${product.name}" precisa de uma variação selecionada para ser comprado.`,
                );
            }

            const variant = variants.find((v) => v.id === itemDto.variantId);
            if (!variant)
                throw new BadRequestException(
                    `Variação ID ${itemDto.variantId} não encontrada.`,
                );

            // ⚡ AQUI VERIFICAMOS O ESTOQUE DA VARIAÇÃO
            if (variant.stock < itemDto.quantity) {
                throw new BadRequestException(
                    `Estoque insuficiente para "${product.name}". Restam: ${variant.stock}.`,
                );
            }

            let unitPrice = Number(variant.price);
            const itemCustomData = (itemDto as any).customData;

            // =========================================================
            // 🛡️ NOVA BLINDAGEM DE PREÇO ATUALIZADA (ID 34)
            // =========================================================
            if (product.id === 34 && itemCustomData) {
                const tamanhoStr = normalizeString(
                    itemCustomData.tamanho || '',
                );
                const modeloStr = normalizeString(itemCustomData.modelo || '');
                const ledTipo = itemCustomData.kitLed;

                const isEncaixe = modeloStr.includes('encaixe');
                const temLed = ledTipo !== 'Não';

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

                    let valorDoKit = 0;
                    if (ledTipo === 'Com Sensor') valorDoKit = 269;
                    else if (ledTipo === 'Sem Sensor') valorDoKit = 130;

                    unitPrice = precoBaseProtetor + valorDoKit;
                } else {
                    // ⚡ Se der erro no nome do tamanho, recua para o preço salvo na Variação
                    unitPrice = Number(variant.price);
                }
            }
            // =========================================================

            totalProdutos += unitPrice * itemDto.quantity;

            orderItemsData.push({
                quantity: itemDto.quantity,
                price: unitPrice,
                product: { connect: { id: product.id } },
                variant: { connect: { id: variant.id } },
                customData: itemCustomData ? itemCustomData : undefined,
            });
        }

        // --- CÁLCULO DO FRETE ---
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
                    include: { items: true }, // Trazemos os itens reais recém-criados
                });

                // ⚡ FORMA 100% SEGURA: Iteramos sobre os itens reais que o banco devolveu!
                for (const item of newOrder.items) {
                    if (item.variantId) {
                        await tx.productVariant.update({
                            where: { id: item.variantId },
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
                items: { include: { product: true, variant: true } },
            },
        });

        if (
            order.status !== 'PAID' &&
            updateDto.status === 'PAID' &&
            updatedOrder.user
        ) {
            this.mailService
                .sendPaymentApprovedEmail(
                    updatedOrder,
                    updatedOrder.user.email,
                    updatedOrder.user.name,
                )
                .catch((error) =>
                    console.error(
                        `Erro ao disparar e-mail de pagamento:`,
                        error,
                    ),
                );

            this.sevenService
                .enviarPedidoParaOSeven(
                    updatedOrder,
                    updatedOrder.user,
                    updatedOrder.address,
                )
                .catch((err: any) =>
                    console.error(
                        `Erro crítico na integração com o Seven:`,
                        err,
                    ),
                );
        }

        return updatedOrder;
    }

    async updateTid(id: number, tid: string) {
        return this.prisma.order.update({
            where: { id },
            data: { tid },
        });
    }

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
            // ⚡ Devolve o estoque para a variação correta
            for (const item of order.items) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { stock: { increment: item.quantity } },
                });
            }
            return tx.order.delete({ where: { id } });
        });
    }

    @Cron(CronExpression.EVERY_HOUR)
    async cancelarPedidosAbandonados() {
        console.log('🧹 Rodando limpeza de pedidos abandonados...');

        const duasHorasAtras = new Date();
        duasHorasAtras.setHours(duasHorasAtras.getHours() - 2);

        const pedidosAbandonados = await this.prisma.order.findMany({
            where: {
                status: 'PENDING',
                createdAt: { lt: duasHorasAtras },
            },
            include: { items: true },
        });

        if (pedidosAbandonados.length === 0) return;

        for (const order of pedidosAbandonados) {
            await this.prisma.$transaction(async (tx) => {
                // ⚡ Devolve o estoque para as variações
                for (const item of order.items) {
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: { stock: { increment: item.quantity } },
                    });
                }

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
