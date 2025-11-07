import apiClient from './axios';

export const authAPI = {
    login: async (email: string, password: string) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (email: string, password: string) => {
        const response = await apiClient.post('/auth/register', { email, password });
        return response.data;
    },

    refreshToken: async (refreshToken: string) => {
        const response = await apiClient.post('/auth/refresh', { refreshToken });
        return response.data;
    },

};

export const userAPI = {
    getProfile: async () => {
        const response = await apiClient.get('/users/me');
        return response.data;
    }
};

