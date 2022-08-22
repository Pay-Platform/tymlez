import type { EntityRepository } from '@mikro-orm/core';
import type { IValidatedUser } from '@tymlez/platform-api-interfaces';
import bcrypt from 'bcryptjs';
import type { User } from '../entities/User.entity';

export async function validateUser({
  email,
  password,
  userRepository,
}: {
  email: string;
  password: string;
  userRepository: Pick<EntityRepository<User>, 'findOne'>;
}): Promise<IValidatedUser | undefined> {
  const user = await userRepository.findOne({ email });

  /**
   * TODO: Remove this hack.
   * Here we temporarily added 'tl-' prefix to all passwords
   * to block access from exemployees
   * REF: https://tymlez.atlassian.net/browse/TYM-488
   */
  let realPassowrd = 'Invalid Password';
  if (password.startsWith('tl-')) {
    realPassowrd = password.substring(3);
  }

  if (user) {
    const isValid = await bcrypt.compare(realPassowrd, user.password);

    if (isValid) {
      return {
        id: user.id,
        email: user.email,
        roles: user.roles,
        clientName: user.client.name,
      };
    }
  }

  return undefined;
}
