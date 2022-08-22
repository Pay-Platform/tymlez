import type { Customer, CustomerEmail, CustomerInvoice, CustomerLog } from '../types/customer';
declare class CustomerApi {
    getCustomers(): Promise<Customer[]>;
    getCustomer(): Promise<Customer>;
    getCustomerEmails(): Promise<CustomerEmail[]>;
    getCustomerInvoices(): Promise<CustomerInvoice[]>;
    getCustomerLogs(): Promise<CustomerLog[]>;
}
export declare const customerApi: CustomerApi;
export {};
