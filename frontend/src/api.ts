import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // adjust this to match your API's base URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // If the error is due to an unauthorized request (401),
            // clear the token and redirect to login
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const setAuthToken = (token: string) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;