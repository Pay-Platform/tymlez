/// <reference types="node" />
import type { IStoredFile } from './IStoreFile';
export * from './IStoreFile';
export declare function storeFileToS3(bucketName: string, filename: string, content: Buffer): Promise<IStoredFile>;
