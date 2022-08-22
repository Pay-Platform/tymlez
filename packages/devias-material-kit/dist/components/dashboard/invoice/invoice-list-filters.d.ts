import type { FC, MutableRefObject } from 'react';
import { InvoiceStatus } from '../../../types/invoice';
export interface Filters {
    query?: string;
    startDate?: Date;
    endDate?: Date;
    customer?: string[];
    status?: InvoiceStatus;
}
interface InvoiceListFiltersProps {
    containerRef?: MutableRefObject<HTMLDivElement>;
    filters?: Filters;
    onChange?: (filters: Filters) => void;
    onClose?: () => void;
    open?: boolean;
}
export declare const InvoiceListFilters: FC<InvoiceListFiltersProps>;
export {};
