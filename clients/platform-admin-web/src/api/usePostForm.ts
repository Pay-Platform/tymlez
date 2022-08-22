import axios from 'axios';
import { useMutation } from 'react-query';

const validateStatus = (status: number) => {
  return status === 200 || status === 201 || status === 400; // default
};

export function usePostForm<T>(endpoint: string) {
  return useMutation<T>((data) => {
    return axios.post(
      `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/${endpoint}`,
      data,
      {
        validateStatus,
      },
    );
  });
}

export async function readFile(postedFile: File) {
  return new Promise((resolve, error) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        name: postedFile.name,
        content: reader.result?.toString().split('base64,')[1],
      });
    };
    reader.onerror = () => {
      error();
    };
    reader.readAsDataURL(postedFile);
  });
}

export function usePutForm<T>(endpoint: string, id: string) {
  return useMutation<T>((data) => {
    return axios.put(
      `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/${endpoint}/${id}`,
      data,
      {
        validateStatus,
      },
    );
  });
}
