import { AxiosRequestHeaders } from 'axios';
export declare function updateTerraformVariable({ terraformVar, value, headers, }: {
    terraformVar: {
        id: string;
        attributes: {
            key: string;
            value: string;
            sensitive: boolean;
        };
    };
    value: Object;
    headers: AxiosRequestHeaders;
}): Promise<void>;
