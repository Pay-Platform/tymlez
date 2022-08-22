import pLimit from 'p-limit';

export async function runAll<TInput, TOutput>(
  inputs: TInput[],
  callback: (input: TInput, index: number) => Promise<TOutput>,
  concurrency = 8,
): Promise<TOutput[]> {
  const limit = pLimit(concurrency);

  return Promise.all(
    inputs.map((input, index) =>
      limit(async () => {
        return callback(input, index);
      }),
    ),
  );
}
