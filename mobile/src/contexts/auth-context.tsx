import React, { createContext, useContext, ReactNode, useState } from 'react';
import { User } from '../models/user';
import { apiService } from '../services/api-service';

interface AuthContextProps {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const login: AuthContextProps['login'] = async (username: string, password: string) => {
        try {
            const response = await apiService.login(username, password);
            const payload = response.data;

            if (payload?.status && payload.data?.token) {
                setUser({ username: payload.data.user?.username ?? username });
                setToken(payload.data.token);
                return { ok: true } as const;
            }

            return { ok: false, message: String(payload?.error?.message ?? 'Login failed') } as const;
        } catch (e: any) {
            const message =
                e?.response?.data?.error?.message ??
                e?.message ??
                'Network error. Check backend server is running.';
            return { ok: false, message: String(message) } as const;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    const contextValue: AuthContextProps = {
        user,
        token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
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


