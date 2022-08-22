import type { User } from '../types/user';
declare class AuthApi {
    login({ email, password }: {
        email: any;
        password: any;
    }): Promise<string>;
    register({ email, name, password }: {
        email: any;
        name: any;
        password: any;
    }): Promise<string>;
    me(accessToken: any): Promise<User>;
}
export declare const authApi: AuthApi;
export {};
