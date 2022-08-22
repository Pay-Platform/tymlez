import type { FC } from 'react';
import type { Label } from '../../../types/mail';
interface MailLabelProps {
    active?: boolean;
    label: Label;
    onClick?: () => void;
}
export declare const MailLabel: FC<MailLabelProps>;
export {};
