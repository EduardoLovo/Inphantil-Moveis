import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('orders')
@Controller('orders')
@UseGuards(AuthGuard('jwt')) // Obrigatório estar logado
@ApiBearerAuth()
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    @ApiOperation({ summary: 'Criar um novo pedido' })
    create(@GetUser() user: User, @Body() createOrderDto: CreateOrderDto) {
        return this.orderService.create(user.id, createOrderDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar meus pedidos' })
    findAll(@GetUser() user: User) {
        return this.orderService.findAll(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Detalhes de um pedido' })
    findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
        return this.orderService.findOne(id, user.id);
    }
}
