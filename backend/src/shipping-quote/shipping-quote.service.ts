import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShippingQuoteDto } from './dto/create-shipping-quote.dto';
import { UpdateShippingQuoteDto } from './dto/update-shipping-quote.dto';

@Injectable()
export class ShippingQuoteService {
    constructor(private readonly prisma: PrismaService) {}

    // 1. Criação (Vendedora)
    // Recebe o ID do usuário logado para saber quem solicitou
    async create(
        createShippingQuoteDto: CreateShippingQuoteDto,
        userId: number,
    ) {
        return this.prisma.shippingQuote.create({
            data: {
                ...createShippingQuoteDto,
                createdById: userId,
            },
        });
    }

    // 2. Listagem
    async findAll(carrier?: string, city?: string, status?: string) {
        const where: any = {};

        // Se passou transportadora, busca por texto parcial (insensitive = ignora maiúscula/minúscula)
        if (carrier) {
            where.carrierName = { contains: carrier, mode: 'insensitive' };
        }

        // Se passou CEP, busca se o CEP contém os números
        if (city) {
            where.customerCity = {
                contains: city,
                mode: 'insensitive', // Permite achar "londrina" mesmo se salvo "Londrina"
            };
        }

        if (status) {
            // Se vier 'true', busca concluídas. Se vier 'false', busca pendentes.
            where.isConcluded = status === 'true';
        }

        return this.prisma.shippingQuote.findMany({
            where, // Aplica os filtros (se estiverem vazios, traz tudo, mas nossa página vai controlar isso)
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    // 3. Buscar uma específica (Para a tela de detalhes/edição)
    async findOne(id: number) {
        const quote = await this.prisma.shippingQuote.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!quote) {
            throw new NotFoundException(`Cotação com ID ${id} não encontrada.`);
        }

        return quote;
    }

    // 4. Atualização (Logística/Admin)
    async update(id: number, updateShippingQuoteDto: UpdateShippingQuoteDto) {
        // Verifica se a cotação existe
        await this.findOne(id);

        const data: any = { ...updateShippingQuoteDto };

        // Lógica Automática:
        // Se marcou como concluído e não enviou uma data manual, define 'agora'.
        if (updateShippingQuoteDto.isConcluded === true) {
            data.concludedAt = new Date();
        }
        // Se desmarcou (reabriu), limpa a data de conclusão.
        else if (updateShippingQuoteDto.isConcluded === false) {
            data.concludedAt = null;
        }

        return this.prisma.shippingQuote.update({
            where: { id },
            data,
        });
    }

    // 5. Remover (Opcional, caso cancelem a solicitação)
    async remove(id: number) {
        await this.findOne(id); // Garante que existe antes de tentar deletar
        return this.prisma.shippingQuote.delete({
            where: { id },
        });
    }
}
