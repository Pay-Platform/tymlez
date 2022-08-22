import type { AppThunk } from '../store';
import type { Email, Label } from '../types/mail';
export interface MailState {
    emails: {
        byId: Record<string, Email>;
        allIds: string[];
    };
    labels: Label[];
    isSidebarOpen: boolean;
    isComposeOpen: boolean;
}
export declare const reducer: import("redux").Reducer<MailState, import("redux").AnyAction>;
export declare const getLabels: () => AppThunk;
export declare const getEmails: ({ label }: {
    label: string;
}) => AppThunk;
export declare const getEmail: (emailId: string) => AppThunk;
export declare const openSidebar: () => AppThunk;
export declare const closeSidebar: () => AppThunk;
export declare const openComposer: () => AppThunk;
export declare const closeComposer: () => AppThunk;
