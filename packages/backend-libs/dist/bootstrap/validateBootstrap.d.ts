import type { IBootstrap } from './interfaces/IBootstrap';
export declare function validateBootstrap({ bootstrap, allowSecret, }: {
    bootstrap: IBootstrap;
    allowSecret?: boolean;
}): Promise<void>;
