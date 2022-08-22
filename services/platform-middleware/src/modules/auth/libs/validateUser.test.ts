import { EntityRepository, wrap } from '@mikro-orm/core';
import bcrypt from 'bcryptjs';
import type { User } from '../entities/User.entity';
import { validateUser } from './validateUser';

jest.mock('@mikro-orm/core');

(wrap as jest.Mock).mockImplementation((entity) => ({
  ...entity,
  toPOJO: () => entity,
}));

describe('validateUser', () => {
  describe('given admin@tymlez.com exists', () => {
    let userRepository: Pick<EntityRepository<User>, 'findOne'>;

    beforeAll(() => {
      userRepository = {
        findOne: async (where) => {
          return Promise.resolve({
            id: '1',
            email: (where as any).email,
            password: await bcrypt.hash('12345', 13),
            roles: ['admin'],
            client: {
              name: 'cohort',
            },
          } as any);
        },
      };
    });

    it('should return the valid user when email and password match', async () => {
      const validatedUser = await validateUser({
        email: 'admin@tymlez.com',
        password: 'tl-12345',
        userRepository,
      });

      expect(validatedUser).toMatchInlineSnapshot(`
        Object {
          "clientName": "cohort",
          "email": "admin@tymlez.com",
          "id": "1",
          "roles": Array [
            "admin",
          ],
        }
      `);

      // @ts-expect-error Ensure password is not returned at runtime
      expect(validatedUser?.password).toBeUndefined();
    });
  });

  describe('given admin@tymlez.com exists', () => {
    let userRepository: Pick<EntityRepository<User>, 'findOne'>;

    beforeAll(() => {
      userRepository = {
        findOne: async (where) => {
          return {
            id: '1',
            email: (where as any).email,
            password: await bcrypt.hash('12345', 13),
          } as any;
        },
      };
    });

    it('should return undefined when password does not match', async () => {
      expect(
        await validateUser({
          email: 'admin@tymlez.com',
          password: '11111',
          userRepository,
        }),
      ).toBeUndefined();
    });
  });
});
