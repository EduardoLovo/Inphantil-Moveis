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
} from '@nestjs/common';
import { ShippingQuoteService } from './shipping-quote.service';
import { CreateShippingQuoteDto } from './dto/create-shipping-quote.dto';
import { UpdateShippingQuoteDto } from './dto/update-shipping-quote.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Cotação de Frete')
@ApiBearerAuth() // Indica no Swagger que precisa de token
@UseGuards(JwtAuthGuard) // Protege todas as rotas deste controller
@Controller('shipping-quote')
export class ShippingQuoteController {
    constructor(private readonly shippingQuoteService: ShippingQuoteService) {}

    @Post()
    @ApiOperation({
        summary: 'Criar uma nova solicitação de cotação (Vendedoras)',
    })
    create(
        @Body() createShippingQuoteDto: CreateShippingQuoteDto,
        @GetUser() user: User, // Pega o usuário logado automaticamente
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
        @Query('status') status?: string,
    ) {
        return this.shippingQuoteService.findAll(carrier, city, status);
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
