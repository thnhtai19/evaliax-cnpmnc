import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';

interface LoginRequest {
    username: string;
    password: string;
}

interface SignupRequest {
    name: string;
    username: string;
    password: string;
}

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        username: string;
        name?: string;
        email?: string;
    };
}

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, Error, LoginRequest>({
        mutationFn: async (credentials) => {
            return await authAPI.login(credentials.username, credentials.password);
        },
        onSuccess: (data) => {
            localStorage.setItem(TOKEN_KEY, data.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));

            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error) => {
            console.error('Login error:', error);
        },
    });
};

export const useSignup = () => {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, Error, SignupRequest>({
        mutationFn: async (credentials) => {
            return await authAPI.signup(
                credentials.name,
                credentials.username,
                credentials.password
            );
        },
        onSuccess: (data) => {
            localStorage.setItem(TOKEN_KEY, data.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));

            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error) => {
            console.error('Signup error:', error);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, void>({
        mutationFn: async () => {
            try {
                await authAPI.logout();
            } catch (error) {
                console.error('Logout API error:', error);
            }
        },
        onSuccess: () => {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(USER_KEY);

            queryClient.clear();
        },
    });
};

