import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    /**
     * Sobrescreve o método handleRequest para permitir que a requisição
     * continue mesmo que a autenticação falhe (token ausente ou inválido).
     */
    handleRequest(
        err: any,
        user: any,
        info: any,
        context: ExecutionContext, // O tipo ExecutionContext precisa ser importado
    ) {
        // Se houve erro no processo de autenticação ou se o usuário não foi encontrado
        // (o que acontece quando não há token ou ele é inválido),
        // retornamos 'null' ao invés de lançar um 401.
        if (err || !user) {
            // Retorna null para o NestJS, indicando que a rota pode prosseguir sem um usuário autenticado.
            return null;
        }

        // Se o usuário foi autenticado com sucesso, retornamos o objeto user.
        return user;
    }
}
