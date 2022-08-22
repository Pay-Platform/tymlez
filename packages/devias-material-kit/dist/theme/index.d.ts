import type { Direction, Theme } from '@mui/material';
interface Neutral {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
}
declare module '@mui/material/styles' {
    interface Palette {
        neutral?: Neutral;
    }
    interface PaletteOptions {
        neutral?: Neutral;
    }
}
interface ThemeConfig {
    direction?: Direction;
    responsiveFontSizes?: boolean;
    mode: 'light' | 'dark';
}
export declare const createTheme: (config: ThemeConfig) => Theme;
export {};
