export declare const JWT_SECRET = "devias-top-secret-key";
export declare const JWT_EXPIRES_IN: number;
export declare const sign: (payload: Record<string, any>, privateKey: string, header: Record<string, any>) => string;
export declare const decode: (token: string) => any;
export declare const verify: (token: string, privateKey: string) => Record<string, any>;
