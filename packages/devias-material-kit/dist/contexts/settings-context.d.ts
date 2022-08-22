import type { FC, ReactNode } from 'react';
interface Settings {
    direction?: 'ltr' | 'rtl';
    responsiveFontSizes?: boolean;
    theme: 'light' | 'dark';
}
export interface SettingsContextValue {
    settings: Settings;
    saveSettings: (update: Settings) => void;
}
interface SettingsProviderProps {
    children?: ReactNode;
}
export declare const restoreSettings: () => Settings | null;
export declare const storeSettings: (settings: Settings) => void;
export declare const SettingsContext: import("react").Context<SettingsContextValue>;
export declare const SettingsProvider: FC<SettingsProviderProps>;
export declare const SettingsConsumer: import("react").Consumer<SettingsContextValue>;
export {};
