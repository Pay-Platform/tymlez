import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import NextLink from 'next/link';
import { Box, Button, Collapse, ListItem } from '@mui/material';
import type { ListItemProps } from '@mui/material';
import { ChevronDown as ChevronDownIcon } from '@tymlez/devias-material-kit/dist/icons/chevron-down';
import { ChevronRight as ChevronRightIcon } from '@tymlez/devias-material-kit/dist/icons/chevron-right';

interface DashboardSidebarItemProps extends ListItemProps {
  active?: boolean;
  children?: ReactNode;
  chip?: ReactNode;
  depth: number;
  icon?: ReactNode;
  info?: ReactNode;
  open?: boolean;
  path?: string;
  title: string;
}

export const DashboardSidebarItem: FC<DashboardSidebarItemProps> = (props) => {
  const {
    active,
    children,
    chip,
    depth,
    icon,
    info,
    open: openProp,
    path,
    title,
    ...other
  } = props;
  const [open, setOpen] = useState<boolean | undefined>(openProp);

  const handleToggle = (): void => {
    setOpen((prevOpen) => !prevOpen);
  };

  let paddingLeft = 24;

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth;
  }

  // Branch
  if (children) {
    return (
      <ListItem
        disableGutters
        sx={{
          display: 'block',
          mb: 0.5,
          py: 0,
          px: 2,
        }}
        {...other}
      >
        <Button
          endIcon={
            !open ? (
              <ChevronRightIcon fontSize="small" />
            ) : (
              <ChevronDownIcon fontSize="small" />
            )
          }
          disableRipple
          onClick={handleToggle}
          startIcon={icon}
          sx={{
            color: active ? 'secondary.main' : 'neutral.300',
            justifyContent: 'flex-start',
            pl: `${paddingLeft}px`,
            pr: 3,
            textAlign: 'left',
            textTransform: 'none',
            width: '100%',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255, 0.08)',
            },
            '& .MuiButton-startIcon': {
              color: active ? 'secondary.main' : 'neutral.400',
            },
            '& .MuiButton-endIcon': {
              color: 'neutral.400',
            },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
          {info}
        </Button>
        <Collapse in={open} sx={{ mt: 0.5 }}>
          {children}
        </Collapse>
      </ListItem>
    );
  }

  // Leaf
  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        mb: 0.5,
        py: 0,
        px: 2,
      }}
    >
      <NextLink href={path as string} passHref>
        <Button
          component="a"
          startIcon={icon}
          endIcon={chip}
          disableRipple
          sx={{
            backgroundColor: active ? 'rgba(255,255,255, 0.08)' : '',
            // backgroundColor: active && 'rgba(255,255,255, 0.08)',
            borderRadius: 1,
            color: active ? 'secondary.main' : 'neutral.300',
            fontWeight: active ? 'fontWeightBold' : '',
            justifyContent: 'flex-start',
            pl: `${paddingLeft}px`,
            pr: 3,
            textAlign: 'left',
            textTransform: 'none',
            width: '100%',
            '& .MuiButton-startIcon': {
              color: active ? 'secondary.main' : 'neutral.400',
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255, 0.08)',
            },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
          {info}
        </Button>
      </NextLink>
    </ListItem>
  );
};
