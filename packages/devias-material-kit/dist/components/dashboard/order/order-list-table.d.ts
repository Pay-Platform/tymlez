import type { ChangeEvent, FC, MouseEvent } from 'react';
import type { Order } from '../../../types/order';
interface OrderListTableProps {
    onOpenDrawer?: (orderId: string) => void;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    orders: Order[];
    ordersCount: number;
    page: number;
    rowsPerPage: number;
}
export declare const OrderListTable: FC<OrderListTableProps>;
export {};
