import { AxiosRequestHeaders } from 'axios';
import type { IIsoDate } from '@tymlez/platform-api-interfaces';
export declare function findTerraformWorkspace({ workspaceName, headers, }: {
    workspaceName: string;
    headers: AxiosRequestHeaders;
}): Promise<ITerraformWorkspace | undefined>;
interface ITerraformWorkspace {
    id: string;
    attributes: {
        name: string;
        'updated-at': IIsoDate;
    };
    type: string;
}
export {};
