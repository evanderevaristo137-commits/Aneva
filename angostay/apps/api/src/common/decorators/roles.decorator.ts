import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/** Restringe a rota a utilizadores com pelo menos um dos papéis indicados. */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
