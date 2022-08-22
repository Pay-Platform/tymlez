import { useRef, useState } from 'react';
import type { FC } from 'react';
// import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Avatar,
  //  Badge,
  Box,
  ButtonBase,
  IconButton,
  Toolbar,
  // Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { AppBarProps } from '@mui/material';
import { Menu as MenuIcon } from '@tymlez/devias-material-kit/dist/icons/menu';
// import { Bell as BellIcon } from '@tymlez/devias-material-kit/dist/icons/bell';
import { UserCircle as UserCircleIcon } from '@tymlez/devias-material-kit/dist/icons/user-circle';
// import { Search as SearchIcon } from '@tymlez/devias-material-kit/dist/icons/search';
// import { Users as UsersIcon } from '@tymlez/devias-material-kit/dist/icons/users';

import { AccountPopover } from './AccountPopover';
// import { ContentSearchDialog } from './ContentSearchDialog';
// import { NotificationsPopover } from './NotificationsPopover';
// import { LanguagePopover } from './LanguagePopover';
import logo from '../../public/static/logo_white.png';
import uonLogo from '../../public/uonwhite.png';
import { Image } from '../utils/Image';

interface DashboardNavbarProps extends AppBarProps {
  onOpenSidebar?: () => void;
}

// const languages: { [key: string]: string } = {
//   en: '/static/icons/uk_flag.svg',
//   de: '/static/icons/de_flag.svg',
//   es: '/static/icons/es_flag.svg',
// };

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  // backgroundColor: theme.palette.background.paper,
  ...(theme.palette.mode === 'light'
    ? {
        boxShadow: theme.shadows[3],
        backgroundColor: '#92d050',
      }
    : {
        borderBottomColor: theme.palette.divider,
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        boxShadow: 'none',
      }),
}));

// const LanguageButton = () => {
//   const anchorRef = useRef<HTMLButtonElement | null>(null);
//   const { i18n } = useTranslation();
//   // const [openPopover, setOpenPopover] = useState<boolean>(false);

//   const handleOpenPopover = (): void => {
//     setOpenPopover(true);
//   };

//   // const handleClosePopover = (): void => {
//   //   setOpenPopover(false);
//   // };

//   return (
//     <>
//       <IconButton onClick={handleOpenPopover} ref={anchorRef} sx={{ ml: 1 }}>
//         <Box
//           sx={{
//             display: 'flex',
//             height: 20,
//             width: 20,
//             '& img': {
//               width: '100%',
//             },
//           }}
//         >
//           <img alt="" src={languages[i18n.language]} />
//         </Box>
//       </IconButton>
//       {/* <LanguagePopover
//         anchorEl={anchorRef.current}
//         onClose={handleClosePopover}
//         open={openPopover}
//       /> */}
//     </>
//   );
// };

// const ContentSearchButton = () => {
//   const [openDialog, setOpenDialog] = useState<boolean>(false);

//   const handleOpenSearchDialog = (): void => {
//     setOpenDialog(true);
//   };

//   const handleCloseSearchDialog = (): void => {
//     setOpenDialog(false);
//   };

//   return (
//     <>
//       <Tooltip title="Search">
//         <IconButton onClick={handleOpenSearchDialog} sx={{ ml: 1 }}>
//           <SearchIcon fontSize="small" />
//         </IconButton>
//       </Tooltip>
//       <ContentSearchDialog
//         onClose={handleCloseSearchDialog}
//         open={openDialog}
//       />
//     </>
//   );
// };

// const NotificationsButton = () => {
//   const anchorRef = useRef<HTMLButtonElement | null>(null);
//   const [unread, setUnread] = useState<number>(0);
//   const [openPopover, setOpenPopover] = useState<boolean>(false);
//   // Unread notifications should come from a context and be shared with both this component and
//   // notifications popover. To simplify the demo, we get it from the popover

//   const handleOpenPopover = (): void => {
//     setOpenPopover(true);
//   };

//   const handleClosePopover = (): void => {
//     setOpenPopover(false);
//   };

//   const handleUpdateUnread = (value: number): void => {
//     setUnread(value);
//   };

//   return (
//     <>
//       <Tooltip title="Notifications">
//         <IconButton ref={anchorRef} sx={{ ml: 1 }} onClick={handleOpenPopover}>
//           <Badge color="error" badgeContent={unread}>
//             <BellIcon fontSize="small" />
//           </Badge>
//         </IconButton>
//       </Tooltip>
//       <NotificationsPopover
//         anchorEl={anchorRef.current}
//         onClose={handleClosePopover}
//         onUpdateUnread={handleUpdateUnread}
//         open={openPopover}
//       />
//     </>
//   );
// };

const AccountButton = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  // const user = {
  //   avatar: '/static/mock-images/avatars/avatar-anika_visser.png',
  //   name: 'Anika Visser',
  // };

  const handleOpenPopover = (): void => {
    setOpenPopover(true);
  };

  const handleClosePopover = (): void => {
    setOpenPopover(false);
  };

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpenPopover}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
          ml: 2,
        }}
      >
        <Avatar
          sx={{
            height: 40,
            width: 40,
          }}
          src="/tymleztlime.png"
        >
          <UserCircleIcon fontSize="small" />
        </Avatar>
      </Box>
      <AccountPopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        open={openPopover}
      />
    </>
  );
};

export const DashboardNavbar: FC<DashboardNavbarProps> = (props) => {
  const { onOpenSidebar, ...other } = props;

  return (
    <DashboardNavbarRoot
      sx={
        {
          // left: {
          //   lg: 280,
          // },
          // width: {
          //   lg: 'calc(100% - 280px)',
          // },
        }
      }
      {...other}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: 64,
          left: 0,
          px: 2,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: 'space-between',
            display: {
              lg: 'inline-flex',
              xs: 'none',
            },
          }}
        >
          <Box
            sx={{
              width: 150,
            }}
          >
            <Image src={logo} />
          </Box>

          <Box
            sx={{
              width: 80,
              p: 1,
            }}
          >
            <Image src={uonLogo} />
          </Box>
        </Box>
        <IconButton
          onClick={onOpenSidebar}
          sx={{
            display: {
              xs: 'inline-flex',
              lg: 'none',
            },
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        {/* <LanguageButton />
          <ContentSearchButton />
          <NotificationsButton /> */}
        <AccountButton />
      </Toolbar>
    </DashboardNavbarRoot>
  );
};
