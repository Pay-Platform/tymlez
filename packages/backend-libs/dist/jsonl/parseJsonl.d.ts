/// <reference types="node" />
import type { ObjectSchema } from 'joi';
import type { Readable } from 'stream';
export declare function parseJsonl<T>({ stream, schema, }: {
    stream: Readable;
    schema: ObjectSchema<T>;
}): Promise<T[]>;
