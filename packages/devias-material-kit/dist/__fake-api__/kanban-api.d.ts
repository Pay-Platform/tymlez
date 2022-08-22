import type { Board, Card, CheckItem, Checklist, Column, Comment } from '../types/kanban';
declare class KanbanApi {
    getBoard(): Promise<Board>;
    createColumn({ name }: {
        name: any;
    }): Promise<Column>;
    updateColumn({ columnId, update }: {
        columnId: any;
        update: any;
    }): Promise<Column>;
    clearColumn(columnId: any): Promise<true>;
    deleteColumn(columnId: any): Promise<true>;
    createCard({ columnId, name }: {
        columnId: any;
        name: any;
    }): Promise<Card>;
    updateCard({ cardId, update }: {
        cardId: any;
        update: any;
    }): Promise<Card>;
    moveCard({ cardId, position, columnId }: {
        cardId: any;
        position: any;
        columnId: any;
    }): Promise<true>;
    deleteCard(cardId: any): Promise<true>;
    addComment({ cardId, message }: {
        cardId: any;
        message: any;
    }): Promise<Comment>;
    addChecklist({ cardId, name }: {
        cardId: any;
        name: any;
    }): Promise<Checklist>;
    updateChecklist({ cardId, checklistId, update }: {
        cardId: any;
        checklistId: any;
        update: any;
    }): Promise<Checklist>;
    deleteChecklist({ cardId, checklistId }: {
        cardId: any;
        checklistId: any;
    }): Promise<true>;
    addCheckItem({ cardId, checklistId, name }: {
        cardId: any;
        checklistId: any;
        name: any;
    }): Promise<CheckItem>;
    updateCheckItem({ cardId, checklistId, checkItemId, update, }: {
        cardId: any;
        checklistId: any;
        checkItemId: any;
        update: any;
    }): Promise<CheckItem>;
    deleteCheckItem({ cardId, checklistId, checkItemId }: {
        cardId: any;
        checklistId: any;
        checkItemId: any;
    }): Promise<true>;
}
export declare const kanbanApi: KanbanApi;
export {};
