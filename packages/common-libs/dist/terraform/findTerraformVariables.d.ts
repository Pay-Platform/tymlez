import { AxiosRequestHeaders } from 'axios';
export declare function findTerraformVariables({ workspaceId, keys, headers, }: {
    workspaceId: string;
    keys: string[];
    headers: AxiosRequestHeaders;
}): Promise<(ITerraformVariable | undefined)[]>;
interface ITerraformVariable {
    id: string;
    type: string;
    attributes: {
        key: string;
        value: any;
        sensitive: boolean;
    };
}
export {};
