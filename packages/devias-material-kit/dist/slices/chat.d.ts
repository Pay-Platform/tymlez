import type { AppThunk } from '../store';
import type { Contact, Thread } from '../types/chat';
export interface ChatState {
    activeThreadId?: string;
    contacts: {
        byId: Record<string, Contact>;
        allIds: string[];
    };
    threads: {
        byId: Record<string, Thread>;
        allIds: string[];
    };
}
export declare const reducer: import("redux").Reducer<ChatState, import("redux").AnyAction>;
export declare const getContacts: () => AppThunk;
export declare const getThreads: () => AppThunk;
export declare const getThread: (threadKey: string) => AppThunk;
export declare const markThreadAsSeen: (threadId: string) => AppThunk;
export declare const setActiveThread: (threadId?: string) => AppThunk;
export declare const addMessage: ({ threadId, recipientIds, body, }: {
    threadId?: string;
    recipientIds?: string[];
    body: string;
}) => AppThunk;
