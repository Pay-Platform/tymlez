import type { FC } from 'react';
import type { ListItemProps } from '@mui/material';
interface PropertyListItemProps extends ListItemProps {
    align?: 'horizontal' | 'vertical';
    label: string;
    value?: string;
}
export declare const PropertyListItem: FC<PropertyListItemProps>;
export {};
