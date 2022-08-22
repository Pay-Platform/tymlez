import type { IBootstrap } from './IBootstrap';
export declare function validateAndAddSecrets({ env, clientName, bootstrap, }: {
    env: string;
    clientName: string;
    bootstrap: IBootstrap;
}): Promise<{
    client_detail: import("./IBootstrap").IClientDetail;
    site_details: Record<string, import("./IBootstrap").ISiteDetail>;
    user_details: Record<string, import("./IBootstrap").IUserDetail>;
    secrets_hash: string;
} & {
    site_details: Record<string, import("./IBootstrapSecrets").ISiteSecret | undefined>;
    user_details: Record<string, import("./IBootstrapSecrets").IUserSecret | undefined>;
}>;
