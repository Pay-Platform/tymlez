/// <reference types="node" />
import type { Readable } from 'stream';
export declare function readStreamAsync(stream: Readable, encoding?: BufferEncoding): Promise<string>;
