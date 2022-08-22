import { ChangeEvent, MouseEvent } from 'react';
import type { FC } from 'react';
import type { Product } from '../../../types/product';
interface ProductListTableProps {
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    products: Product[];
    productsCount: number;
    rowsPerPage: number;
}
export declare const ProductListTable: FC<ProductListTableProps>;
export {};
