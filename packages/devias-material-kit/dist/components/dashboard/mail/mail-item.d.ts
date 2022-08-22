import type { FC } from 'react';
import type { Email } from '../../../types/mail';
interface MailItemProps {
    email: Email;
    href: string;
    onDeselect?: () => void;
    onSelect?: () => void;
    selected: boolean;
}
export declare const MailItem: FC<MailItemProps>;
export {};
