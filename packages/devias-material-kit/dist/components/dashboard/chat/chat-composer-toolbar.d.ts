import type { FC } from 'react';
import type { Contact } from '../../../types/chat';
interface ChatThreadComposerProps {
    onAddRecipient?: (contact: Contact) => void;
    onRemoveRecipient?: (recipientId: string) => void;
    recipients: any[];
}
export declare const ChatComposerToolbar: FC<ChatThreadComposerProps>;
export {};
