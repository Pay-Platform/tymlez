import { Test, TestingModule } from '@nestjs/testing';
import { IpfsService } from './ipfs.service';

describe('IpfsService', () => {
  let service: IpfsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IpfsService,
        {
          provide: 'GuardianClientApi',
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<IpfsService>(IpfsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
