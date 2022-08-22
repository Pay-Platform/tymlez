import type { AppThunk } from '../store';
import type { Card, Column, Member } from '../types/kanban';
export interface KanbanState {
    isLoaded: boolean;
    columns: {
        byId: Record<string, Column>;
        allIds: string[];
    };
    cards: {
        byId: Record<string, Card>;
        allIds: string[];
    };
    members: {
        byId: Record<string, Member>;
        allIds: string[];
    };
}
export declare const reducer: import("redux").Reducer<KanbanState, import("redux").AnyAction>;
export declare const getBoard: () => AppThunk;
export declare const createColumn: (name: string) => AppThunk;
export declare const updateColumn: (columnId: string, update: any) => AppThunk;
export declare const clearColumn: (columnId: string) => AppThunk;
export declare const deleteColumn: (columnId: string) => AppThunk;
export declare const createCard: (columnId: string, name: string) => AppThunk;
export declare const updateCard: (cardId: string, update: any) => AppThunk;
export declare const moveCard: (cardId: string, position: number, columnId?: string) => AppThunk;
export declare const deleteCard: (cardId: string) => AppThunk;
export declare const addComment: (cardId: string, message: string) => AppThunk;
export declare const addChecklist: (cardId: string, name: string) => AppThunk;
export declare const updateChecklist: (cardId: string, checklistId: string, update: any) => AppThunk;
export declare const deleteChecklist: (cardId: string, checklistId: string) => AppThunk;
export declare const addCheckItem: (cardId: string, checklistId: string, name: string) => AppThunk;
export declare const updateCheckItem: (cardId: string, checklistId: string, checkItemId: string, update: any) => AppThunk;
export declare const deleteCheckItem: (cardId: string, checklistId: string, checkItemId: string) => AppThunk;
