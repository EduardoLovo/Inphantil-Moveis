import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'; // ⬅️ Importe a chave

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // 1. Verifica se o decorator @Public() está presente no método ou na classe
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [
                context.getHandler(), // Verifica o método (@Get(), @Post(), etc.)
                context.getClass(), // Verifica o Controller
            ],
        );

        // 2. Se for marcada como pública, retorna TRUE, pulando a autenticação.
        if (isPublic) {
            return true;
        }

        // 3. Caso contrário, executa o guard padrão (que checa o token JWT)
        return super.canActivate(context);
    }
}
