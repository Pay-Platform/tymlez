import type { FC } from 'react';
import * as React from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import LogoutIcon from '@mui/icons-material/Logout';
import { Cog as CogIcon } from '@tymlez/devias-material-kit/dist/icons/cog';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { UserCircle as UserCircleIcon } from '@tymlez/devias-material-kit/dist/icons/user-circle';
// import { SwitchHorizontalOutlined as SwitchHorizontalOutlinedIcon } from '@tymlez/devias-material-kit/dist/icons/switch-horizontal-outlined';
import { useAuth } from '../utils/auth/use-auth';

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const { user } = useAuth();
  const { logout } = useAuth();

  const handleLogout = async (): Promise<void> => {
    try {
      onClose?.();
      await logout();
      router.push('/');
      window.location.reload();
    } catch (err) {
      toast.error('Unable to logout.');
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom',
      }}
      keepMounted
      onClose={onClose}
      open={open === true}
      PaperProps={{ sx: { width: 300 } }}
      transitionDuration={0}
      {...other}
    >
      <Box
        sx={{
          alignItems: 'center',
          p: 2,
          display: 'flex',
        }}
      >
        <Avatar
          src="/tymleztlime.png"
          sx={{
            height: 40,
            width: 40,
          }}
        >
          <UserCircleIcon fontSize="small" />
        </Avatar>
        <Box
          sx={{
            ml: 1,
          }}
        >
          <Typography variant="body1">{user?.email}</Typography>
          {/* <Typography color="textSecondary" variant="body2">
            Acme Inc
          </Typography> */}
        </Box>
      </Box>
      <Divider />

      <Box sx={{ my: 1 }}>
        <NextLink href="/report" passHref>
          <MenuItem component="a">
            <ListItemIcon>
              <SummarizeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1">Site Report</Typography>}
            />
          </MenuItem>
        </NextLink>
        <NextLink href="/report-group" passHref>
          <MenuItem component="a">
            <ListItemIcon>
              <SummarizeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1">Group Report</Typography>}
            />
          </MenuItem>
        </NextLink>

        {user?.roles.includes('admin') && (
          <NextLink href="/admin" passHref>
            <MenuItem component="a">
              <ListItemIcon>
                <CogIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body1">System Admin</Typography>}
              />
            </MenuItem>
          </NextLink>
        )}

        <Divider />
        {/* <NextLink href="/dashboard/social/profile" passHref>
          <MenuItem component="a">
            <ListItemIcon>
              <UserCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1">Profile</Typography>}
            />
          </MenuItem>
        </NextLink>
        <NextLink href="/dashboard/account" passHref>
          <MenuItem component="a">
            <ListItemIcon>
              <CogIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1">Settings</Typography>}
            />
          </MenuItem>
        </NextLink>
        <NextLink href="/dashboard" passHref>
          <MenuItem component="a">
            <ListItemIcon>
              <SwitchHorizontalOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1">Change organization</Typography>
              }
            />
          </MenuItem>
        </NextLink>
        <Divider /> */}

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body1">Logout</Typography>}
          />
        </MenuItem>
      </Box>
    </Popover>
  );
};
