import type { FC, ReactElement, ReactNode } from 'react';
import type { ButtonProps } from '@mui/material';
interface KanbanCardActionProps extends ButtonProps {
    icon?: ReactElement;
    children?: ReactNode;
}
export declare const KanbanCardAction: FC<KanbanCardActionProps>;
export {};
