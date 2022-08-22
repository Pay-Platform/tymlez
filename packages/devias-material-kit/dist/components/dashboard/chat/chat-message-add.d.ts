import type { FC } from 'react';
interface ChatMessageAddProps {
    disabled?: boolean;
    onSend?: (value: string) => void;
}
export declare const ChatMessageAdd: FC<ChatMessageAddProps>;
export {};
