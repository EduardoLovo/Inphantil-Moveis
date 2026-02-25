import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShippingQuoteDto } from './dto/create-shipping-quote.dto';
import { UpdateShippingQuoteDto } from './dto/update-shipping-quote.dto';
import { Prisma } from '@prisma/client';

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
    async findAll(
        carrier?: string,
        city?: string,
        state?: string,
        // status removido!
    ) {
        const where: Prisma.ShippingQuoteWhereInput = {};

        // 1. O único filtro que vai direto para o Banco de Dados agora é o Estado
        if (state) {
            where.customerState = { equals: state, mode: 'insensitive' };
        }

        // 2. Busca os dados no Banco
        let quotes = await this.prisma.shippingQuote.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        // 3. Função Mágica de Limpeza (Agora com .trim() para tirar espaços sobrando)
        const normalizeString = (str: string | null) => {
            if (!str) return '';
            return str
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove acentos
                .toLowerCase() // Tudo minúsculo
                .trim(); // Remove espaços no começo e no final
        };

        // 4. Filtro Inteligente de Transportadora
        if (carrier) {
            const transportadoraPesquisada = normalizeString(carrier);
            quotes = quotes.filter((quote) => {
                const nomeTransportadora = normalizeString(quote.carrierName);
                return nomeTransportadora.includes(transportadoraPesquisada);
            });
        }

        // 5. Filtro Inteligente de Cidade
        if (city) {
            const cidadePesquisada = normalizeString(city);
            quotes = quotes.filter((quote) => {
                const cidadeDoCliente = normalizeString(quote.customerCity);
                return cidadeDoCliente.includes(cidadePesquisada);
            });
        }

        return quotes;
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
