import type { FC, MutableRefObject } from 'react';
interface ChatSidebarProps {
    containerRef?: MutableRefObject<HTMLDivElement>;
    onClose?: () => void;
    open?: boolean;
}
export declare const ChatSidebar: FC<ChatSidebarProps>;
export {};
