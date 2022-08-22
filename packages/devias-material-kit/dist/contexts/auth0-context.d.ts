import type { FC, ReactNode } from 'react';
import type { User } from '../types/user';
interface State {
    isInitialized: boolean;
    isAuthenticated: boolean;
    user: User | null;
}
export interface AuthContextValue extends State {
    platform: 'Auth0';
    loginWithPopup: (options?: any) => Promise<void>;
    logout: () => void;
}
interface AuthProviderProps {
    children: ReactNode;
}
export declare const AuthContext: import("react").Context<AuthContextValue>;
export declare const AuthProvider: FC<AuthProviderProps>;
export declare const AuthConsumer: import("react").Consumer<AuthContextValue>;
export {};
