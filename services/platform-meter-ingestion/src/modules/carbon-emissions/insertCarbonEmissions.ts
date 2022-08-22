import type { ICarbonEmission } from '@tymlez/backend-libs';
import { chunk } from 'lodash';
import { useMeterDbPool, logger } from '@tymlez/backend-libs';

export async function insertCarbonEmissions({
  carbonEmissionInputs: emissionsInputs,
}: {
  carbonEmissionInputs: IInsertCarbonEmissionsInput[];
}): Promise<void> {
  return useMeterDbPool(async (pool) => {
    const emissionChunks = chunk(emissionsInputs, 10);

    for (let chunkIndex = 0; chunkIndex < emissionChunks.length; ++chunkIndex) {
      const emissions = emissionChunks[chunkIndex];

      for (const emission of emissions) {
        logger.info({ emission }, 'Ingesting carbon emission');

        const values = [
          emission.regionid,
          emission.settlement_date,
          emission.energy,
          emission.emission,
          emission.factor,
          emission.requestId,
        ];

        const text = `INSERT INTO carbon_emissions(
          regionid,
          settlement_date,
          energy,
          emission,
          factor,
          requestId,
          createdAt
        ) VALUES (${values.map((_value, i) => `$${i + 1}`)}, now())`;

        await pool.query({
          name: `insert-carbon-emission`,
          text,
          values,
        });
      }

      await pool.query('COMMIT');
    }
  });
}

export type IInsertCarbonEmissionsInput = ICarbonEmission & {
  requestId: string;
};
