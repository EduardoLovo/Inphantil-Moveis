import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client'; // Importe seu enum Role

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
