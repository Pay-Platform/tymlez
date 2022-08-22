import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Card, Container, Typography } from '@mui/material';
import { GuestGuard } from '@tymlez/devias-material-kit/dist/components/authentication/guest-guard';
import { useAuth } from '@tymlez/devias-material-kit/dist/hooks/use-auth';
import { gtm } from '@tymlez/devias-material-kit/dist/lib/gtm';
import { TymlezLogo } from '../../components/TymlezLogo';
import { JWTLogin } from '../../utils/auth/components/jwt-login';

const Login: NextPage = () => {
  const { platform } = useAuth();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: '60px',
              md: '120px',
            },
          }}
        >
          <Card elevation={16} sx={{ p: 4 }}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <NextLink href="/" passHref>
                <a>
                  <TymlezLogo
                    sx={{
                      height: 40,
                      width: 40,
                    }}
                  />
                </a>
              </NextLink>
              <Typography variant="h4">Log in</Typography>
              <Typography color="textSecondary" sx={{ mt: 2 }} variant="body2">
                Sign in on the internal platform (
                <span data-test-id="version">
                  {process.env.NEXT_PUBLIC_GIT_SHA}
                </span>
                )
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3,
              }}
            >
              {platform === 'JWT' && <JWTLogin />}
            </Box>
          </Card>
        </Container>
      </Box>
    </>
  );
};

Login.getLayout = (page) => <GuestGuard>{page}</GuestGuard>;

export default Login;
