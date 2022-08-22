/* eslint-disable default-param-last */
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import _ from 'lodash';
import assert from 'assert';
import fs from 'fs';
import { PinoLogger } from 'nestjs-pino';
import type { IVerification, IVpRecord } from '@tymlez/platform-api-interfaces';
// import { makeGuardianRequest } from '@tymlez/backend-libs';
import { makeGuardianRequest } from '@tymlez/backend-libs';
import type {
  IDashboadBlockSummary,
  ISiteData,
  IUonDashboard,
  ICarbonReport,
  ICarbonData,
  ICarbonAudit,
} from './interfaces';
import { Measurements } from './entities/measurements.entity';
import { SettingService } from '../setting/setting.service';
import type { Battery } from './entities/battery.entity';
import { VIRTUAL_DEVICE_ID } from '../../constants';
// import { VIRTUAL_DEVICE_ID } from '../../constants';

const BEGIN_TIME = '2022-03-30 03:16:05';

const STRICT_BEGIN_TIME = '2022-03-30 03:16:05';
const END_TIME = '2022-04-02 00:00:00';
type DataGranularity = (string & 'hour') | 'minute';
@Injectable()
export class DashboardService {
  constructor(
    private settingService: SettingService,
    private configService: ConfigService,
    private readonly logger: PinoLogger,
    private readonly em: EntityManager,
  ) {}

  async getDashboardOverview({
    authorizationHeader,
  }: {
    authorizationHeader: string;
  }): Promise<IUonDashboard> {
    const platformApiHost = this.configService.get<string>('PLATFORM_API_HOST');
    assert(platformApiHost, `PLATFORM_API_HOST is missing`);
    this.logger.info('authorizationHeader', authorizationHeader);
    return {
      sites: [],
    };
  }

  async getTotalCarbon(): Promise<IDashboadBlockSummary> {
    const data = await this.getTotalCarbonData('hour', BEGIN_TIME);
    return {
      title: '7 Day Total Carbon',
      value: this.getRoundNumber(data.total),
      unit: 'kg',
      percentageChange: 0,
      percentageDuration: 'than previous 7 days',
      data: data.data.map((item) => ({ x: item.ts, y: item.delta })),
    };
  }

  async getCarbonDiesel(): Promise<IDashboadBlockSummary> {
    return {
      title: '7 Day Carbon from Trucked Diesel',
      value: '0',
      unit: 'kg',
      percentageChange: 0,
      percentageDuration: 'Of Total Carbon',
      data: undefined,
    };
  }

  async getKgCo2(): Promise<IDashboadBlockSummary> {
    const data = await this.getKgCo2Data();

    return {
      title: 'Kg Co2 / L Water Pumped',
      value: data.amount.toFixed(5),
      unit: 'kg',
      percentageChange: 0,
      percentageDuration: 'than previous 7 days',
      data: data.data.map((item) => ({ x: new Date(item.ts), y: item.val })),
    };
  }

  async getTotalWaterPumped(): Promise<IDashboadBlockSummary> {
    const data = await this.getTotalWaterData('hour');
    return {
      title: '7 Day Total Water Pumped',
      value: this.getRoundNumber(data.total),
      unit: 'L',
      percentageChange: 0,
      percentageDuration: 'than previous 7 days',
      data: data.data.map((item) => ({ x: item.ts, y: item.volume })),
    };
  }

  async availableStoredEnergy(): Promise<IDashboadBlockSummary> {
    return {
      title: 'Available Stored Energy',
      value: '0',
      unit: 'kWh',
      percentageChange: 0,
      percentageDuration: 'Storage capacity free',
      data: undefined,
    };
  }

  async getGreenEnergyGeneration(): Promise<IDashboadBlockSummary> {
    const data = await this.getSolarGenerationEnergy('hour');

    return {
      title: '7 Day Green Energy Generation',
      value: this.getRoundNumber(data.total),
      unit: 'kWh',
      percentageChange: 0,
      percentageDuration: 'than previous 7 days',
      data: data.data.map((item) => ({ x: item.ts, y: +item.delta })),
    };
  }

  async getFossilGeneration(): Promise<IDashboadBlockSummary> {
    const data = await this.getFossilGenerationData();

    return {
      title: '7 Day Fossil Fuel Generation',
      value: this.getRoundNumber(data.fossilGenerateRate),
      unit: 'kWh',
      percentageChange: 0,
      percentageDuration: 'than previous 7 days',
      data: data.data.map((item) => ({
        x: Math.floor(new Date(item.ts).getTime()),
        y: +item.val,
      })),
    };
  }

  async getSiteData(startDate: string, endDate: string): Promise<ISiteData> {
    const solar = await this.getSolarData(startDate, endDate, 'hour');
    const genset = await this.getGensetData(startDate, endDate, 'hour');
    const battery = await this.getBatteryData(startDate, endDate, 'hour');

    return {
      title: 'Energy Mix',
      energyMix: [
        {
          name: 'Solar Array',
          data: solar.map((item) => ({
            x: item.ts.getTime(),
            y: +item.val / 1000,
          })),
        },
        {
          name: 'Genset',
          data: genset.map((item) => ({
            x: item.ts.getTime(),
            y: item.delta,
          })),
        },
        {
          name: 'Battery',
          data: battery.map((item) => ({
            x: new Date(new Date(item.ts).getTime() - 7 * 60 * 60 * 1000),
            y: item.current,
          })),
        },
      ],
    };
  }

