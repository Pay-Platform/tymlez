interface GTMConfig {
    containerId: string;
}
declare class GTM {
    CONTAINER_ID: any;
    initialized: boolean;
    configure(config: GTMConfig): void;
    initialize(config: any): void;
    push(...args: any[]): void;
}
export declare const gtm: GTM;
export {};
