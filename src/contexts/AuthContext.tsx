
import { createContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin as useLoginMutation, useSignup as useSignupMutation, useLogout as useLogoutMutation } from '@/hooks/useAuth';
import { userAPI } from '@/lib/api';

export interface User {
    id: string;
    name?: string;
    email?: string;
    role?: string;
}

export interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    isLoginPending: boolean;
    isSignupPending: boolean;
    isLogoutPending: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const loginMutation = useLoginMutation();
    const signupMutation = useSignupMutation();
    const logoutMutation = useLogoutMutation();

    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedToken = localStorage.getItem(TOKEN_KEY);
                const storedUser = localStorage.getItem(USER_KEY);
                
                if (storedToken && storedUser) {
                    setAccessToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(REFRESH_TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const data = await loginMutation.mutateAsync({ email, password });
        const token = data.data.accessToken;
        setAccessToken(token);
        
        try {
            const userProfile = await userAPI.getProfile();
            const userData = userProfile.data || userProfile;
            setUser(userData);
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
        
        navigate('/dashboard');
    };

    const signup = async (name: string, email: string, password: string) => {
        const data = await signupMutation.mutateAsync({ name, email, password });
        const token = data.data.accessToken;
        setAccessToken(token);
        
        try {
            const userProfile = await userAPI.getProfile();
            const userData = userProfile.data || userProfile;
            setUser(userData);
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
        
        navigate('/dashboard');
    };

    const logout = () => {
        logoutMutation.mutate(undefined, {
            onSettled: () => {
                setAccessToken(null);
                setUser(null);
                navigate('/auth/signin');
            },
        });
    };

    const value = {
        user,
        accessToken,
        login,
        signup,
        logout,
        isAuthenticated: !!accessToken,
        isLoading,
        isLoginPending: loginMutation.isPending,
        isSignupPending: signupMutation.isPending,
        isLogoutPending: logoutMutation.isPending,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

