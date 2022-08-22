import axios from 'axios';
import type {
  IAuthenticationResult,
  ILoginInput,
  IValidatedUser,
} from '@tymlez/platform-api-interfaces';

export async function postLogin({
  email,
  password,
}: ILoginInput): Promise<IAuthenticationResult> {
  return axios
    .post(
      `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/auth/login`,
      {
        email,
        password,
      },
      {
        disableAuthHeader: true,
      },
    )
    .then((res) => res.data);
}

export async function getProfile(): Promise<IValidatedUser> {
  return axios
    .get(`${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/auth/profile`)
    .then((res) => res.data);
}
