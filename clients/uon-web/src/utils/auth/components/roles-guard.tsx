/**
 * TODO: move it to features/auth/
 */
import type { FC, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../use-auth';

interface Props {
  children: ReactNode;
  roles: string[];
}

const RolesGuard: FC<Props> = (props) => {
  const { children, roles } = props;
  const auth = useAuth();
  const router = useRouter();
  if (!roles.some((role) => auth.user?.roles.includes(role))) {
    router.push('/403');
    return null;
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export default RolesGuard;
