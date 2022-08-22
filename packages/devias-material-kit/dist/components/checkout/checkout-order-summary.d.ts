import type { FC } from 'react';
import type { SelectChangeEvent } from '@mui/material';
interface Product {
    id: string;
    image: string;
    name: string;
    price: number;
    quantity: number;
}
interface CheckoutOrderSummaryProps {
    onQuantityChange?: (event: SelectChangeEvent<number>, productId: string) => void;
    products: Product[];
    shippingTax: number;
    subtotal: number;
    total: number;
}
export declare const CheckoutOrderSummary: FC<CheckoutOrderSummaryProps>;
export {};
