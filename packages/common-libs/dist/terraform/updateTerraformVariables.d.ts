import type { AxiosRequestHeaders } from 'axios';
export declare function updateTerraformVariables({ workspaceId, entries, headers, }: {
    workspaceId: string;
    entries: {
        key: string;
        value: string;
    }[];
    headers: AxiosRequestHeaders;
}): Promise<(void | Error)[]>;
