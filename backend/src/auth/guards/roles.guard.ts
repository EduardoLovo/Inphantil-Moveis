import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client'; // Importe seu enum Role

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Pega as roles que o controller/método exige (ex: @Roles('ADMIN'))
        const requiredRoles = this.reflector.get<Role[]>(
            'roles',
            context.getHandler(),
        );
        if (!requiredRoles) {
            return true; // Se não houver decorator, a rota é pública
        }

        // Pega o usuário logado (que é anexado pelo AuthGuard)
        const { user } = context.switchToHttp().getRequest();

        // Verifica se a role do usuário está inclusa nas roles exigidas
        return requiredRoles.some((role) => user.role === role);
    }
}
