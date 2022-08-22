export interface CalendarEvent {
    id?: string;
    allDay: boolean;
    color?: string;
    description: string;
    end: number;
    start: number;
    title: string;
}
export declare type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
