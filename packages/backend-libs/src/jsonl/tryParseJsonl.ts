import type { ObjectSchema } from 'joi';
import type { Readable } from 'stream';
import { parseJsonlInternal } from './parseJsonlInternal';

export async function tryParseJsonl<T>({
  schema,
  stream,
}: {
  stream: Readable;
  schema: ObjectSchema<T>;
}): Promise<(Error | T)[]> {
  const { results } = await parseJsonlInternal<T>({ stream, schema });
  return results;
}
