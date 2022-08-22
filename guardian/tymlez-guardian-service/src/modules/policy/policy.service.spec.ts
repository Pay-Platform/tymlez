import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PolicyPackage } from '../../schemas/policy-package.schema';
import { PolicyService } from './policy.service';

describe('PolicyService', () => {
  let service: PolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<PolicyService>(PolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
