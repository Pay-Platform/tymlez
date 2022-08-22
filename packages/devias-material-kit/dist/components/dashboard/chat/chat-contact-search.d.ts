import type { ChangeEvent, FocusEvent } from 'react';
interface ChatContactSearchProps {
    isFocused?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onClickAway?: () => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    onSelect?: (result: any) => void;
    query: string;
    results: any[];
}
export declare const ChatContactSearch: import("react").ForwardRefExoticComponent<ChatContactSearchProps & import("react").RefAttributes<HTMLDivElement>>;
export {};