  public async getTotalCarbonData(
    dateTruncOption: 'hour' | 'minute' = 'hour',
    startDate = BEGIN_TIME,
    endDate = END_TIME,
  ) {
    const data = await this.getRawData(
      'Genset_TotalFuelUsed',
      dateTruncOption,
      startDate,
      endDate,
    );

    const flatData = this.withDelta(data);
    const settings = await this.settingService.getSettings();
    const totalUsage = _.sum(flatData.map((x) => x.delta || 0));
    return {
      data: flatData.map((x) => {
        return { ...x, co2Amount: settings.co2Factor * x.delta };
      }),
      total: totalUsage * settings.co2Factor,
      totalUsage,
    };
  }

  public async getCarbonReport(
    startDate: string,
    endDate: string,
  ): Promise<ICarbonReport> {
    const data = await this.getCarbonEmissionData(startDate, endDate);
    return {
      abated: {
        title: 'Total CO2 Abated',
        subTitle: 'Carbon Abated',
        description:
          'This is the total carbon that was abated by the use of Zero Carbon producing',
        data: this.getRoundNumber(data.abated),
      },
      produced: {
        title: 'Total CO2 Produced',
        subTitle: 'Carbon Produced',
        description:
          'This is the total carbon from all sources measured and attached to this project',
        data: this.getRoundNumber(data.produced),
      },
      penetration: {
        title: 'Renewable Penetration',
        subTitle: 'Renewable Penetration',
        description:
          'The total percentage of energy that was produced from renewable sources',
        data: this.getRoundNumber((data.abated / data.produced) * 100),
      },
      data: data.carbonEmission,
    };
  }

  public async getCarbonAudit(): Promise<ICarbonAudit[]> {
    return [
      {
        source: 'Diesel (Genset)',
        measurement: 304,
        units: 'LITRES',
        carbon: 700,
        auditLink: '62259673628924',
      },
      {
        source: 'Solar Array',
        measurement: 785,
        units: 'KWh',
        carbon: 0,
        auditLink: '62259673628924',
      },
      {
        source: 'Trucked Diesel',
        measurement: 280,
        units: 'LITRES',
        carbon: 656,
        auditLink: '62259673628924',
      },
      {
        source: 'Construction',
        measurement: 448,
        units: 'KgCO2',
        carbon: 448,
        auditLink: '62259673628924',
      },
    ];
  }

  private getRoundNumber(data: number) {
    return _.round(data ?? 0, 2).toLocaleString('en-US', {
      maximumFractionDigits: 5,
    });
  }

  private async getCarbonEmissionData(startDate: string, endDate: string) {
    const co2Produced = await this.getTotalCarbonData(
      'hour',
      startDate,
      endDate,
    );
    const energy = await this.getSolarGenerationEnergy(
      'hour',
      startDate,
      endDate,
    );
    // const fossilGenerateRate = energy.total / co2Produced.totalUsage;
    const fossilGenerateRate = 0.882; // @David to explain
    // const settings = await this.settingService.getSettings();

    const dict: { [x: string]: { abated?: number; produced?: number } } = {};
    const key = (d: Date) => Math.ceil(d.getTime()).toString();
    co2Produced.data.forEach((item) => {
      const tsKey = key(item.ts);

      dict[tsKey] = dict[tsKey] || {};
      dict[tsKey].produced = item.co2Amount;
    });

    energy.data.forEach((item) => {
      const tsKey = key(item.ts);
      dict[tsKey] = dict[tsKey] || {};
      dict[tsKey].abated = (+item.val / 1000) * fossilGenerateRate;
    });

    const carbonEmission = Object.entries(dict).map(([timestamp, item]) => {
      return {
        timestamp: +timestamp + 3600 * 1000,
        abated: item.abated || 0,
        produced: item.produced || 0,
      } as ICarbonData;
    });

    return {
      abated: _.sum(carbonEmission.map((x) => x.abated)),
      produced: _.sum(carbonEmission.map((x) => x.produced)),
      carbonEmission,
    };
  }

  public async getTotalWaterData(granularity: DataGranularity = 'hour') {
    const data = await this.getRawData(
      'VSD_Pump_Flowrate',
      granularity,
      STRICT_BEGIN_TIME,
      END_TIME,
      'AVG',
    );
    const rate = granularity === 'hour' ? 3600 : 60;

    const flatData = data.map((item) => {
      return {
        ...item,
        volume: +item.val * rate,
      };
    });
    return { data: flatData, total: _.sum(flatData.map((x) => x.volume)) };
  }

