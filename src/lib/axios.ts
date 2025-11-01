import axios from 'axios';
import { getStoredTokens, updateAccessToken } from './auth-utils';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const { accessToken } = getStoredTokens();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const { refreshToken } = getStoredTokens();

            if (!refreshToken) {
                window.location.href = '/auth/signin';
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                    { refreshToken }
                );

                const { accessToken: newAccessToken } = response.data;

                updateAccessToken(newAccessToken);

                apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);

                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError as Error, null);
                localStorage.clear();
                window.location.href = '/auth/signin';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;

