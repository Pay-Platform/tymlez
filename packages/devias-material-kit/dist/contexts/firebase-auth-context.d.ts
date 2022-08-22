import type { FC, ReactNode } from 'react';
import type { User } from '../types/user';
interface State {
    isInitialized: boolean;
    isAuthenticated: boolean;
    user: User | null;
}
interface AuthContextValue extends State {
    platform: 'Firebase';
    createUserWithEmailAndPassword: (email: string, password: string) => Promise<any>;
    signInWithEmailAndPassword: (email: string, password: string) => Promise<any>;
    signInWithGoogle: () => Promise<any>;
    logout: () => Promise<void>;
}
interface AuthProviderProps {
    children: ReactNode;
}
export declare const AuthContext: import("react").Context<AuthContextValue>;
export declare const AuthProvider: FC<AuthProviderProps>;
export declare const AuthConsumer: import("react").Consumer<AuthContextValue>;
export {};
