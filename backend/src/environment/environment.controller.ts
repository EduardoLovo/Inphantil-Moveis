import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put, // Importante para o update
} from '@nestjs/common';
import { EnvironmentService } from './environment.service';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('environments')
export class EnvironmentController {
    constructor(private readonly environmentService: EnvironmentService) {}

    // 1. Criar novo
    @Post()
    create(@Body() createEnvironmentDto: CreateEnvironmentDto) {
        return this.environmentService.create(createEnvironmentDto);
    }

    // 2. Listar todos (Público)
    @Public()
    @Get()
    findAll() {
        return this.environmentService.findAll();
    }

    // 3. Buscar um pelo ID (Necessário para a página de edição carregar os dados)
    @Public() // Deixei público para poder visualizar a página individual também
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.environmentService.findOne(+id);
    }

    // 4. Atualizar (Update)
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateEnvironmentDto: UpdateEnvironmentDto,
    ) {
        return this.environmentService.update(+id, updateEnvironmentDto);
    }

    // 5. Deletar (Para o botão de lixeira na lista)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.environmentService.remove(+id);
    }
}
