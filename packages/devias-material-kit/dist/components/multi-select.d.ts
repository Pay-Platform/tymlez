import type { FC } from 'react';
interface MultiSelectProps {
    label: string;
    onChange?: (value: unknown[]) => void;
    options: {
        label: string;
        value: unknown;
    }[];
    value: unknown[];
}
export declare const MultiSelect: FC<MultiSelectProps>;
export {};
