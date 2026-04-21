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

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.DEV)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cria um novo produto (Apenas Admin/Dev)' })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Public()
    @Get()
    @ApiResponse({
        status: 200,
        description: 'Lista de produtos retornada com sucesso.',
    })
    findAll() {
        return this.productService.findAll();
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Busca um produto específico pelo ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.DEV)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualiza um produto existente' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.DEV)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove um produto' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productService.remove(id);
    }
}
