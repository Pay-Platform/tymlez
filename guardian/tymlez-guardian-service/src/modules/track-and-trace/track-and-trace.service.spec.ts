import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DeviceConfig } from '../../schemas/device-config.schema';
import { PolicyPackage } from '../../schemas/policy-package.schema';
import { ProcessedMrv } from '../../schemas/processed-mrv.schema';
import { TrackAndTraceService } from './track-and-trace.service';

describe('TrackAndTraceService', () => {
  let service: TrackAndTraceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackAndTraceService,
        {
          provide: 'GuardianClientApi',
          useValue: jest.fn(),
        },
        {
          provide: 'VCDocumentLoaderName',
          useValue: jest.fn(),
        },
        {
          provide: getModelToken(DeviceConfig.name),
          useValue: {},
        },
        {
          provide: getModelToken(PolicyPackage.name),
          useValue: {},
        },
        {
          provide: getModelToken(ProcessedMrv.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TrackAndTraceService>(TrackAndTraceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
