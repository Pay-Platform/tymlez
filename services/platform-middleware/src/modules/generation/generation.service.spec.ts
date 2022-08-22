import { getRepositoryToken } from '@mikro-orm/nestjs';
import type { EntityRepository } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Site } from '../site/entities/Site.entity';
import { MeterQdbService } from '../meter-qdb/meter-qdb.service';
import { MeterQdbServiceMock } from '../meter-qdb/meter-qdb.service.mock';

import { GenerationService } from './generation.service';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<EntityRepository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
  }),
);

describe('Generation service', () => {
  let generationService: GenerationService;
  let repositoryMock: MockType<EntityRepository<Site>>;
  beforeEach(async () => {
    const MockedGenerationForecastProvider = {
      provide: MeterQdbService,
      useClass: MeterQdbServiceMock,
    };

    const SiteRepositoryProvider = {
      provide: getRepositoryToken(Site),
      useFactory: repositoryMockFactory,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockedGenerationForecastProvider,
        GenerationService,
        SiteRepositoryProvider,
      ],
    }).compile();

    generationService = module.get<GenerationService>(GenerationService);
    repositoryMock = module.get(getRepositoryToken(Site));
  });

  it('Generation service - should be defined', () => {
    expect(generationService).toBeDefined();
  });

  describe('forecast', () => {
    it('should get series of generation forecast for the next 7*24 hours', async () => {
      const site = {
        name: 'main',
        solcastResourceId: '6587-6532-5132-b217',
        hasSolar: true,
      };
      repositoryMock.findOne?.mockReturnValue(site);
      const forecast = await generationService.forecastSolarGeneration(
        'a',
        'hourly',

        new Date(),
      );
      expect(forecast[0].series).toHaveLength(7 * 24);
      expect(forecast[0].series[0]).toHaveProperty('period');
      expect(forecast[0].series[0]).toHaveProperty('periodEnd');
      expect(forecast[0].series[0]).toHaveProperty('estimated');

      const sources = forecast.map((sourceForecast) =>
        sourceForecast.sourceType.toLowerCase(),
      );
      expect(sources).toHaveLength(1);
      expect(sources).toContain('solar');
    });

    it('should throw error ', async () => {
      //const site = {name: 'main', hasSolar:true};
      const site = { name: 'main', hasSolar: false };

      repositoryMock.findOne?.mockReturnValue(site);
      await expect(
        generationService.forecastSolarGeneration('a', 'hourly', new Date()),
      ).rejects.toThrow(
        'This site does not exist or does not have a solar PV to forecast',
      );
    });
  });
});
