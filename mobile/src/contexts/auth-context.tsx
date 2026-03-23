import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from 'react';
import { User } from '../models/user';
import {
  apiService,
  RegisterPayload,
  UpdateProfilePayload,
} from '../services/api-service';

function mapApiUserToUser(data: Record<string, unknown> | undefined): User {
  if (!data) {
    return { username: '' };
  }
  return {
    id: typeof data.id === 'number' ? data.id : undefined,
    username: String(data.username ?? ''),
    email: data.email != null ? String(data.email) : undefined,
    firstName: data.firstName != null ? String(data.firstName) : undefined,
    lastName: data.lastName != null ? String(data.lastName) : undefined,
    age: typeof data.age === 'number' ? data.age : undefined,
    role: data.role != null ? String(data.role) : undefined,
  };
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (
    username: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  register: (
    payload: RegisterPayload,
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<
    { ok: true } | { ok: false; message: string }
  >;
  updateProfile: (
    payload: UpdateProfilePayload,
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login: AuthContextProps['login'] = async (
    username: string,
    password: string,
  ) => {
    try {
      const response = await apiService.login(username, password);
      const payload = response.data;

      if (payload?.status && payload.data?.token) {
        setUser(mapApiUserToUser(payload.data.user));
        setToken(payload.data.token);
        return { ok: true } as const;
      }

      return {
        ok: false,
        message: String(payload?.error?.message ?? 'Login failed'),
      } as const;
    } catch (e: any) {
      const message =
        e?.response?.data?.error?.message ??
        e?.message ??
        'Network error. Check backend server is running.';
      return { ok: false, message: String(message) } as const;
    }
  };

  const register: AuthContextProps['register'] = async (
    registerPayload: RegisterPayload,
  ) => {
    try {
      const response = await apiService.register(registerPayload);
      const payload = response.data;

      if (payload?.status && payload.data?.token) {
        setUser(mapApiUserToUser(payload.data.user));
        setToken(payload.data.token);
        return { ok: true } as const;
      }

      return {
        ok: false,
        message: String(payload?.error?.message ?? 'Create account failed'),
      } as const;
    } catch (e: any) {
      const message =
        e?.response?.data?.error?.message ??
        e?.message ??
        'Network error. Check backend server is running.';
      return { ok: false, message: String(message) } as const;
    }
  };

  const refreshUser: AuthContextProps['refreshUser'] = useCallback(async () => {
    if (!token) {
      return { ok: false, message: 'Not signed in' } as const;
    }
    try {
      const response = await apiService.getProfile(token);
      const payload = response.data;
      if (payload?.status && payload.data) {
        setUser(
          mapApiUserToUser(payload.data as unknown as Record<string, unknown>),
        );
        return { ok: true } as const;
      }
      return {
        ok: false,
        message: String(payload?.error?.message ?? 'Could not load profile'),
      } as const;
    } catch (e: any) {
      const message =
        e?.response?.data?.error?.message ??
        e?.message ??
        'Network error. Check backend server is running.';
      return { ok: false, message: String(message) } as const;
    }
  }, [token]);

  const updateProfile: AuthContextProps['updateProfile'] = useCallback(
    async (body: UpdateProfilePayload) => {
      if (!token) {
        return { ok: false, message: 'Not signed in' } as const;
      }
      try {
        const response = await apiService.updateProfile(token, body);
        const payload = response.data;
        if (payload?.status && payload.data) {
          setUser(
            mapApiUserToUser(
              payload.data as unknown as Record<string, unknown>,
            ),
          );
          return { ok: true } as const;
        }
        return {
          ok: false,
          message: String(payload?.error?.message ?? 'Update failed'),
        } as const;
      } catch (e: any) {
        const message =
          e?.response?.data?.error?.message ??
          e?.message ??
          'Network error. Check backend server is running.';
        return { ok: false, message: String(message) } as const;
      }
    },
    [token],
  );

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const contextValue: AuthContextProps = {
    user,
    token,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
