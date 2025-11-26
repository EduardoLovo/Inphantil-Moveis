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
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    // 1. POST /products (Criação de Produto)
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.DEV) //
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cria um novo produto (Apenas Admin/Dev)' })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    // 2. GET /products (Listar Todos)
    @Public()
    @Get()
    // @ApiOperation({
    //     summary: 'Lista todos os produtos (Apenas usuários logados)',
    // })
    @ApiResponse({
        status: 200,
        description: 'Lista de produtos retornada com sucesso.',
    })
    findAll() {
        return this.productService.findAll();
    }

    // 3. GET /products/:id (Buscar por ID)
    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Busca um produto específico pelo ID' })
    @ApiResponse({ status: 200, description: 'Produto encontrado.' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOne(id);
    }

    // 4. PATCH /products/:id (Atualizar Produto)
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.DEV) // ⬅️ CORRIGIDO: Removido SELLER
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Atualiza um produto existente (Apenas Admin/Dev)',
    })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productService.update(id, updateProductDto);
    }

    // 5. DELETE /products/:id (Remover Produto)
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.DEV) // ⬅️ CORRIGIDO: Adicionado DEV (Mantendo Admin)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove um produto (Apenas Admin/Dev)' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productService.remove(id);
    }
}
