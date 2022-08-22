import assert from 'assert';
import { zip } from 'lodash';
import { runAll } from '@tymlez/common-libs';
import { useMeterDbPool, logger } from '@tymlez/backend-libs';
import type { IInsertCarbonEmissionsInput } from './insertCarbonEmissions';

export async function filterForNewCarbonEmissions(
  carbonEmissionInputs: IInsertCarbonEmissionsInput[],
): Promise<IInsertCarbonEmissionsInput[]> {
  return await useMeterDbPool(async (pool) => {
    const emissionExistenceChecks = await runAll(
      carbonEmissionInputs,
      async (emission) => {
        const { rows: existingEmissions } = await pool.query(
          `select * from carbon_emissions where regionid = $1 and settlement_date = $2`,
          [emission.regionid, emission.settlement_date],
        );

        if (existingEmissions.length > 0) {
          logger.info(
            {
              regionid: emission.regionid,
              settlement_date: emission.settlement_date,
            },
            'Skip carbon emission that already exists',
          );
        }

        return existingEmissions.length > 0;
      },
      2,
    );

    return zip(carbonEmissionInputs, emissionExistenceChecks)
      .filter(([_emission, emissionExist]) => !emissionExist)
      .map(([emission]) => {
        assert(emission, `emission is missing`);
        return emission;
      });
  });
}
