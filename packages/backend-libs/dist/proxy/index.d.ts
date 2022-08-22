import { Method } from 'axios';
/**
 * Proxy http request using axios request method
 * @param url target url to proxy request
 * @param authorizationHeader Authorization header
 * @param correlationId
 * @param method http request method
 * @param query request query string
 * @param payload payload
 * @returns
 */
export declare function webProxy<T>(url: string, headers: {
    [x: string]: string;
}, method?: Method, query?: {
    [x: string]: string | any;
}, payload?: any): Promise<T>;
/**
 * Making proxy call to external api
 * @param url API url
 * @param authorizationHeader Authorization header
 * @param correlationId
 * @param query query string to pass to external api
 * @returns the data response by external api
 */
export declare function getProxy<T>(url: string, authorizationHeader: string, correlationId?: string, query?: {
    [x: string]: string | any;
}): Promise<T>;
export declare function postProxy<T>(url: string, authorizationHeader: string, payload: any): Promise<T>;
