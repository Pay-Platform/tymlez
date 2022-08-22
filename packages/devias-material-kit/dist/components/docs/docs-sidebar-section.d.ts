import type { FC, ReactNode } from 'react';
import type { ListProps } from '@mui/material';
interface Item {
    children?: Item[];
    chip?: ReactNode;
    icon?: ReactNode;
    info?: ReactNode;
    path?: string;
    title: string;
}
interface DocsSidebarSectionProps extends ListProps {
    items: Item[];
    path: string;
    title: string;
}
export declare const DocsSidebarSection: FC<DocsSidebarSectionProps>;
export {};
