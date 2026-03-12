import { Response } from 'express'; // <--- 1. ADICIONE ESTA LINHA AQUI
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
    Query,
    Res,
} from '@nestjs/common';
import { ShippingQuoteService } from './shipping-quote.service';
import { CreateShippingQuoteDto } from './dto/create-shipping-quote.dto';
import { UpdateShippingQuoteDto } from './dto/update-shipping-quote.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Cotação de Frete')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('shipping-quote')
export class ShippingQuoteController {
    constructor(private readonly shippingQuoteService: ShippingQuoteService) {}

    @Post()
    @ApiOperation({
        summary: 'Criar uma nova solicitação de cotação (Vendedoras)',
    })
    create(
        @Body() createShippingQuoteDto: CreateShippingQuoteDto,
        @GetUser() user: User,
    ) {
        return this.shippingQuoteService.create(
            createShippingQuoteDto,
            user.id,
        );
    }

    @Get()
    @ApiOperation({ summary: 'Listar cotações (com filtros opcionais)' })
    findAll(
        @Query('carrier') carrier?: string,
        @Query('city') city?: string,
        @Query('state') state?: string,
    ) {
        return this.shippingQuoteService.findAll(carrier, city, state);
    }

    // --- 2. MOVIDO PARA CÁ! Antes do :id ---
    @Get('exportar-relatorio/excel')
    @ApiOperation({ summary: 'Exportar cotações para Excel' })
    async exportarExcel(@Res() res: Response) {
        // <--- Agora este Response é o do Express
        const buffer = await this.shippingQuoteService.gerarRelatorioExcel();

        res.set({
            'Content-Type':
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition':
                'attachment; filename="relatorio-cotacoes.xlsx"',
            'Content-Length': buffer.length.toString(), // Converter para string é uma boa prática
        });

        res.end(buffer);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar detalhes de uma cotação específica' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.shippingQuoteService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary:
            'Atualizar cotação (Inserir dados de frete/Logística ou concluir)',
    })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateShippingQuoteDto: UpdateShippingQuoteDto,
    ) {
        return this.shippingQuoteService.update(id, updateShippingQuoteDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover uma cotação (Opcional)' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.shippingQuoteService.remove(id);
    }
}
