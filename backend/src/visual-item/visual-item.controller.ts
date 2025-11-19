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
import { VisualItemService } from './visual-item.service';
import { CreateVisualItemDto } from './dto/create-visual-item.dto';
import { UpdateVisualItemDto } from './dto/update-visual-item.dto';
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

@ApiTags('visual-items')
@Controller('visual-items')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protege todas as rotas
@ApiBearerAuth()
export class VisualItemController {
    constructor(private readonly visualItemService: VisualItemService) {}

    // 1. POST /visual-items (Criação)
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.DEV) //
    @ApiOperation({ summary: 'Cria um novo item visual (Apenas Admin/Dev)' })
    create(@Body() createVisualItemDto: CreateVisualItemDto) {
        return this.visualItemService.create(createVisualItemDto);
    }

    // 2. GET /visual-items (Listar Todos)
    @Get()
    @Roles(Role.ADMIN, Role.SELLER, Role.USER, Role.DEV) // Todos logados podem ver
    @ApiOperation({
        summary: 'Lista todos os itens visuais (Catálogo de demonstração)',
    })
    findAll() {
        return this.visualItemService.findAll();
    }

    // 3. GET /visual-items/:id (Buscar por ID)
    @Get(':id')
    @Roles(Role.ADMIN, Role.SELLER, Role.USER, Role.DEV)
    @ApiOperation({ summary: 'Busca um item visual específico pelo ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.visualItemService.findOne(id);
    }

    // 4. PATCH /visual-items/:id (Atualizar)
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.DEV) //
    @ApiOperation({ summary: 'Atualiza um item visual (Apenas Admin/Dev)' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateVisualItemDto: UpdateVisualItemDto,
    ) {
        return this.visualItemService.update(id, updateVisualItemDto);
    }

    // 5. DELETE /visual-items/:id (Remover)
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.DEV) // ⬅
    @ApiOperation({ summary: 'Remove um item visual (Apenas Admin/Dev)' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.visualItemService.remove(id);
    }
}
