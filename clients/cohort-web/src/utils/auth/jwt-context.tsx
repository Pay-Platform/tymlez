import { createContext, useEffect, useReducer } from 'react';
import type { FC, ReactNode } from 'react';
import type { IValidatedUser } from '@tymlez/platform-api-interfaces';
import { postLogin, getProfile } from './auth-api';
import { ACCESS_TOKEN_KEY } from './constants';

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: IValidatedUser | null;
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

type InitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: IValidatedUser | null;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: IValidatedUser;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type RegisterAction = {
  type: 'REGISTER';
  payload: {
    user: IValidatedUser;
  };
};

type Action = InitializeAction | LoginAction | LogoutAction | RegisterAction;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers: Record<string, (state: State, action: Action) => State> = {
  //@ts-expect-error coped from devias-material-kit
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  //@ts-expect-error coped from devias-material-kit
  LOGIN: (state: State, action: LoginAction): State => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  //@ts-expect-error coped from devias-material-kit
  REGISTER: (state: State, action: RegisterAction): State => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);

        if (accessToken) {
          const user = await getProfile();

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const { accessToken, user } = await postLogin({
      email,
      password,
    });

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (): Promise<void> => {
    throw new Error('Not implemented');
  };

  return (
    <AuthContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        ...state,
        platform: 'JWT',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;
