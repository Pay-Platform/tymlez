import type { ClientBase, QueryResult } from 'pg';
import { chunk } from 'lodash';

const insertRecords = async (
  client: ClientBase,
  queries: Promise<QueryResult<any>>[],
  commit: boolean,
) => {
  const result = await Promise.all(queries);
  if (commit === true) {
    await client.query('COMMIT');
  }
  return result;
};

export const insertChunkRecords = async (
  client: ClientBase,
  queries: Promise<QueryResult<any>>[],
  chunkSize: number,
  commitEveryChunk?: boolean,
): Promise<QueryResult<any>[][]> => {
  const chunked = chunk(queries, chunkSize);
  const result = await Promise.all(
    chunked.map((c) => insertRecords(client, c, commitEveryChunk === true)),
  );
  if (!commitEveryChunk) {
    await client.query('COMMIT');
  }
  return result;
};
