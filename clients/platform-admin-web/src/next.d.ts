declare module 'next' {
  import type { ReactElement, ReactNode } from 'react';
  import type {
    NextComponentType,
    NextPageContext,
  } from 'next/dist/shared/lib/utils';

  export declare type NextPage<P = {}, IP = P> = NextComponentType<
    NextPageContext,
    IP,
    P
  > & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
}
