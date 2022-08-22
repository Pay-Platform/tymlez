import _ from 'lodash';
import { InjectRepository, logger } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { makeGuardianRequest } from '@tymlez/backend-libs';
import { TokenMint } from './entities/token.entity';
import { DashboardService } from '../dashboard/dashboard.service';
import { VIRTUAL_DEVICE_ID } from '../../constants';

@Injectable()
export class TokenMintService {
  constructor(
    @InjectRepository(TokenMint)
    private readonly tokenMintRepository: EntityRepository<TokenMint>,
    private dashboardService: DashboardService,
    private em: EntityManager,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, { name: 'C02 Emissions token mint' })
  async handleCron() {
    logger.log('C02 Emissions token mint job started');
    const job = this.schedulerRegistry.getCronJob('C02 Emissions token mint');
    job.stop();
    try {
      const data = await this.dashboardService.getTotalCarbonData('minute');
      const waterPump = await this.dashboardService.getTotalWaterData('minute');
      const allTokenMint = await this.tokenMintRepository.findAll({});
      const dataWithC02 = data.data.filter((x) => x.co2Amount > 0);

      const tokenTomint = dataWithC02
        .filter(
          (t) =>
            !allTokenMint.some(
              (x) => x.mintDate.toISOString() === t.ts.toISOString(),
            ),
        )
        .slice(0, 15);
      //get 5 token that havent minted then mint it
      if (tokenTomint.length === 0) {
        logger.log('No token to mint');
        return;
      }

      logger.log(
        { minted: allTokenMint.length, total: dataWithC02.length },
        `Total token has minted: ${allTokenMint.length}/${dataWithC02.length}`,
      );
      for await (const token of tokenTomint) {
        try {
          const lastMintTs = (await this.getLastMintTimestamp()) || new Date();
          logger.log(
            'Get water data from %s -> %s',
            token.ts.toISOString(),
            lastMintTs.toISOString(),
          );
          const findWaterRecordWaterData = waterPump.data.filter(
            (x) =>
              x.ts.getTime() < lastMintTs.getTime() &&
              x.ts.getTime() >= token.ts.getTime(),
          );
          const totalWaterVolume = _.sum(
            findWaterRecordWaterData?.map((x) => x.volume),
          );
          await this.generateMrvForTokenMint(
            token.delta,
            +(totalWaterVolume || 0).toFixed(2),
            token.co2Amount,
            token.ts,
          );
        } catch (err) {
          logger.error({ token, err }, 'Unable to mint token');
        }
      }
    } catch (err) {
      logger.error(err, 'Error occured while minting token');
    } finally {
      job.start();
    }
  }

  async generateMrvForTokenMint(
    mrvFuelAmount: number,
    mrvWaterPumpAmount: number,
    co2Amount: number,
    date: Date,
  ) {
    logger.log(
      { co2Amount, date, mrvFuelAmount, mrvWaterPumpAmount },
      'Start sending mrv data to guarding',
    );
    const mrv = {
      deviceId: VIRTUAL_DEVICE_ID,
      policyTag: 'UonCET',
      setting: {
        mrvTimestamp: date.toISOString(),
        mrvDuration: 60000,
        mrvEnergyAmount: 0,
        mrvFuelAmount,
        mrvWaterPumpAmount,
        mrvCarbonAmount: co2Amount / 1000,
      },
    };
    const output = await makeGuardianRequest(
      '/track-and-trace/generate-mrv',
      'post',
      mrv,
    );
    logger.log({ co2Amount, date }, 'Successfully send mrv to guardian');
    const token = this.tokenMintRepository.create({
      co2Amount,
      mintDate: date,
      meta: output,
    });
    await this.em.persistAndFlush(token);
    logger.log('Successful generate mrv');
  }

  async getLastMintTimestamp() {
    const token = await this.tokenMintRepository.findOne(
      {
        id: {
          $gt: 0,
        },
      },
      {
        orderBy: { id: 'DESC' },
      },
    );
    return token?.mintDate;
  }
}
