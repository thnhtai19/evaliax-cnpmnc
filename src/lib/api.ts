import apiClient from './axios';

export const authAPI = {
    login: async (username: string, password: string) => {
        // const response = await apiClient.post('/auth/login', { username, password });
        // return response.data;
        return {
            accessToken: '1234567890',
            refreshToken: '1234567890',
            user: {
                id: "1",
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@gmail.com',
                username,
            },
        }
    },

    signup: async (name: string, username: string, password: string) => {
        const response = await apiClient.post('/auth/signup', { name, username, password });
        return response.data;
    },

    refreshToken: async (refreshToken: string) => {
        const response = await apiClient.post('/auth/refresh', { refreshToken });
        return response.data;
    },

    logout: async () => {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    },
};

export const userAPI = {
    getProfile: async () => {
        const response = await apiClient.get('/user/profile');
        return response.data;
    },

    updateProfile: async (data: unknown) => {
        const response = await apiClient.put('/user/profile', data);
        return response.data;
    },
};

