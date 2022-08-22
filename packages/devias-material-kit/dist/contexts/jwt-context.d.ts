import type { FC, ReactNode } from 'react';
import type { User } from '../types/user';
interface State {
    isInitialized: boolean;
    isAuthenticated: boolean;
    user: User | null;
}
export interface AuthContextValue extends State {
    platform: 'JWT';
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, name: string, password: string) => Promise<void>;
}
interface AuthProviderProps {
    children: ReactNode;
}
export declare const AuthContext: import("react").Context<AuthContextValue>;
export declare const AuthProvider: FC<AuthProviderProps>;
export declare const AuthConsumer: import("react").Consumer<AuthContextValue>;
export {};
