import type { FC, ReactNode } from 'react';
import type { ListProps } from '@mui/material';
interface Item {
    path?: string;
    icon?: ReactNode;
    chip?: ReactNode;
    info?: ReactNode;
    children?: Item[];
    title: string;
}
interface DashboardSidebarSectionProps extends ListProps {
    items: Item[];
    path: string;
    title: string;
}
export declare const DashboardSidebarSection: FC<DashboardSidebarSectionProps>;
export {};
