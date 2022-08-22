import type { FC, ReactNode } from 'react';
import type { ListItemProps } from '@mui/material';
interface DocsSidebarItemProps extends ListItemProps {
    active?: boolean;
    children?: ReactNode;
    chip?: ReactNode;
    depth: number;
    icon?: ReactNode;
    info?: ReactNode;
    open?: boolean;
    path?: string;
    title: string;
}
export declare const DocsSidebarItem: FC<DocsSidebarItemProps>;
export {};
