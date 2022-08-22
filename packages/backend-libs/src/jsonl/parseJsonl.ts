import type { ObjectSchema } from 'joi';
import type { Readable } from 'stream';
import { validateMaybeResults } from '@tymlez/common-libs';
import { parseJsonlInternal } from './parseJsonlInternal';

export async function parseJsonl<T>({
  stream,
  schema,
}: {
  stream: Readable;
  schema: ObjectSchema<T>;
}): Promise<T[]> {
  const { lines, results } = await parseJsonlInternal<T>({ stream, schema });

  validateMaybeResults({
    message: 'Failed to parse JSONL data',
    inputs: lines,
    results,
  });

  return results as T[];
}
