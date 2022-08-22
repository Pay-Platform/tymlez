import type { Company } from '../types/job';
declare class JobApi {
    getCompanies(): Promise<Company[]>;
    getCompany(): Promise<Company>;
}
export declare const jobApi: JobApi;
export {};
