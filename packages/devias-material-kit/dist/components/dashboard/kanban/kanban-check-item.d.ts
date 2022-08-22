import type { FC } from 'react';
import type { Theme } from '@mui/material';
import type { SxProps } from '@mui/system';
import type { CheckItem } from '../../../types/kanban';
interface KanbanCheckItemProps {
    cardId: string;
    checkItem: CheckItem;
    checklistId: string;
    editing?: boolean;
    onEditCancel?: () => void;
    onEditComplete?: () => void;
    onEditInit?: () => void;
    sx?: SxProps<Theme>;
}
export declare const KanbanCheckItem: FC<KanbanCheckItemProps>;
export {};
