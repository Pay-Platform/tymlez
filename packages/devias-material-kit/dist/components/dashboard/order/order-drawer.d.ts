import type { FC, MutableRefObject } from 'react';
import { Order } from '../../../types/order';
interface OrderDrawerProps {
    containerRef?: MutableRefObject<HTMLDivElement>;
    open?: boolean;
    onClose?: () => void;
    order?: Order;
}
export declare const OrderDrawer: FC<OrderDrawerProps>;
export {};
