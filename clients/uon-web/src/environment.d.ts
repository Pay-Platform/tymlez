declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ENV: string;
      NEXT_PUBLIC_GIT_SHA: string;
      NEXT_PUBLIC_PLATFORM_API_ORIGIN: string;
      NEXT_PUBLIC_PLATFORM_API_URL: string;
      NEXT_PUBLIC_UON_API_ORIGIN: string;
      NEXT_PUBLIC_UON_API_URL: string;
      NEXT_PUBLIC_LOGIN_EMAIL?: string;
      NEXT_PUBLIC_LOGIN_PASSWORD?: string;
    }
  }
}

export {};
