import { AxiosRequestHeaders } from 'axios';
import type { IIsoDate } from '@tymlez/platform-api-interfaces';
export declare function runTerraform({ workspaceId, headers, message, }: {
    workspaceId: string;
    headers: AxiosRequestHeaders;
    message: string;
}): Promise<ITerraformRunResult>;
interface ITerraformRunResult {
    id: string;
    type: string;
    attributes: {
        'created-at': IIsoDate;
        'is-destroy': boolean;
        message: string;
    };
}
export {};
