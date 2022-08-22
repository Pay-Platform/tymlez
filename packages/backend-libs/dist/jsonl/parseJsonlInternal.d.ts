/// <reference types="node" />
import type { ObjectSchema } from 'joi';
import type { Readable } from 'stream';
export declare function parseJsonlInternal<T>({ stream, schema, }: {
    stream: Readable;
    schema: ObjectSchema<T>;
}): Promise<{
    lines: string[];
    results: (Error | T)[];
}>;
