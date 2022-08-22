import type { TypedUseSelectorHook } from 'react-redux';
import type { ThunkAction } from 'redux-thunk';
import type { Action } from '@reduxjs/toolkit';
export declare const store: import("@reduxjs/toolkit").EnhancedStore<import("redux").CombinedState<{
    calendar: import("../slices/calendar").CalendarState;
    chat: import("../slices/chat").ChatState;
    kanban: import("../slices/kanban").KanbanState;
    mail: import("../slices/mail").MailState;
}>, import("redux").AnyAction, [import("redux-thunk").ThunkMiddleware<import("redux").CombinedState<{
    calendar: import("../slices/calendar").CalendarState;
    chat: import("../slices/chat").ChatState;
    kanban: import("../slices/kanban").KanbanState;
    mail: import("../slices/mail").MailState;
}>, import("redux").AnyAction, undefined>]>;
export declare type RootState = ReturnType<typeof store.getState>;
export declare type AppDispatch = typeof store.dispatch;
export declare type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
export declare const useSelector: TypedUseSelectorHook<RootState>;
export declare const useDispatch: () => import("redux-thunk").ThunkDispatch<import("redux").CombinedState<{
    calendar: import("../slices/calendar").CalendarState;
    chat: import("../slices/chat").ChatState;
    kanban: import("../slices/kanban").KanbanState;
    mail: import("../slices/mail").MailState;
}>, undefined, import("redux").AnyAction> & import("redux").Dispatch<import("redux").AnyAction>;
