import type { CalendarEvent } from '../types/calendar';
declare class CalendarApi {
    getEvents(): Promise<CalendarEvent[]>;
    createEvent(data: any): Promise<CalendarEvent>;
    updateEvent({ eventId, update }: {
        eventId: any;
        update: any;
    }): Promise<CalendarEvent>;
    deleteEvent(eventId: string): Promise<true>;
}
export declare const calendarApi: CalendarApi;
export {};
