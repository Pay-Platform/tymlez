import type { Invoice } from '../types/invoice';
declare class InvoiceApi {
    getInvoices(): Promise<Invoice[]>;
    getInvoice(): Promise<Invoice>;
}
export declare const invoiceApi: InvoiceApi;
export {};
