import type { FC, ReactNode } from 'react';
interface RTLProps {
    children: ReactNode;
    direction: 'ltr' | 'rtl';
}
export declare const RTL: FC<RTLProps>;
export {};
