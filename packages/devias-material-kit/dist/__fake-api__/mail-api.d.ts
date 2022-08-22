import type { Email, Label } from '../types/mail';
declare class MailApi {
    getLabels(): Promise<Label[]>;
    getEmails({ label }: {
        label: any;
    }): Promise<Email[]>;
    getEmail(emailId: any): Promise<Email>;
}
export declare const mailApi: MailApi;
export {};
