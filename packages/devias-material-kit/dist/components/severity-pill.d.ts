import type { FC, ReactNode } from 'react';
import type { Theme } from '@mui/material';
import type { SxProps } from '@mui/system';
export declare type SeverityPillColor = 'primary' | 'secondary' | 'error' | 'info' | 'warning' | 'success';
interface SeverityPillProps {
    children?: ReactNode;
    color?: SeverityPillColor;
    style?: {};
    sx?: SxProps<Theme>;
}
export declare const SeverityPill: FC<SeverityPillProps>;
export {};
