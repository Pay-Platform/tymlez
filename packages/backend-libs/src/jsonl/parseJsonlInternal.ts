import type { ObjectSchema } from 'joi';
import type { Readable } from 'stream';
import { runAllSettled, readStreamAsync } from '@tymlez/common-libs';

export async function parseJsonlInternal<T>({
  stream,
  schema,
}: {
  stream: Readable;
  schema: ObjectSchema<T>;
}) {
  const content = await readStreamAsync(stream);

  const lines = content
    .split(/(?:\r\n|\r|\n)/g)
    .filter((line) => !!line.trim());

  const results = await runAllSettled(lines, async (line) => {
    const lineJson = JSON.parse(line);

    await schema.validateAsync(lineJson, {
      abortEarly: false,
      allowUnknown: true,
    });

    return lineJson as T;
  });

  return { lines, results };
}
