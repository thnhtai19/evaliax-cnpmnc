import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';

interface LoginRequest {
    email: string;
    password: string;
}

interface SignupRequest {
    name: string;
    email: string;
    password: string;
}

interface AuthResponse {
    data: {
        accessToken: string;
        refreshToken: string;
    }
}

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, Error, LoginRequest>({
        mutationFn: async (credentials) => {
            return await authAPI.login(credentials.email, credentials.password);
        },
        onSuccess: (data) => {
            localStorage.setItem(TOKEN_KEY, data.data.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken);

            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error) => {
            console.error('Login error:', error);
        },
    });
};

type RegisterResponse = { message: string; status: number; data: null };

export const useSignup = () => {
    const queryClient = useQueryClient();

    return useMutation<RegisterResponse, Error, SignupRequest>({
        mutationFn: async (credentials) => {
            return await authAPI.register(credentials.email, credentials.password);
        },
        onSuccess: () => {
            // Registration does not return tokens. Just refresh any user-related queries if needed.
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
        mutationFn: async () => Promise.resolve(),
        onSuccess: () => {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);

            queryClient.clear();
        },
    });
};

