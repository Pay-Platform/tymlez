import type { FC } from 'react';
import type { Card, Column } from '../../../types/kanban';
interface KanbanCardModalProps {
    card: Card;
    column: Column;
    onClose?: () => void;
    open: boolean;
}
export declare const KanbanCardModal: FC<KanbanCardModalProps>;
export {};
