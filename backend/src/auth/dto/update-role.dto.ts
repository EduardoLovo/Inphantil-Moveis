import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateRoleDto {
    @IsEnum(Role, {
        message:
            'Cargo inválido. Escolha um cargo válido (ex: USER, ADMIN, DEV).',
    })
    role!: Role;
}
