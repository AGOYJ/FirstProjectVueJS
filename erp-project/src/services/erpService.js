import axios from 'axios';

const API_URL = 'https://erp.stuapi.teclab.be';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

//interceptor to add the token to the headers
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default api

export const login = async (username, password) => {
    const response = await api.post('/users/tokens', {
        username,
        password
    });
    return response.data;
}