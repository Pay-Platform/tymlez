import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { SettingService } from './setting.service';
import { Setting } from './entities/setting.entity';

describe('SettingService', () => {
  let service: SettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingService,
        {
          provide: getRepositoryToken(Setting),
          useValue: {
            findAll: jest
              .fn()
              .mockResolvedValue([{ key: 'co2_factor', value: '555' }]),
          },
        },
      ],
    }).compile();

    service = module.get<SettingService>(SettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return correct data', async () => {
    const result = await service.getSettings();

    expect(result.co2Factor).toEqual(555);
  });
});
