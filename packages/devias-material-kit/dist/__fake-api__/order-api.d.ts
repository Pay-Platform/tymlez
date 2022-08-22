import type { Order } from '../types/order';
declare class OrderApi {
    getOrders(): Promise<Order[]>;
    getOrder(): Promise<Order>;
}
export declare const orderApi: OrderApi;
export {};
