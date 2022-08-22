import type { ChangeEvent, FC } from 'react';
interface CheckoutBillingProps {
    billing: Record<string, any>;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
export declare const CheckoutBilling: FC<CheckoutBillingProps>;
export {};
