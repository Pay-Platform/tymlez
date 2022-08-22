import type { FC } from 'react';
import type { Message, Participant } from '../../../types/chat';
interface ChatMessagesProps {
    messages: Message[];
    participants: Participant[];
}
export declare const ChatMessages: FC<ChatMessagesProps>;
export {};
