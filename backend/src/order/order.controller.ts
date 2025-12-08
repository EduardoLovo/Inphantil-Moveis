import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    ParseIntPipe,
    Patch,
    Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role, User } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

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

    // ==========================================================
    // ENDPOINTS ADMINISTRATIVOS (Admin/Seller/DEV)
    // ==========================================================

    @Get('admin/all') // Rota separada para listar TUDO
    @UseGuards(RolesGuard) // Aplica o RolesGuard
    @Roles(Role.ADMIN, Role.DEV)
    @ApiOperation({
        summary: 'Listar TODOS os pedidos do sistema (Admin/Seller)',
    })
    @ApiResponse({ status: 403, description: 'Acesso proibido.' })
    findAllAdmin() {
        return this.orderService.findAllAdmin();
    }

    @Patch(':id/status')
    @UseGuards(RolesGuard) // Aplica o RolesGuard
    @Roles(Role.ADMIN, Role.DEV)
    @ApiOperation({ summary: 'Atualizar o status de um pedido (Admin/Seller)' })
    @ApiResponse({ status: 200, description: 'Status atualizado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateOrderStatusDto,
    ) {
        return this.orderService.updateStatus(id, updateDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard) // Garante a verificação de Roles
    @Roles(Role.DEV) // Apenas Admin e Dev podem excluir
    @ApiOperation({
        summary: 'Excluir um pedido e restaurar estoque (Admin/Dev)',
    })
    @ApiResponse({
        status: 200,
        description: 'Pedido excluído e estoque restaurado.',
    })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.orderService.remove(id);
    }
}
