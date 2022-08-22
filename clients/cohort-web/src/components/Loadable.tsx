import { FC, Suspense } from 'react';
import LoadingScreen from './LoadingScreen';

function Loadable<T>(Component: FC<T>) {
  return (props: T) => {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

export default Loadable;
