import type { Product } from '../types/product';
declare class ProductsApi {
    getProducts(): Promise<Product[]>;
}
export declare const productApi: ProductsApi;
export {};
