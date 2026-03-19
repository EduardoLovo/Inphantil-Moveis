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
// 👉 1. IMPORTAMOS O NOSSO NOVO SERVIÇO DE INTEGRAÇÃO
import { SevenService } from '../integrations/seven/seven.service';

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private mailerService: MailerService,
        private mailService: MailService,
        private sevenService: SevenService,
    ) {}

    async create(userId: number, dto: CreateOrderDto) {
        // 1. Atualiza o CPF do cliente se ele foi enviado no momento da compra
        if (dto.cpf) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { cpf: dto.cpf },
            });
        }

        // 2. Buscar Endereço
        const address = await this.prisma.address.findUnique({
            where: { id: dto.addressId },
        });
        if (!address || address.userId !== userId) {
            throw new BadRequestException(
                'Endereço inválido ou não pertence ao usuário.',
            );
        }

        // 3. Extrai IDs dos Produtos e Variações
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

        // 4. Validar Estoque e Calcular Total
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

            let unitPrice = 0;

            // Se o item tem variação
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
                        `Estoque insuficiente para a variação de "${product.name}". Restam: ${variant.stock}.`,
                    );
                }

                unitPrice = Number(variant.price);
                total += unitPrice * itemDto.quantity;

                orderItemsData.push({
                    quantity: itemDto.quantity,
                    price: unitPrice,
                    product: { connect: { id: product.id } },
                    variant: { connect: { id: variant.id } }, // <-- Salva a variação
                });
            }
            // Se NÃO tem variação
            else {
                if (product.stock < itemDto.quantity) {
                    throw new BadRequestException(
                        `Estoque insuficiente para "${product.name}". Restam: ${product.stock}.`,
                    );
                }

                unitPrice = Number(product.price);
                total += unitPrice * itemDto.quantity;

                orderItemsData.push({
                    quantity: itemDto.quantity,
                    price: unitPrice,
                    product: { connect: { id: product.id } },
                });
            }
        }

        // 5. Transação (AQUI O PEDIDO É CRIADO DE FATO NO BANCO DE DADOS)
        const order = await this.prisma.$transaction(
            async (tx) => {
                const newOrder = await tx.order.create({
                    data: {
                        userId,
                        addressId: dto.addressId,
                        total: total,
                        status: 'PENDING',
                        items: { create: orderItemsData },
                    },
                    include: { items: true },
                });

                // Baixar Estoque corretamente após a compra
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
            {
                maxWait: 10000,
                timeout: 15000,
            },
        );

        // 6. ENVIAR O E-MAIL
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (user) {
                await this.mailerService.sendMail({
                    to: user.email,
                    subject: `🛒 Pedido #${order.id} recebido com sucesso! - Inphantil`,
                    html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #313b2f; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #ffd639; margin: 0; font-size: 28px;">Oba! Pedido Recebido 🎉</h1>
              </div>
              <p style="font-size: 16px; line-height: 1.6;">Olá, <strong>${user.name}</strong>!</p>
              <p style="font-size: 16px; line-height: 1.6;">Que alegria ter você aqui! Os seus produtos já estão no nosso radar. O seu pedido <strong>#${order.id}</strong> foi gerado com sucesso no nosso sistema.</p>
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #ffd639;">
                <h3 style="margin-top: 0; color: #313b2f; font-size: 16px;">O que acontece agora?</h3>
                <ul style="margin-bottom: 0; padding-left: 20px; font-size: 15px; line-height: 1.6; color: #555;">
                  <li><strong>Se escolheu Pix:</strong> O seu pedido só será confirmado após o pagamento do QR Code gerado no final da compra. A aprovação é imediata!</li>
                  <li><strong>Se escolheu Cartão:</strong> O seu pagamento está em análise pela administradora. Se estiver tudo certo, começaremos a preparar a sua encomenda em breve.</li>
                </ul>
              </div>
              <p style="font-size: 16px; line-height: 1.6; text-align: center;">Pode acompanhar o status da sua encomenda a qualquer momento clicando no botão abaixo:</p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/meus-pedidos" 
                   style="background-color: #313b2f; color: #ffd639; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Ver Meus Pedidos
                </a>
              </div>
              <p style="font-size: 16px; color: #888; text-align: center; border-top: 1px solid #eaeaea; padding-top: 20px;">
                Feito com carinho, <br/>
                <strong style="color: #313b2f;">Equipe Inphantil</strong>
              </p>
            </div>
          `,
                });
                console.log(
                    `E-mail de confirmação enviado com sucesso para ${user.email}`,
                );
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
                items: {
                    include: { product: true, variant: true },
                },
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

        if (!order || order.userId !== userId) {
            throw new NotFoundException('Pedido não encontrado.');
        }

        return order;
    }

    async findAllAdmin() {
        return this.prisma.order.findMany({
            include: {
                user: true,
                items: {
                    include: { product: true, variant: true },
                },
                address: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(id: number, updateDto: UpdateOrderStatusDto) {
        // 1. Puxa o status antigo antes de atualizar
        const order = await this.prisma.order.findUnique({
            where: { id },
            select: { status: true },
        });

        if (!order) {
            throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
        }

        // 👉 3. AQUI FIZEMOS UM AJUSTE: Precisamos incluir os dados completos pro Seven!
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: { status: updateDto.status },
            include: {
                user: true,
                address: true, // Adicionado para enviar o CEP pro Seven
                items: { include: { variant: true } }, // Adicionado para enviar o SKU pro Seven
            },
        });

        // 4. GATILHO MÁGICO: Dispara o e-mail E o ERP se o status mudou para PAGO ('PAID')
        if (
            order.status !== 'PAID' &&
            updateDto.status === 'PAID' &&
            updatedOrder.user
        ) {
            // Gatilho do E-mail
            this.mailService
                .sendPaymentApprovedEmail(
                    updatedOrder,
                    updatedOrder.user.email,
                    updatedOrder.user.name,
                )
                .catch((error) => {
                    console.error(
                        `Erro ao disparar e-mail de pagamento do pedido ${id}:`,
                        error,
                    );
                });

            // 👉 5. GATILHO DO ERP SEVEN (Disparado em background)
            this.sevenService
                .enviarPedidoParaOSeven(
                    updatedOrder,
                    updatedOrder.user,
                    updatedOrder.address,
                )
                .catch((err: any) => {
                    // 👈 Só adicionar o ': any' aqui!
                    console.error(
                        `Erro crítico na integração com o Seven do pedido ${id}:`,
                        err,
                    );
                });
        }

        return updatedOrder;
    }

    async remove(id: number) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });

        if (!order) {
            throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
        }

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
