import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role, User } from '@prisma/client'; // Importe seu tipo User

/**
 * Extrai o objeto 'user' do request.
 * O request.user é populado pela JwtStrategy.
 */
export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

// OPCIONAL: Se você quiser pegar uma propriedade específica (ex: @GetUser('email'))
// export const GetUser = createParamDecorator(
//   (data: keyof User, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     const user = request.user;
//     return data ? user?.[data] : user;
//   },
// );
