import type { FC } from 'react';
import type { CalendarEvent } from '../../../types/calendar';
interface CalendarEventFormProps {
    event?: CalendarEvent;
    onAddComplete?: () => void;
    onClose?: () => void;
    onDeleteComplete?: () => void;
    onEditComplete?: () => void;
    open?: boolean;
    range?: {
        start: number;
        end: number;
    };
}
export declare const CalendarEventDialog: FC<CalendarEventFormProps>;
export {};
