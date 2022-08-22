import { carbonEmissionSchema, parseJsonl } from '@tymlez/backend-libs';
import type { Storage } from '@google-cloud/storage';

export async function getEmissionDataFromStorage({
  storageFileInfo: { bucket, name },
  storage,
}: {
  storageFileInfo: IStorageFileInfo;
  storage: Storage;
}) {
  const stream = await storage.bucket(bucket).file(name).createReadStream();
  return await parseJsonl({ stream, schema: carbonEmissionSchema });
}

export interface IStorageFileInfo {
  bucket: string;
  name: string;
}
