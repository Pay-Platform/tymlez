import type { FC } from 'react';
interface ChatMessageProps {
    authorAvatar: string;
    authorName: string;
    authorType: 'contact' | 'user';
    body: string;
    contentType: string;
    createdAt: number;
}
export declare const ChatMessage: FC<ChatMessageProps>;
export {};
