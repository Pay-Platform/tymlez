import type { FC } from 'react';
import type { Theme } from '@mui/material';
import type { SxProps } from '@mui/system';
import type { Card as CardType, Checklist } from '../../../types/kanban';
interface KanbanChecklistProps {
    card: CardType;
    checklist: Checklist;
    sx?: SxProps<Theme>;
}
export declare const KanbanChecklist: FC<KanbanChecklistProps>;
export {};
