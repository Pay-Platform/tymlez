import type { FC } from 'react';
interface KanbanCommentProps {
    createdAt: number;
    memberId: string;
    message: string;
}
export declare const KanbanComment: FC<KanbanCommentProps>;
export {};