  private async getKgCo2Data() {
    const co2 = await this.getTotalCarbonData();
    const water = await this.getTotalWaterData();
    const groupByTimestamp: {
      [x: string]: {
        co2: number;
        water: number;
      };
    } = {};
    water.data.forEach((c) => {
      groupByTimestamp[c.ts.toISOString()] =
        groupByTimestamp[c.ts.toISOString()] || {};
      groupByTimestamp[c.ts.toISOString()].water = c.volume;
    });

    co2.data.forEach((c) => {
      groupByTimestamp[c.ts.toISOString()] =
        groupByTimestamp[c.ts.toISOString()] || {};
      groupByTimestamp[c.ts.toISOString()].co2 = c.co2Amount;
    });

    const flatData = Object.entries(groupByTimestamp).map(([key, value]) => ({
      val: value.co2 / value.water,
      ts: key,
    }));

    return { data: flatData, amount: co2.total / water.total };
  }

  private async getSolarGenerationEnergy(
    dateTruncOption: 'minute' | 'hour' = 'hour',
    startDate?: string,
    endDate?: string,
  ) {
    const data = await this.getRawData(
      'Inverter1_GridTotW',
      dateTruncOption,
      startDate || BEGIN_TIME,
      endDate || END_TIME,
      'AVG',
    );
    const flatData = this.withDelta(data);
    return {
      data: flatData,
      total: _.sum(flatData.map((x) => +x.val / 1000)),
    };
  }

  private async getFossilGenerationData() {
    const data = await this.getRawData(
      'Genset_kWHours',
      'hour',
      BEGIN_TIME,
      END_TIME,
      'MAX',
    );

    const withDelta = this.withDelta(data);

    const firstItem = data.pop();
    return {
      data: withDelta,
      fossilGenerateRate:
        (_.max(data.map((t) => +t.val)) as number) - +(firstItem?.val || 0),
    };
  }

  private async getSolarData(
    startDate: string,
    endDate: string,
    granularity: DataGranularity = 'hour',
  ) {
    return await this.getRawData(
      'Inverter1_GridTotW',
      granularity,
      startDate,
      endDate,
      'AVG',
    );
  }

  private withDelta(data: Measurements[]) {
    return data.map((item, index) => {
      let delta = 0;

      if (index >= 1 && item.val && data[index - 1].val) {
        if (+item.val <= +data[index - 1].val) {
          delta = +data[index - 1].val - +item.val;
        } else {
          delta = 0;
        }
      }
      return {
        ...item,
        delta,
      };
    });
  }

  private async getGensetData(
    startDate: string,
    endDate: string,
    granularity: DataGranularity = 'hour',
  ) {
    const data = await this.getRawData(
      'Genset_kWHours',
      granularity,
      startDate,
      endDate,
    );
    return this.withDelta(data);
  }

  private async getRawData(
    register: string,
    dateTruncOption: DataGranularity = 'hour',
    startDate: string,
    endDate: string,
    operator: 'MAX' | 'SUM' | 'AVG' = 'MAX',
  ) {
    const em = this.em.fork();
    const qb = em
      .createQueryBuilder(Measurements)
      .where(
        `register = '${register}' and ts  between '${startDate}' and '${endDate}'`,
      )
      .select(
        `DATE_TRUNC('${dateTruncOption}', ts::TIMESTAMP WITHOUT TIME ZONE) as ts,  ${operator}(CAST(val as decimal)) as val`,
      )
      .groupBy('1')
      .orderBy({ '1': 'desc' });

    return await qb.execute('all');
  }

  private async getBatteryData(
    startDate: string,
    endDate: string,
    dateTruncOption: DataGranularity = 'hour',
  ) {
    return await this.em
      .fork()
      .getConnection()
      .execute<Battery[]>(
        `
 select  DATE_TRUNC('${dateTruncOption}', ts::TIMESTAMP WITHOUT TIME ZONE) as ts,  MAX(CAST(current as decimal)) as current
  from (  SELECT to_timestamp(ts::numeric):: TIMESTAMP WITHOUT TIME ZONE as ts,current
          FROM public.battery
          order by 1 desc)  as temp
    where temp.ts between '${startDate}'  and '${endDate}'
  
  GROUP BY 1
  ORDER BY 1 DESC`,
        [],
        'all',
      );
  }

  async getVerification(page = 0, pageSize = 25): Promise<IVerification> {
    const vp = await makeGuardianRequest<{ data: IVpRecord[] }, undefined>(
      `/audit/get-vp-documents/${VIRTUAL_DEVICE_ID}`,
      'get',
    );

    const startOffset = page * pageSize;
    const data: IVerification = {
      date: new Date().toISOString(),
      num: vp?.data.length,
      records: vp?.data.map((item) => {
        return {
          ...item,
          timestamp: new Date(item.timestamp).getTime(),
          vcRecords: item.vcRecords.map((vc) => ({
            ...vc,
            mrvTimestamp: new Date(vc.mrvTimestamp).getTime(),
          })),
        };
      }),
    };
    data.records = data.records.slice(startOffset, startOffset + pageSize);
    return data;
  }

  async getMockedVerification(): Promise<IVerification> {
    const json = await fs.promises.readFile(
      `${__dirname}/verification.json`.replace('/dist/', '/src/'),
      'utf8',
    );

    return JSON.parse(json) as IVerification;
  }
}
