import { useContext } from 'react';
import { AuthContext } from './jwt-context';

export const useAuth = () => useContext(AuthContext);
