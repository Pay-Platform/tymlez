import type { FC } from 'react';
interface CustomerBasicDetailsProps {
    address1?: string;
    address2?: string;
    country?: string;
    email: string;
    isVerified: boolean;
    phone?: string;
    state?: string;
}
export declare const CustomerBasicDetails: FC<CustomerBasicDetailsProps>;
export {};
