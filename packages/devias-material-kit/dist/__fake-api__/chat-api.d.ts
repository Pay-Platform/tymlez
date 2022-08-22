import type { Contact, Thread, Message, Participant } from '../types/chat';
declare class ChatApi {
    getContacts(query?: string): Promise<Contact[]>;
    getThreads(): Promise<Thread[]>;
    getThread(threadKey: string): Promise<Thread | null>;
    markThreadAsSeen(threadId: string): Promise<true>;
    getParticipants(threadKey: string): Promise<Participant[]>;
    addMessage({ threadId, recipientIds, body, }: {
        threadId: any;
        recipientIds: any;
        body: any;
    }): Promise<{
        message: Message;
        threadId: string;
    }>;
}
export declare const chatApi: ChatApi;
export {};
