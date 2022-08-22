import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = <T extends string>(...roles: T[]) =>
  SetMetadata(ROLES_KEY, roles);
