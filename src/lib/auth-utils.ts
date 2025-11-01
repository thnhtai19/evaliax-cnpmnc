const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const getStoredTokens = () => {
    return {
        accessToken: localStorage.getItem(TOKEN_KEY),
        refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    };
};

export const updateAccessToken = (newAccessToken: string) => {
    localStorage.setItem(TOKEN_KEY, newAccessToken);
};

