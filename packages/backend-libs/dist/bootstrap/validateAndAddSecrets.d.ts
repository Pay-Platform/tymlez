import type { IBootstrap } from './interfaces/IBootstrap';
export declare function validateAndAddSecrets({ env, clientName, bootstrap, }: {
    env: string;
    clientName: string;
    bootstrap: IBootstrap;
}): Promise<{
    client_detail: import("./interfaces/IBootstrap").IClientDetail;
    site_details: Record<string, import("./interfaces/IBootstrap").ISiteDetail>;
    user_details: Record<string, import("./interfaces/IBootstrap").IUserDetail>;
    secrets_hash: string;
} & {
    site_details: Record<string, import("./interfaces/IBootstrapSecrets").ISiteSecret | undefined>;
    user_details: Record<string, import("./interfaces/IBootstrapSecrets").IUserSecret | undefined>;
}>;
