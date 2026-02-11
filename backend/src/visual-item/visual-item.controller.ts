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
    Req,
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
import { Public } from '../auth/decorators/public.decorator'; // Importe o @Public()
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';

@ApiTags('visual-items')
@Controller('visual-items')
export class VisualItemController {
    constructor(private readonly visualItemService: VisualItemService) {}

    // 1. POST /visual-items (Criação)
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard) // Protege todas as rotas
    @ApiBearerAuth()
    @Roles(Role.ADMIN, Role.DEV) //
    @ApiOperation({ summary: 'Cria um novo item visual (Apenas Admin/Dev)' })
    create(@Body() createVisualItemDto: CreateVisualItemDto) {
        return this.visualItemService.create(createVisualItemDto);
    }

    // 2. GET /visual-items (Listar Todos)
    @Public()
    @UseGuards(OptionalJwtAuthGuard)
    @Get()
    @ApiOperation({
        summary: 'Lista todos os itens visuais (Catálogo de demonstração)',
    })
    findAll(@Query('type') type?: string, @Req() req?: any) {
        // Tenta obter a role do objeto 'user' que pode ter sido injetado pelo token
        const userRole = req.user?.role as Role | undefined;

        return this.visualItemService.findAll(type, userRole);
    }

    // 3. GET /visual-items/:id (Buscar por ID)
    @Public()
    @UseGuards(OptionalJwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Busca um item visual específico pelo ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.visualItemService.findOne(id);
    }

    // 4. PATCH /visual-items/:id (Atualizar)
    @Patch(':id')
    @UseGuards(OptionalJwtAuthGuard) // Protege todas as rotas
    @ApiBearerAuth()
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
    @UseGuards(AuthGuard('jwt'), RolesGuard) // Protege todas as rotas
    @ApiBearerAuth()
    @Roles(Role.ADMIN, Role.DEV) // ⬅
    @ApiOperation({ summary: 'Remove um item visual (Apenas Admin/Dev)' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.visualItemService.remove(id);
    }
}
