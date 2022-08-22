import type { FC, ReactNode } from 'react';
import type { User } from '../types/user';
interface State {
    isInitialized: boolean;
    isAuthenticated: boolean;
    user: User | null;
}
interface AuthContextValue extends State {
    platform: 'Amplify';
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    verifyCode: (username: string, code: string) => Promise<void>;
    resendCode: (username: string) => Promise<void>;
    passwordRecovery: (username: string) => Promise<void>;
    passwordReset: (username: string, code: string, newPassword: string) => Promise<void>;
}
interface AuthProviderProps {
    children: ReactNode;
}
export declare const AuthContext: import("react").Context<AuthContextValue>;
export declare const AuthProvider: FC<AuthProviderProps>;
export declare const AuthConsumer: import("react").Consumer<AuthContextValue>;
export {};
