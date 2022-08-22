import type { FC } from 'react';
interface NotificationsPopoverProps {
    anchorEl: null | Element;
    onClose?: () => void;
    onUpdateUnread?: (value: number) => void;
    open?: boolean;
}
export declare const NotificationsPopover: FC<NotificationsPopoverProps>;
export {};
