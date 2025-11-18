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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('categories')
@Controller('categories')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @Roles(Role.DEV, Role.ADMIN)
    @ApiOperation({ summary: 'Criar nova categoria (Admin/Seller)' })
    @ApiResponse({ status: 201, description: 'Categoria criada.' })
    @ApiResponse({ status: 409, description: 'Conflito (Nome já existe).' })
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.SELLER, Role.USER, Role.DEV) // Todos logados podem ver
    @ApiOperation({ summary: 'Listar todas as categorias' })
    @ApiResponse({ status: 200, description: 'Lista de categorias.' })
    findAll() {
        return this.categoryService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.SELLER, Role.USER, Role.DEV)
    @ApiOperation({ summary: 'Buscar categoria por ID' })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.SELLER)
    @ApiOperation({ summary: 'Atualizar categoria (Admin/Seller)' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN) // Apenas ADMIN pode deletar estrutura
    @ApiOperation({ summary: 'Remover categoria (Apenas Admin)' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.remove(id);
    }
}
