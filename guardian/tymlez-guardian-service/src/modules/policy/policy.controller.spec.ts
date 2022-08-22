import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PolicyPackage } from '../../schemas/policy-package.schema';
import { PolicyController } from './policy.controller';
import { PolicyService } from './policy.service';

describe('PolicyController', () => {
  let controller: PolicyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PolicyController],
      providers: [
        PolicyService,
        {
          provide: 'GuardianClientApi',
          useValue: jest.fn(),
        },
        {
          provide: getModelToken(PolicyPackage.name),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PolicyController>(PolicyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
