/// <reference types="react" />
import type { Column } from '../../../types/kanban';
interface KanbanCardProps {
    cardId: string;
    dragging: boolean;
    index?: number;
    column: Column;
    style?: Record<any, any>;
}
export declare const KanbanCard: import("react").ForwardRefExoticComponent<KanbanCardProps & import("react").RefAttributes<HTMLDivElement>>;
export {};
