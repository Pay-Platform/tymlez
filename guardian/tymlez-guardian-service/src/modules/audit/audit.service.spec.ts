import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuditService } from './audit.service';
import { DeviceConfig } from '../../schemas/device-config.schema';

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: 'GuardianClientApi',
          useValue: jest.fn(),
        },
        {
          provide: getModelToken(DeviceConfig.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
