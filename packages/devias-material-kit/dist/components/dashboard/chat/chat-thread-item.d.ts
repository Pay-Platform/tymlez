import type { FC } from 'react';
import type { Thread } from '../../../types/chat';
interface ChatThreadItemProps {
    active?: boolean;
    onSelect: () => void;
    thread: Thread;
}
export declare const ChatThreadItem: FC<ChatThreadItemProps>;
export {};
