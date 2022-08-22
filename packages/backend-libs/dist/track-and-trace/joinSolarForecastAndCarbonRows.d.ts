import type { ISolarForecastDbRow } from '../solar-forecast';
import type { ICarbonEmissionDbRow } from '../carbon-emission';
export declare function joinSolarForecastAndCarbonRows({ carbonRows, solarForecastRows, }: {
    carbonRows: ICarbonEmissionDbRow[];
    solarForecastRows: ISolarForecastDbRow[];
}): (ISolarForecastDbRow & ICarbonEmissionDbRow)[];
