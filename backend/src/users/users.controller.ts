import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateRoleDto } from 'src/auth/dto/update-role.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Patch(':id/role')
    @Roles(Role.DEV) // 👈 2º Segurança: SÓ entra se o usuário logado for DEV!
    updateRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateRoleDto: UpdateRoleDto,
    ) {
        return this.usersService.updateRole(id, updateRoleDto.role);
    }

    @Roles(Role.ADMIN, Role.DEV) // Só Admin pode ver a lista
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Roles(Role.ADMIN, Role.DEV) // Só Admin pode ver detalhes de qualquer um
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }
}
