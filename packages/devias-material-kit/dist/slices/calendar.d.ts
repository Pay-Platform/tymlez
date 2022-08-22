import type { AppThunk } from '../store';
import type { CalendarEvent } from '../types/calendar';
export interface CalendarState {
    events: CalendarEvent[];
}
export declare const reducer: import("redux").Reducer<CalendarState, import("redux").AnyAction>;
export declare const getEvents: () => AppThunk;
export declare const createEvent: (createData: any) => AppThunk;
export declare const updateEvent: (eventId: string, update: any) => AppThunk;
export declare const deleteEvent: (eventId: string) => AppThunk;
