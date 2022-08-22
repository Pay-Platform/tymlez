import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import type { FC } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import {
  Box,
  // Button,
  //  Chip,
  Divider,
  Drawer,
  // Typography,
  useMediaQuery,
} from '@mui/material';
import type { Theme } from '@mui/material';
// import { Calendar as CalendarIcon } from '@tymlez/devias-material-kit/dist/icons/calendar';
// import { Cash as CashIcon } from '@tymlez/devias-material-kit/dist/icons/cash';
// import { ChartBar as ChartBarIcon } from '@tymlez/devias-material-kit/dist/icons/chart-bar';
// import { ChartPie as ChartPieIcon } from '@tymlez/devias-material-kit/dist/icons/chart-pie';
// import { ChatAlt2 as ChatAlt2Icon } from '@tymlez/devias-material-kit/dist/icons/chat-alt2';
// import { ClipboardList as ClipboardListIcon } from '@tymlez/devias-material-kit/dist/icons/clipboard-list';
// import { CreditCard as CreditCardIcon } from '@tymlez/devias-material-kit/dist/icons/credit-card';
import { Home as HomeIcon } from '@tymlez/devias-material-kit/dist/icons/home';
// import { LockClosed as LockClosedIcon } from '@tymlez/devias-material-kit/dist/icons/lock-closed';
// import { Mail as MailIcon } from '@tymlez/devias-material-kit/dist/icons/mail';
// import { MailOpen as MailOpenIcon } from '@tymlez/devias-material-kit/dist/icons/mail-open';
// import { Newspaper as NewspaperIcon } from '@tymlez/devias-material-kit/dist/icons/newspaper';
// import { OfficeBuilding as OfficeBuildingIcon } from '@tymlez/devias-material-kit/dist/icons/office-building';
// import { ReceiptTax as ReceiptTaxIcon } from '@tymlez/devias-material-kit/dist/icons/receipt-tax';
// import { Selector as SelectorIcon } from '@tymlez/devias-material-kit/dist/icons/selector';
// import { Share as ShareIcon } from '@tymlez/devias-material-kit/dist/icons/share';
// import { ShoppingBag as ShoppingBagIcon } from '@tymlez/devias-material-kit/dist/icons/shopping-bag';
// import { ShoppingCart as ShoppingCartIcon } from '@tymlez/devias-material-kit/dist/icons/shopping-cart';
// import { Truck as TruckIcon } from '@tymlez/devias-material-kit/dist/icons/truck';
// import { UserCircle as UserCircleIcon } from '@tymlez/devias-material-kit/dist/icons/user-circle';
// import { Users as UsersIcon } from '@tymlez/devias-material-kit/dist/icons/users';
// import { XCircle as XCircleIcon } from '@tymlez/devias-material-kit/dist/icons/x-circle';

import { Scrollbar } from '@tymlez/devias-material-kit/dist/components/scrollbar';

import { TymlezLogo } from '../components/TymlezLogo';
import { DashboardSidebarSection } from './DashboardSidebarSection';
import { OrganizationPopover } from './OrganizationPopover';
// import { useAuth } from '../utils/auth/use-auth';

interface DashboardSidebarProps {
  onClose: () => void;
  open: boolean;
}

interface Item {
  title: string;
  children?: Item[];
  chip?: ReactNode;
  icon?: ReactNode;
  path?: string;
}

interface Section {
  title: string;
  items: Item[];
}

const getSections = (
  t: TFunction,
  // roles: string[] | undefined*/,
): Section[] => {
  const uonSection = {
    title: t('Uon'),
    items: [
      {
        title: t('Main Site'),
        path: '/site',
        icon: <HomeIcon fontSize="small" />,
      },
    ],
  };
  // if (roles && roles && roles.includes('admin'))
  //   uonSection.items.push({
  //     title: t('Dashboard'),
  //     path: '/',
  //     icon: <ChartBarIcon fontSize="small" />
  //   });
  const sections = [uonSection];
  return sections;
};

export const DashboardSidebar: FC<DashboardSidebarProps> = (props) => {
  const { onClose, open } = props;
  const router = useRouter();
  //  const auth = useAuth();
  const { t } = useTranslation();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'), {
    noSsr: true,
  });
  const sections = useMemo(
    () =>
      getSections(
        t,
        //auth.user?.roles
      ),
    [
      t,
      //auth.user
    ],
  );
  const organizationsRef = useRef<HTMLButtonElement | null>(null);
  const [openOrganizationsPopover, setOpenOrganizationsPopover] =
    useState<boolean>(false);

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }

    if (open) {
      onClose?.();
    }
  };

  useEffect(
    handlePathChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router.asPath],
  );

  // const handleOpenOrganizationsPopover = (): void => {
  //   setOpenOrganizationsPopover(true);
  // };

  const handleCloseOrganizationsPopover = (): void => {
    setOpenOrganizationsPopover(false);
  };

  const content = (
    <>
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <div>
            <Box sx={{ p: 3 }}>
              <NextLink href="/" passHref>
                <a>
                  <TymlezLogo
                    sx={{
                      height: 42,
                      width: 42,
                    }}
                  />
                </a>
              </NextLink>
            </Box>
            {/* <Box sx={{ px: 2 }}>
              <Box
                onClick={handleOpenOrganizationsPopover}
                ref={organizationsRef}
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  px: 3,
                  py: '11px',
                  borderRadius: 1,
                }}
              >
                <div>
                  <Typography color="inherit" variant="subtitle1">
                    Acme Inc
                  </Typography>
                  <Typography color="neutral.400" variant="body2">
                    {t('Your tier')} : Premium
                  </Typography>
                </div>
                <SelectorIcon
                  sx={{
                    color: 'neutral.500',
                    width: 14,
                    height: 14,
                  }}
                />
              </Box>
            </Box> */}
          </div>
          <Divider
            sx={{
              borderColor: '#2D3748', // dark divider
              my: 3,
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            {sections.map((section) => (
              <DashboardSidebarSection
                key={section.title}
                path={router.asPath}
                sx={{
                  mt: 2,
                  '& + &': {
                    mt: 2,
                  },
                }}
                {...section}
              />
            ))}
          </Box>
          <Divider
            sx={{
              borderColor: '#2D3748', // dark divider
            }}
          />
          {/* <Box sx={{ p: 2 }}>
            <Typography color="neutral.100" variant="subtitle2">
              {t('Need Help?')}
            </Typography>
            <Typography color="neutral.500" variant="body2">
              {t('Check our docs')}
            </Typography>
            <NextLink href="/docs/welcome" passHref>
              <Button
                color="secondary"
                component="a"
                fullWidth
                sx={{ mt: 2 }}
                variant="contained"
              >
                {t('Documentation')}
              </Button>
            </NextLink>
          </Box> */}
        </Box>
      </Scrollbar>
      <OrganizationPopover
        anchorEl={organizationsRef.current}
        onClose={handleCloseOrganizationsPopover}
        open={openOrganizationsPopover}
      />
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            borderRightColor: 'divider',
            borderRightStyle: 'solid',
            borderRightWidth: (theme) =>
              theme.palette.mode === 'dark' ? 1 : 0,
            color: '#FFFFFF',
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};
