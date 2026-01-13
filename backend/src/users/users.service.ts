import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    // Listar todos os usuários (apenas dados básicos)
    async findAll() {
        return this.prisma.user.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                email: true,
                fone: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { orders: true }, // Já traz quantos pedidos ele tem
                },
            },
        });
    }

    // Pegar detalhes completos de um usuário (com pedidos e endereços)
    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                addresses: true, // Inclui endereços
                orders: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        items: {
                            include: {
                                product: true, // Inclui nome do produto no pedido
                            },
                        },
                    },
                },
                _count: {
                    select: { orders: true },
                },
            },
        });

        if (!user) throw new NotFoundException('Usuário não encontrado');
        return user;
    }
}
