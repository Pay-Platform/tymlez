import axios, { Method } from 'axios';
import { logger } from '../pino';

import { HEADER_KEYS } from './inteface';
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
export async function webProxy<T>(
  url: string,
  headers: { [x: string]: string },
  method: Method = 'GET',
  query: { [x: string]: string | any } = {},
  payload: any = undefined,
): Promise<T> {
  console.info({ url, method, query }, `Proxy request to -- > ${url}`);
  try {
    const { data } = await axios.request<T>({
      url,
      method: method || 'GET',
      headers,
      data: payload,
      params: query,
    });
    return data;
  } catch (error) {
    logger.error({ error, url }, 'Error when proxy request');
    throw error;
  }
}
/**
 * Making proxy call to external api
 * @param url API url
 * @param authorizationHeader Authorization header
 * @param correlationId
 * @param query query string to pass to external api
 * @returns the data response by external api
 */
export async function getProxy<T>(
  url: string,
  authorizationHeader: string,
  correlationId = '',
  query: { [x: string]: string | any } = {},
) {
  const headers = {
    [HEADER_KEYS.AUTHORIZATION]: correlationId,
    [HEADER_KEYS.AUTHORIZATION]: authorizationHeader,
  };
  return webProxy<T>(url, headers, 'GET', query);
}

export async function postProxy<T>(
  url: string,
  authorizationHeader: string,
  payload: any,
) {
  const headers = {
    Authorization: authorizationHeader,
  };
  return webProxy<T>(url, headers, 'POST', {}, payload);
}
