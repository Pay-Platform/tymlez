import type { ChangeEvent, FC, MouseEvent } from 'react';
import type { Invoice } from '../../../types/invoice';
interface InvoiceListTableProps {
    group?: boolean;
    invoices: Invoice[];
    invoicesCount: number;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
}
export declare const InvoiceListTable: FC<InvoiceListTableProps>;
export {};
