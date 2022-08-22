import axios from 'axios';
import { ACCESS_TOKEN_KEY } from './constants';

export function initAxiosAuth() {
  axios.interceptors.request.use((requestConfig) => {
    if (
      !requestConfig.disableAuthHeader &&
      (requestConfig.url?.startsWith(
        process.env.NEXT_PUBLIC_PLATFORM_API_URL,
      ) ||
        requestConfig.url?.startsWith(process.env.NEXT_PUBLIC_UON_API_URL))
    ) {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (accessToken) {
        // eslint-disable-next-line no-param-reassign
        requestConfig.headers = {
          ...requestConfig.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }
    }

    return requestConfig;
  });
}
