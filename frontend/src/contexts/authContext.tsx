import { UserApi } from '@/apis/userApi';
import { AuthResponse, UserDO } from '@/types/schemas/user';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

interface AuthContextType {
  user: UserDO | null;
  isLoading: boolean;
  login: (authRes: AuthResponse) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthState = {
  user: UserDO | null;
  loading: boolean;
};

enum AuthActionType {
  INIT_START = 'INIT_START',
  INIT_SUCCESS = 'INIT_SUCCESS',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REFRESH_SUCCESS = 'REFRESH_SUCCESS',
}

type AuthAction =
  | { type: AuthActionType.INIT_START }
  | { type: AuthActionType.INIT_SUCCESS; payload: { user: UserDO | null } }
  | { type: AuthActionType.LOGIN; payload: { user: UserDO } }
  | { type: AuthActionType.LOGOUT }
  | { type: AuthActionType.REFRESH_SUCCESS; payload: { user: UserDO } };

const initialState: AuthState = { user: null, loading: true };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AuthActionType.INIT_START:
      return { ...state, loading: true };
    case AuthActionType.INIT_SUCCESS:
      return { user: action.payload.user, loading: false };
    case AuthActionType.LOGIN:
      return { user: action.payload.user, loading: false };
    case AuthActionType.LOGOUT:
      return { user: null, loading: false };
    case AuthActionType.REFRESH_SUCCESS:
      return { ...state, user: action.payload.user };
    default:
      return state;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const getAuthToken = () => {
    const match = document.cookie.match(/(?:^|;\s*)authToken=([^;]*)/)
    return match ? decodeURIComponent(match[1]) : null
  }
  const setAuthToken = (token: string) => {
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    document.cookie = `authToken=${token}; path=/; max-age=${maxAge}; secure; samesite=lax`;
  }
  const removeAuthToken = () => {
    document.cookie = 'authToken=; path=/; max-age=0; secure; samesite=lax';
  }

  useEffect(() => {
    const initAuth = async () => {
      dispatch({ type: AuthActionType.INIT_START });
      const token = getAuthToken();
      if (token) {
        try {
          const profile = await UserApi.getProfile();
          dispatch({ type: AuthActionType.INIT_SUCCESS, payload: { user: profile } });
          return;
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          removeAuthToken();
        }
      }
      dispatch({ type: AuthActionType.INIT_SUCCESS, payload: { user: null } });
    };
    initAuth();
  }, []);

  const login = (authRes: AuthResponse) => {
    setAuthToken(authRes.token);
    dispatch({ type: AuthActionType.LOGIN, payload: { user: authRes.user } });
  };

  const logout = () => {
    removeAuthToken();
    dispatch({ type: AuthActionType.LOGOUT });
  };

  const refreshProfile = async () => {
    try {
      const profile = await UserApi.getProfile();
      dispatch({ type: AuthActionType.REFRESH_SUCCESS, payload: { user: profile } });
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  const value: AuthContextType = {
    user: state.user,
    isLoading: state.loading,
    login,
    logout,
    refreshProfile,
    isAuthenticated: !!state.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
