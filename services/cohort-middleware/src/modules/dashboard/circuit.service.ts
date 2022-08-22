import { Injectable } from '@nestjs/common';
import type {
  ICohortCircuitHistory,
  ICohortCircuitRealtime,
} from '@tymlez/cohort-api-interfaces';
import type {
  ITimestampMsec,
  MeterId,
  IEnergyTimeSeries,
} from '@tymlez/platform-api-interfaces';
import type { ICircuitMap, IMeterData } from '@tymlez/backend-libs';
import { keyBy, sum, uniqBy } from 'lodash';
import { MeterServiceFactory } from './libs/meter.service';
import type { IContext } from './context';
import { MeterInfoServiceFactory } from './libs/meter-info.service';

/**
 * Service to load raw meters data from Meter Service
 * and present it in the form of circuits of Cohort
 * for circuit tab.
 */
@Injectable()
export class CircuitService {
  constructor(
    private meterServiceFactory: MeterServiceFactory,
    private meterInfoServiceFactory: MeterInfoServiceFactory,
  ) {}

  public async getHistory(
    context: IContext,
    siteName: string,
    from: Date,
    to: Date,
  ): Promise<ICohortCircuitHistory> {
    const meterService = this.meterServiceFactory.getMeterService(context);
    const meterInfoService =
      this.meterInfoServiceFactory.getMeterInfoService(context);
    const circuitMap = await meterInfoService.getCircuitMapBySite(siteName);
    circuitMap.circuits = circuitMap.circuits.filter((c) => !c.isMain);
    const data = await meterService.getHistory(
      this.geSecondaryMeterIds(circuitMap),
      from,
      to,
    );

    const series = this.meterDataToSeries(circuitMap, data);
    return { series };
  }

  public async getRealtime(
    context: IContext,
    siteName: string,
    limit: number,
    since?: ITimestampMsec,
  ): Promise<ICohortCircuitRealtime> {
    const meterService = this.meterServiceFactory.getMeterService(context);
    const meterInfoService =
      this.meterInfoServiceFactory.getMeterInfoService(context);
    const circuitMap = await meterInfoService.getCircuitMapBySite(siteName);
    circuitMap.circuits = circuitMap.circuits.filter((c) => !c.isMain);
    const data = await meterService.getRealtime(
      this.geSecondaryMeterIds(circuitMap),
      limit,
      since,
    );
    const series = this.meterDataToSeries(circuitMap, data);
    return { series };
  }

  private geSecondaryMeterIds(circuitMap: ICircuitMap): MeterId[] {
    return uniqBy(circuitMap.circuits, 'meterId').map(
      (circuit) => circuit.meterId,
    );
  }

  private meterDataToSeries(
    circuitMap: ICircuitMap,
    data: IMeterData,
  ): Array<IEnergyTimeSeries> {
    const meters = keyBy(data.meters, 'meterId');
    return circuitMap.circuits
      .filter((circuit) => meters[circuit.meterId])
      .map((circuit) => ({
        name: circuit.label,
        data: meters[circuit.meterId].data.map((point) => ({
          timestamp: point.timestamp,
          value: sum(circuit.indexes.map((i) => point.values[i])),
        })),
      }));
  }
}
