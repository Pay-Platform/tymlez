import { Injectable } from '@nestjs/common';
import type {
  ITimestampMsec,
  IGenerationForecastRecord,
  UUID,
  kWh,
  MeterId,
  IMetricTon,
  IMetricKg,
} from '@tymlez/platform-api-interfaces';
import type { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { Logger } from 'nestjs-pino';
import { getPeriodType } from '@tymlez/common-libs';
import {
  endOfDay,
  endOfHour,
  endOfMonth,
  startOfDay,
  startOfHour,
  startOfMonth,
  subDays,
  subHours,
  subMonths,
} from 'date-fns';

export type QdbMeterDate = Date;

export enum IQUESTDB_INTERVALS {
  hourly = '1h',
  daily = '1d',
  fiveMinutes = '5m',
}
export interface QdbMeterRecord {
  meterId: MeterId;
  timestamp: QdbMeterDate;
  channel0: kWh;
  channel1: kWh;
  channel2: kWh;
  channel3: kWh;
  channel4: kWh;
  channel5: kWh;
}

export interface MeterRecord {
  meterId: MeterId;
  timestamp: QdbMeterDate;
  value: kWh;
}

export interface QdbMeterTimeSeries {
  meterId: MeterId;
  data: Array<QdbMeterRecord>;
}

export interface QdbMeterData {
  meters: Array<QdbMeterTimeSeries>;
}

export interface QdbCarbonEmissionRecord {
  timestamp: QdbMeterDate;
  consumption: kWh;
  generation: kWh;
  produced: IMetricKg;
  saved: IMetricKg;
}

export interface QdbCarbonEmissionSum {
  produced: IMetricTon;
  saved: IMetricTon;
}

const meterInfoColumnsMapping = {
  meterId: 'meter_id',
  timestamp: 'timestamp',
};
const meterDataColumnsMapping = {
  channel0: 'eRealPositiveKwh_0',
  channel1: 'eRealPositiveKwh_1',
  channel2: 'eRealPositiveKwh_2',
  channel3: 'eRealPositiveKwh_3',
  channel4: 'eRealPositiveKwh_4',
  channel5: 'eRealPositiveKwh_5',
};

const meterRecordsMapping = {
  ...meterInfoColumnsMapping,
  ...meterDataColumnsMapping,
};

@Injectable()
export class MeterQdbService {
  constructor(
    private readonly logger: Logger,
    @InjectKnex('meter-db') private readonly knex: Knex,
  ) {}

  async getTelemetryConfig() {
    const results = await this.knex.select('*').from('telemetry_config');
    return results;
  }

  async getTelemetries() {
    const { rows: results } = await this.knex.raw(`
      select  created, min(created) , max(created), count() from (select * from telemetry where (created between '2021-12-01T10:20' and '2021-12-02T11:40')) sample by 15m;
    `);
    return results;
  }

  async getSolarGenerationForecast(
    resourceId: UUID,
    sampleInterval: IQUESTDB_INTERVALS,
    fromDate: Date,
    toDate: Date,
  ): Promise<Array<IGenerationForecastRecord>> {
    const sampleSql =
      sampleInterval === IQUESTDB_INTERVALS.fiveMinutes
        ? '5m FILL(PREV)'
        : sampleInterval;

    const query = `
    select 
       periodEnd, SUM(pv_estimate * 1000 / ?) estimated
    from ( 
      select cast( period_end as timestamp) periodEnd, pv_estimate 
      from solar_forecast
      latest by period_end
      where resource_id=? and period_end between ? and ?
      order by periodEnd
    )
    timestamp(periodEnd)
    sample by ${sampleSql} ALIGN TO CALENDAR WITH OFFSET '00:00'`;

    const generationDataIntervalInMinutes = 30;
    const minutesInHour = 60;
    let conversionFactor = minutesInHour / generationDataIntervalInMinutes;

    if (sampleInterval === IQUESTDB_INTERVALS.fiveMinutes) {
      conversionFactor = generationDataIntervalInMinutes / 5;
    }

    const startTs = fromDate.toISOString();
    const endTs = toDate.toISOString();
    const { rows: results } = await this.knex.raw(query, [
      conversionFactor,
      resourceId,
      startTs,
      endTs,
    ]);

    return results.map((item: any) => {
      return {
        ...item,
        period: sampleInterval,
        resourceId,
      };
    });
  }

  async getMetersHistory(
    meterIds: MeterId[],
    from: QdbMeterDate,
    to: QdbMeterDate,
  ): Promise<QdbMeterData> {
    return {
      meters: await Promise.all(
        meterIds.map((meterId) =>
          this.getMeterHistory(meterId, from, to).then((data) => ({
            meterId,
            data,
          })),
        ),
      ),
    };
  }

  async getMetersRealtime(
    meterIds: MeterId[],
    limit: number,
    since?: QdbMeterDate,
  ): Promise<QdbMeterData> {
    return {
      meters: await Promise.all(
        meterIds.map((meterId) =>
          this.getMeterRealtime(meterId, limit, since).then((data) => ({
            meterId,
            data,
          })),
        ),
      ),
    };
  }

  private getSampling(from: Date, to: Date): string {
    let period = '5m';
    const periodType = getPeriodType(from, to);
    switch (periodType) {
      case 'perMonth':
        period = '1M';
        break;
      case 'perDay':
        period = `1d`;
        break;
      case 'perHour':
        period = `1h`;
        break;
      case 'perMinute':
        period = `5m`;
        break;
    }
    return `sample by ${period} ALIGN TO CALENDAR WITH OFFSET '00:00'`;
  }

  private normaliseDateRange(from: Date, to: Date): { from: Date; to: Date } {
    let normalisedFrom = from;
    let normalisedTo = to;
    const periodType = getPeriodType(from, to);

    switch (periodType) {
      case 'perMonth':
        normalisedFrom = startOfMonth(from);
        normalisedTo = endOfMonth(subMonths(to, 1));
        break;

      case 'perDay':
        normalisedFrom = startOfDay(from);
        normalisedTo = endOfDay(subDays(to, 1));
        break;

      case 'perHour':
        normalisedFrom = startOfHour(from);
        normalisedTo = endOfHour(subHours(to, 1));
        break;
    }

    if (normalisedTo <= normalisedFrom) {
      normalisedTo = to;
    }

    return { from: normalisedFrom, to: normalisedTo };
  }

  private injectBeforeOrderBy(sql: string, injectable: string): string {
    const i = sql.indexOf('order by ');
    if (i === -1) {
      return sql;
    }
    return `${sql.substring(0, i)}${injectable} ${sql.substring(i)}`;
  }

  async getMeterHistory(
    meterId: MeterId,
    from: QdbMeterDate,
    to: QdbMeterDate,
  ): Promise<QdbMeterRecord[]> {
    try {
      let sql = this.knex
        .select(meterInfoColumnsMapping)
        .sum(meterDataColumnsMapping)
        .from('meter_energy')
        .where('meter_id', meterId)
        .andWhereBetween('timestamp', [from.toISOString(), to.toISOString()])
        .orderBy('timestamp')
        .toString();
      sql = this.injectBeforeOrderBy(sql, this.getSampling(from, to));
      const res = await this.knex.raw(sql);
      return res.rows;
    } catch (err) {
      this.logger.error(
        { err },
        `Can't getMeterHistory meterIds: ${meterId}, from: ${from.toISOString()}, to: ${to.toISOString()}`,
      );
      throw err;
    }
  }

  async getMeterRealtime(
    meterId: MeterId,
    limit: number,
    since?: QdbMeterDate,
  ): Promise<QdbMeterRecord[]> {
    try {
      const sql = since
        ? this.knex
            .select(meterRecordsMapping)
            .from('meter_energy')
            .where('meter_id', meterId)
            .andWhere('timestamp', '>', since?.toISOString())
            .orderBy('timestamp', 'asc')
            .limit(-limit)
            .toString()
        : this.knex
            .select(meterRecordsMapping)
            .from('meter_energy')
            .where('meter_id', meterId)
            .orderBy('timestamp', 'asc')
            .limit(-limit)
            .toString();

      const res = await this.knex.raw(sql);
      return res.rows;
    } catch (err) {
      this.logger.error(
        { err },
        `Can't getMeterRealtime meterIds: ${meterId}, limit: ${limit}, since: ${since}`,
      );
      throw err;
    }
  }

  async getConumptions(
    meterId: MeterId,
    columns: string[],
    startTs: Date,
    endTs: Date,
  ) {
    try {
      const sampleClause = this.getSampling(startTs, endTs);
      const sql = `
      SELECT timestamp, SUM(energy) as value
      FROM (
        SELECT distinct timestamp, last(${columns.join(' + ')}) as energy
        FROM meter_energy
        WHERE meter_id = :meterId and timestamp between :startTs and :endTs
      ) timestamp(timestamp)
      ${sampleClause}
    `;
      const values = {
        meterId,
        startTs: startTs.toISOString(),
        endTs: endTs.toISOString(),
      };
      const result = await this.knex.raw(sql, values);

      return result.rows;
    } catch (err) {
      this.logger.error(
        { err },
        `Can't getConumption meterIds: ${meterId}, startTs: ${startTs}, endTs: ${endTs}`,
      );
      throw err;
    }
  }

  async getConsumptionRealtime(
    meterId: MeterId,
    columns: string[],
    lastTimestamp?: ITimestampMsec,
  ): Promise<MeterRecord[]> {
    const fromDate = lastTimestamp
      ? new Date(lastTimestamp)
      : subHours(new Date(), 1);

    const dateRange = this.normaliseDateRange(fromDate, new Date());
    const startTs = dateRange.from;
    const endTs = dateRange.to;

    return this.getConumptions(meterId, columns, startTs, endTs);
  }

  async getConsumptionHistory(
    meterId: string,
    columns: string[],
    from: ITimestampMsec,
    to: ITimestampMsec,
  ) {
    const dateRange = this.normaliseDateRange(new Date(from), new Date(to));
    const startTs = dateRange.from;
    const endTs = dateRange.to;

    return this.getConumptions(meterId, columns, startTs, endTs);
  }

  async getCarbonEmissions(
    meterId: string,
    regionId: string,
    columns: string[],
    resourceId: UUID,
    startTs: Date,
    endTs: Date,
  ): Promise<QdbCarbonEmissionRecord[]> {
    try {
      const withClause = `
WITH generation AS (
  SELECT 
      periodEnd, SUM(pv_estimate * 1000 / 6) energy
  FROM ( 
    SELECT cast( period_end as timestamp) periodEnd, pv_estimate 
    FROM solar_forecast
    LATEST BY period_end
    WHERE resource_id=:resourceId and period_end between :startTs and :endTs
    order by periodEnd
  )
  timestamp(periodEnd)
  sample by 5m FILL(PREV)
), 
consumption AS (
  SELECT distinct timestamp, last(${columns.join(' + ')}) as energy
  FROM meter_energy
  WHERE meter_id = :meterId and timestamp between :startTs and :endTs
), 
carbon AS (
  SELECT distinct settlement_date, factor
  FROM meter_energy inner join  carbon_emissions as carbon
  on meter_energy.timestamp = carbon.settlement_date
  WHERE regionid = :regionId and settlement_date between :startTs and :endTs
), 
energy AS (
  SELECT consumption.timestamp, generation.energy as generation, consumption.energy as consumption FROM generation JOIN consumption 
  ON generation.periodEnd = consumption.timestamp
)`;

      let selectClause = `
SELECT energy.timestamp, energy.generation, carbon.factor * energy.generation as saved, energy.consumption, carbon.factor * energy.consumption as produced
FROM energy JOIN carbon 
ON energy.timestamp = carbon.settlement_date;`;

      const sampleClause = this.getSampling(startTs, endTs);
      const periodType = getPeriodType(startTs, endTs);

      if (periodType !== 'perMinute') {
        selectClause = `
SELECT timestamp, SUM(produced) as produced, SUM(saved) as saved, SUM(consumption) as consumption, SUM(generation) as generation FROM (
  SELECT energy.timestamp, energy.generation, carbon.factor * energy.generation as saved, energy.consumption, carbon.factor * energy.consumption as produced
  FROM energy timestamp(timestamp) JOIN carbon 
  ON energy.timestamp = carbon.settlement_date
)
timestamp(timestamp)
${sampleClause};`;
      }
      const query = `${withClause} ${selectClause}`;
      const values = {
        startTs: startTs.toISOString(),
        endTs: endTs.toISOString(),
        resourceId,
        meterId,
        regionId,
      };

      const result = await this.knex.raw(query, values);

      return result.rows;
    } catch (err) {
      this.logger.error({ err }, 'Cannot get carbon emission');
      throw err;
    }
  }

  async getCarbonEmissionsRealtime(
    meterId: string,
    regionId: string,
    columns: string[],
    resourceId: UUID,
    lastTimestamp: ITimestampMsec,
  ): Promise<QdbCarbonEmissionRecord[]> {
    const dateRange = this.normaliseDateRange(
      new Date(lastTimestamp),
      new Date(),
    );
    const startTs = dateRange.from;
    const endTs = dateRange.to;

    return this.getCarbonEmissions(
      meterId,
      regionId,
      columns,
      resourceId,
      startTs,
      endTs,
    );
  }

  async getCarbonEmissionsHistory(
    meterid: string,
    regionid: string,
    columns: string[],
    resourceId: UUID,
    from: ITimestampMsec,
    to: ITimestampMsec,
  ): Promise<QdbCarbonEmissionRecord[]> {
    const dateRange = this.normaliseDateRange(new Date(from), new Date(to));
    const startTs = dateRange.from;
    const endTs = dateRange.to;

    return this.getCarbonEmissions(
      meterid,
      regionid,
      columns,
      resourceId,
      startTs,
      endTs,
    );
  }

  async getCarbonProduced(
    meterId: string,
    regionId: string,
    columns: string[],
    since: Date,
  ): Promise<IMetricKg> {
    try {
      const text = `
select sum((${columns.join('+')}) * factor) as produced
from meter_energy inner join carbon_emissions
on meter_energy.timestamp = carbon_emissions.settlement_date
where meter_id = :meterId and timestamp > :since
and regionid = :regionId`;
      const result = await this.knex.raw(text, {
        meterId,
        regionId,
        since: since.toISOString(),
      });
      return result.rows[0].produced;
    } catch (err) {
      this.logger.error({ err }, 'Cannot get carbon produced');
      throw err;
    }
  }

  async getCarbonProducedLast30d(
    meterId: string,
    regionId: string,
    columns: string[],
  ): Promise<IMetricKg> {
    const since = subDays(new Date(), 30);
    return this.getCarbonProduced(meterId, regionId, columns, since);
  }

  async getCarbonProducedLast24h(
    meterId: string,
    regionId: string,
    columns: string[],
  ): Promise<IMetricKg> {
    const since = subDays(new Date(), 1);
    return this.getCarbonProduced(meterId, regionId, columns, since);
  }

  async getCarbonSaved(
    resourceId: string,
    regionId: string,
    since: Date,
  ): Promise<IMetricKg> {
    try {
      const sql = `
WITH generation AS (
  SELECT 
    periodEnd, SUM(pv_estimate * 1000 / 6) energy
  FROM ( 
    SELECT cast( period_end as timestamp) periodEnd, pv_estimate 
    FROM solar_forecast
    LATEST BY period_end
    WHERE resource_id=:resourceId AND period_end >= :since
    ORDER BY periodEnd
  )
  timestamp(periodEnd)
  SAMPLE BY 5m FILL(PREV)
)
SELECT SUM(generation.energy * factor) AS saved
FROM generation INNER JOIN carbon_emissions
ON generation.periodEnd = carbon_emissions.settlement_date
WHERE carbon_emissions.regionid = :regionId `;

      const result = await this.knex.raw(sql, {
        resourceId,
        regionId,
        since: since.toISOString(),
      });
      return result.rows[0].saved;
    } catch (err) {
      this.logger.error({ err }, 'Cannot get carbon saved');
      throw err;
    }
  }

  async getCarbonSavedLast24h(
    resourceId: string,
    regionId: string,
  ): Promise<IMetricKg> {
    const since = subDays(new Date(), 1);
    return this.getCarbonSaved(resourceId, regionId, since);
  }

  async getCarbonSavedLast30d(
    resourceId: string,
    regionId: string,
  ): Promise<IMetricKg> {
    const since = subDays(new Date(), 30);
    return this.getCarbonSaved(resourceId, regionId, since);
  }
}
