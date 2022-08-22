import type { ChangeEvent, FC, MouseEvent } from 'react';
import type { Customer } from '../../../types/customer';
interface CustomerListTableProps {
    customers: Customer[];
    customersCount: number;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
}
export declare const CustomerListTable: FC<CustomerListTableProps>;
export {};
