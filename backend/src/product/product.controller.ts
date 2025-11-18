import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    // 1. POST /products (Criação de Produto)
    @Post()
    @Roles(Role.ADMIN, Role.DEV)
    @ApiOperation({ summary: 'Cria um novo produto (Apenas Admin/Seller)' })
    @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
    @ApiResponse({
        status: 403,
        description: 'Proibido (Sem permissão de Role)',
    })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    // 2. GET /products (Listar Todos)
    @Get()
    @Roles(Role.ADMIN, Role.SELLER, Role.USER, Role.DEV)
    @ApiOperation({
        summary: 'Lista todos os produtos (Apenas usuários logados)',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de produtos retornada com sucesso.',
    })
    findAll() {
        return this.productService.findAll();
    }

    // 3. GET /products/:id (Buscar por ID)
    @Get(':id')
    @Roles(Role.ADMIN, Role.SELLER, Role.USER, Role.DEV)
    @ApiOperation({ summary: 'Busca um produto específico pelo ID' })
    @ApiResponse({ status: 200, description: 'Produto encontrado.' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOne(id);
    }

    // 4. PATCH /products/:id (Atualizar Produto)
    @Patch(':id')
    @Roles(Role.ADMIN, Role.SELLER)
    @ApiOperation({
        summary: 'Atualiza um produto existente (Apenas Admin/Seller)',
    })
    @ApiResponse({
        status: 200,
        description: 'Produto atualizado com sucesso.',
    })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    @ApiResponse({
        status: 403,
        description: 'Proibido (Sem permissão de Role)',
    })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productService.update(id, updateProductDto);
    }

    // 5. DELETE /products/:id (Remover Produto)
    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Remove um produto (Apenas Admin)' })
    @ApiResponse({ status: 200, description: 'Produto removido com sucesso.' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    @ApiResponse({
        status: 403,
        description: 'Proibido (Sem permissão de Role)',
    })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productService.remove(id);
    }
}
