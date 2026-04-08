import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../lib/api';
import type { AuthResponse } from '../lib/api';

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<AuthResponse>;
    register: (name: string, email: string, password: string) => Promise<AuthResponse>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // true until session check done

    // On mount: restore session from cookie
    useEffect(() => {
        authApi.me()
            .then(data => { if (data.user) setUser(data.user as User); })
            .catch(() => { /* not logged in — that's fine */ })
            .finally(() => setLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        const data = await authApi.login(email, password);
        if (data.user) setUser(data.user as User);
        return data;
    };

    const register = async (name: string, email: string, password: string) => {
        const data = await authApi.register(name, email, password);
        if (data.user) setUser(data.user as User);
        return data;
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
