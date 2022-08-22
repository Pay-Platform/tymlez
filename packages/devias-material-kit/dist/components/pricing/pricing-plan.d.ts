import type { FC } from 'react';
import type { Theme } from '@mui/material';
import type { SxProps } from '@mui/system';
interface PricingPlanProps {
    cta: string;
    currency: string;
    description: string;
    features: string[];
    image: string;
    name: string;
    popular?: boolean;
    price: string;
    sx?: SxProps<Theme>;
}
export declare const PricingPlan: FC<PricingPlanProps>;
export {};
