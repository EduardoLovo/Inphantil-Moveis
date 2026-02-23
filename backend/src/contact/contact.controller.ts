import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Get,
    Delete,
    Param,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import {
    ApiOperation,
    ApiTags,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';
@ApiTags('contact')
@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) {}

    @Post()
    @Public()
    @UseGuards(OptionalJwtAuthGuard) // ⬅️ Tenta ler o usuário, mas não bloqueia se não tiver
    @ApiBearerAuth() // Indica no Swagger que pode usar token (opcional)
    @ApiOperation({
        summary: 'Enviar uma mensagem de contato (Vincula usuário se logado)',
    })
    @ApiResponse({ status: 201, description: 'Mensagem enviada com sucesso.' })
    create(@Body() createContactDto: CreateContactDto, @Req() req: any) {
        // Tenta pegar o ID do usuário se o token for válido
        const userId = req.user?.id;

        return this.contactService.create(createContactDto, userId);
    }

    // NOVO ENDPOINT: Listar Mensagens (Protegido)
    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard) // Exige Login + Role
    @Roles(Role.ADMIN, Role.DEV, Role.SELLER) // Acesso para a equipe
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Listar todas as mensagens de contato (Admin/Dev/Seller)',
    })
    findAll() {
        return this.contactService.findAll();
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.DEV) // ⬅️ Somente DEV consegue acessar esta rota
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Excluir uma mensagem de contato (Apenas DEV)' })
    remove(@Param('id') id: string) {
        // O '+' converte a string do ID da URL para número
        return this.contactService.remove(+id);
    }
}
