import type { ICarbonEmission } from '@tymlez/backend-libs';
import { logger } from '@tymlez/backend-libs';
import { filterForNewCarbonEmissions } from './filterForNewCarbonEmissions';
import {
  IInsertCarbonEmissionsInput,
  insertCarbonEmissions,
} from './insertCarbonEmissions';

export async function ingestCarbonEmissions({
  requestId,
  carbonEmissions,
}: {
  requestId: string;
  carbonEmissions: ICarbonEmission[];
}): Promise<void> {
  const emissionInputs: IInsertCarbonEmissionsInput[] = carbonEmissions.map(
    (emission) => ({
      ...emission,
      requestId,
    }),
  );

  logger.info(`Ingesting ${emissionInputs.length} carbon emissions`);

  const newEmissions = await filterForNewCarbonEmissions(emissionInputs);

  await insertCarbonEmissions({
    carbonEmissionInputs: newEmissions,
  });
}
