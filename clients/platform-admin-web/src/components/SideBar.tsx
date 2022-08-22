import type { FC } from 'react';
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  Typography,
} from '@mui/material';
import * as React from 'react';

interface SideBarProps {
  data?: { id: number; tabName: string; icon: any }[];
  tab?: number;
  setTab(value: number): void;
}

export const SideBar: FC<SideBarProps> = ({ data, tab, setTab }) => {
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {data &&
        data.map((item, index) => {
          return (
            <MenuItem
              onClick={() => {
                setTab(index);
              }}
              selected={tab === index}
              sx={{ p: 2, marginTop: index === 0 ? 8 : 0 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" color="textPrimary">
                    {item.tabName}
                  </Typography>
                }
              />
            </MenuItem>
          );
        })}
    </>
  );
};
