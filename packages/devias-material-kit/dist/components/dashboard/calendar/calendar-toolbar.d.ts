import type { FC, ReactNode } from 'react';
import type { CalendarView } from '../../../types/calendar';
interface CalendarToolbarProps {
    children?: ReactNode;
    date: Date;
    mobile?: boolean;
    onAddClick?: () => void;
    onDateNext?: () => void;
    onDatePrev?: () => void;
    onDateToday?: () => void;
    onViewChange?: (view: CalendarView) => void;
    view: CalendarView;
}
export declare const CalendarToolbar: FC<CalendarToolbarProps>;
export {};
