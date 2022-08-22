import assert from 'assert';
import axios, { AxiosInstance, Method } from 'axios';

export type UserType = 'Installer' | 'RootAuthority' | 'Auditor';

export const getGuardianAxios = ({
  // eslint-disable-next-line no-process-env
  GUARDIAN_TYMLEZ_SERVICE_BASE_URL = process.env
    .GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
  // eslint-disable-next-line no-process-env
  GUARDIAN_TYMLEZ_SERVICE_API_KEY = process.env.GUARDIAN_TYMLEZ_SERVICE_API_KEY,
}: IGetGuardianAxiosOptions = {}): AxiosInstance => {
  assert(
    GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
    `GUARDIAN_TYMLEZ_SERVICE_BASE_URL is missing`,
  );
  assert(
    GUARDIAN_TYMLEZ_SERVICE_API_KEY,
    `GUARDIAN_TYMLEZ_SERVICE_API_KEY is missing`,
  );

  return axios.create({
    baseURL: GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
    headers: {
      Authorization: `Api-Key ${GUARDIAN_TYMLEZ_SERVICE_API_KEY}`,
    },
  });
};

interface IGetGuardianAxiosOptions {
  GUARDIAN_TYMLEZ_SERVICE_BASE_URL?: string;
  GUARDIAN_TYMLEZ_SERVICE_API_KEY?: string;
}

export async function makeGuardianRequest<T, P>(
  endpoint: string,
  method: Method,
  payload?: P,
) {
  const instance = getGuardianAxios();
  const { data } = await instance.request<T>({
    url: endpoint,
    method,
    data: payload,
  });
  return data;
}
