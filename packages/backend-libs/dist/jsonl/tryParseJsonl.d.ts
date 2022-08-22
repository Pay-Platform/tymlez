/// <reference types="node" />
import type { ObjectSchema } from 'joi';
import type { Readable } from 'stream';
export declare function tryParseJsonl<T>({ schema, stream, }: {
    stream: Readable;
    schema: ObjectSchema<T>;
}): Promise<(Error | T)[]>;
