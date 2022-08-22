import type { FC, MutableRefObject } from 'react';
import type { Label } from '../../../types/mail';
interface MailSidebarProps {
    containerRef?: MutableRefObject<HTMLDivElement>;
    label?: string;
    labels: Label[];
    open?: boolean;
    onClose?: () => void;
    onCompose?: () => void;
}
export declare const MailSidebar: FC<MailSidebarProps>;
export {};
