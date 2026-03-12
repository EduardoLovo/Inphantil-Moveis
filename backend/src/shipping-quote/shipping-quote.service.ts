import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShippingQuoteDto } from './dto/create-shipping-quote.dto';
import { UpdateShippingQuoteDto } from './dto/update-shipping-quote.dto';
import { Prisma } from '@prisma/client';
import * as ExcelJS from 'exceljs';

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

    async gerarRelatorioExcel(): Promise<Buffer> {
        const quotes = await this.prisma.shippingQuote.findMany({
            orderBy: { createdAt: 'desc' },
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cotações de Frete');

        // 1. Define as colunas e suas larguras
        worksheet.columns = [
            { header: 'Estado', key: 'customerState', width: 12 },
            { header: 'Transportadora', key: 'carrierName', width: 40 },
            { header: 'Valor do Pedido', key: 'orderValue', width: 20 },
            { header: 'Valor do Frete', key: 'shippingValue', width: 20 },
        ];

        // 2. Estilização Master do Cabeçalho (Linha 1)
        const headerRow = worksheet.getRow(1);
        headerRow.height = 25; // Deixa o cabeçalho mais altinho
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0F766E' }, // Um verde elegante (estilo Tailwind teal-700)
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

        // 3. Adiciona o botão de "Filtro" automático no Excel nas colunas de A até D
        worksheet.autoFilter = 'A1:D1';

        // 4. Formatação de Moeda
        worksheet.getColumn('orderValue').numFmt = '"R$ "#,##0.00';
        worksheet.getColumn('shippingValue').numFmt = '"R$ "#,##0.00';

        // 5. Adiciona os dados
        quotes.forEach((quote) => {
            worksheet.addRow({
                customerState: quote.customerState || '-',
                carrierName: quote.carrierName || 'Não informada',
                orderValue: quote.orderValue ? Number(quote.orderValue) : 0,
                shippingValue: quote.shippingValue
                    ? Number(quote.shippingValue)
                    : 0,
            });
        });

        // 6. Estilização Fina das Células (Bordas, Cores Alternadas e Alinhamento)
        worksheet.eachRow((row, rowNumber) => {
            // Efeito "Zebra" (cores alternadas nas linhas pares) para facilitar a leitura
            if (rowNumber > 1 && rowNumber % 2 === 0) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF3F4F6' }, // Cinza bem clarinho (gray-100)
                };
            }

            // Aplica bordas e alinhamentos célula por célula
            row.eachCell((cell, colNumber) => {
                // Adiciona uma borda fina cinza em todas as células
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                    left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                    bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                    right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                };

                // Personaliza o alinhamento dependendo da coluna (ignora a linha 1 que é o cabeçalho)
                if (rowNumber > 1) {
                    if (colNumber === 1) {
                        // Coluna Estado: Centralizada
                        cell.alignment = {
                            vertical: 'middle',
                            horizontal: 'center',
                        };
                    } else if (colNumber === 2) {
                        // Coluna Transportadora: Alinhada à esquerda com um pequeno recuo
                        cell.alignment = {
                            vertical: 'middle',
                            horizontal: 'left',
                            indent: 1,
                        };
                    } else {
                        // Colunas de Valores: Alinhadas à direita
                        cell.alignment = {
                            vertical: 'middle',
                            horizontal: 'right',
                        };
                    }
                }
            });
        });

        // 7. Gera o arquivo final
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer as unknown as Buffer;
    }
}
