/* eslint-disable no-continue */

import assert from 'assert';
import { chunk } from 'lodash';
import { logger } from '../pino';
import { useMeterDbPool } from '../meter-db';
import type { IInsertMeterEnergyInput } from './IInsertMeterEnergyInput';

export async function insertMeterEnergies({
  energies: allEnergies,
  skipCheckExists,
}: {
  energies: IInsertMeterEnergyInput[];
  skipCheckExists: boolean | undefined;
}): Promise<void> {
  await useMeterDbPool(async (pool) => {
    const energiesChunks = chunk(allEnergies, 10);

    for (let chunkIndex = 0; chunkIndex < energiesChunks.length; ++chunkIndex) {
      const energies = energiesChunks[chunkIndex];

      for (const energy of energies) {
        if (!skipCheckExists) {
          logger.info(
            energy.meter_id,
            energy.timestamp,
            'Check if record exists',
          );

          const { rows: existingEnergies } = await pool.query(
            `select * from meter_energy where meter_id = $1 and timestamp = $2`,
            [energy.meter_id, energy.timestamp],
          );

          if (existingEnergies.length > 0) {
            logger.info(
              {
                meter_id: energy.meter_id,
                timestamp: energy.timestamp,
              },
              'Skip energy that already exists',
            );
            continue;
          }
        }

        logger.info({ energy }, 'Ingesting meter energy');
        assert(energy.requestId, `requestId is missing`);

        const values = [
          energy.meter_id,
          energy.timestamp,
          energy.duration,
          energy.eRealKwh_0,
          energy.eRealKwh_1,
          energy.eRealKwh_2,
          energy.eRealKwh_3,
          energy.eRealKwh_4,
          energy.eRealKwh_5,
          energy.eRealNegativeKwh_0,
          energy.eRealNegativeKwh_1,
          energy.eRealNegativeKwh_2,
          energy.eRealNegativeKwh_3,
          energy.eRealNegativeKwh_4,
          energy.eRealNegativeKwh_5,
          energy.eRealPositiveKwh_0,
          energy.eRealPositiveKwh_1,
          energy.eRealPositiveKwh_2,
          energy.eRealPositiveKwh_3,
          energy.eRealPositiveKwh_4,
          energy.eRealPositiveKwh_5,
          energy.eReactiveKwh_0,
          energy.eReactiveKwh_1,
          energy.eReactiveKwh_2,
          energy.eReactiveKwh_3,
          energy.eReactiveKwh_4,
          energy.eReactiveKwh_5,
          energy.eReactiveNegativeKwh_0,
          energy.eReactiveNegativeKwh_1,
          energy.eReactiveNegativeKwh_2,
          energy.eReactiveNegativeKwh_3,
          energy.eReactiveNegativeKwh_4,
          energy.eReactiveNegativeKwh_5,
          energy.eReactivePositiveKwh_0,
          energy.eReactivePositiveKwh_1,
          energy.eReactivePositiveKwh_2,
          energy.eReactivePositiveKwh_3,
          energy.eReactivePositiveKwh_4,
          energy.eReactivePositiveKwh_5,
          energy.iRMSMin_0,
          energy.iRMSMin_1,
          energy.iRMSMin_2,
          energy.iRMSMin_3,
          energy.iRMSMin_4,
          energy.iRMSMin_5,
          energy.iRMSMax_0,
          energy.iRMSMax_1,
          energy.iRMSMax_2,
          energy.iRMSMax_3,
          energy.iRMSMax_4,
          energy.iRMSMax_5,
          energy.vRMSMin_0,
          energy.vRMSMin_1,
          energy.vRMSMin_2,
          energy.vRMSMin_3,
          energy.vRMSMin_4,
          energy.vRMSMin_5,
          energy.vRMSMax_0,
          energy.vRMSMax_1,
          energy.vRMSMax_2,
          energy.vRMSMax_3,
          energy.vRMSMax_4,
          energy.vRMSMax_5,
          energy.requestId,
        ];
        const text = `INSERT INTO meter_energy VALUES (${values.map(
          (_value, i) => `$${i + 1}`,
        )}, now())`;

        await pool.query({
          name: `insert-meter-energies`,
          text,
          values,
        });
      }

      await pool.query('COMMIT');
    }
  });
}
