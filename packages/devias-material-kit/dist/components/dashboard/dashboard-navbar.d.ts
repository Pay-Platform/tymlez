import type { FC } from 'react';
import type { AppBarProps } from '@mui/material';
interface DashboardNavbarProps extends AppBarProps {
    onOpenSidebar?: () => void;
}
export declare const DashboardNavbar: FC<DashboardNavbarProps>;
export {};
