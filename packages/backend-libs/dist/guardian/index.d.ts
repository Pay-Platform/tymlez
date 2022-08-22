import { AxiosInstance, Method } from 'axios';
export declare type UserType = 'Installer' | 'RootAuthority' | 'Auditor';
export declare const getGuardianAxios: ({ GUARDIAN_TYMLEZ_SERVICE_BASE_URL, GUARDIAN_TYMLEZ_SERVICE_API_KEY, }?: IGetGuardianAxiosOptions) => AxiosInstance;
interface IGetGuardianAxiosOptions {
    GUARDIAN_TYMLEZ_SERVICE_BASE_URL?: string;
    GUARDIAN_TYMLEZ_SERVICE_API_KEY?: string;
}
export declare function makeGuardianRequest<T, P>(endpoint: string, method: Method, payload?: P): Promise<T>;
export {};
