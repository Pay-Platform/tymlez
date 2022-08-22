import type { IBootstrap } from './IBootstrap';
export declare function validateBootstrap({ bootstrap, allowSecret, }: {
    bootstrap: IBootstrap;
    allowSecret?: boolean;
}): Promise<void>;
