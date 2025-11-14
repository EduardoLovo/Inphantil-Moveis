import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard'; // 1. Importe o RolesGuard
import { Roles } from '../auth/decorators/roles.decorator'; // 2. Importe o Decorator
import { Role } from '@prisma/client';

@ApiTags('logs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard) // 3. Protege com JWT e restringe por Role
@Controller('logs')
export class LogController {
    constructor(private logService: LogService) {}

    @Get('auth')
    @Roles(Role.ADMIN, Role.DEV) // 4. Apenas ADMIN e DEV podem acessar
    @ApiOperation({ summary: 'Obter logs de tentativas de autenticação' })
    @ApiResponse({ status: 200, description: 'Lista de logs de autenticação' })
    @ApiResponse({ status: 403, description: 'Proibido (Sem permissão)' })
    findAllAuthLogs() {
        return this.logService.findAllAuthLogs();
    }
}
