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
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export const setToken = (token) => {
    sessionStorage.setItem('token', token);
}

// Function to check if the user is logged in
export const logout = () => {
    sessionStorage.removeItem('token');
}

export default api
// --- AUTHENTIFICATION ---
export const login = async (username, password) => {
    const response = await api.post('/users/tokens', {
        username,
        password
    });
    return response.data;
}

// --- LISTES (CRUD) ---
export const getLists = async () => api.get('/todo-list');
export const getList = async (id) => api.get(`/todo-list/${id}`);
export const addList = async (name) => api.post('/todo-list', { name });
export const updateList = async (id, name) => api.put(`/todo-list/${id}`, { name });
export const deleteList = async (id) => api.delete(`/todo-list/${id}`);

// --- TÂCHES (CRUD) ---
export const getTasks = async (listId) => api.get(`/todo-list/${listId}/tasks`);
export const getTask = async (listId, taskId) => api.get(`/todo-list/${listId}/tasks/${taskId}`);
export const addTask = async (listId, task, completed = false) => api.post(`/todo-list/${listId}/tasks`, { task, completed });
export const updateTask = async (listId, taskId, task, completed) => api.put(`/todo-list/${listId}/tasks/${taskId}`, { task, completed });
export const deleteTask = async (listId, taskId) => api.delete(`/todo-list/${listId}/tasks/${taskId}`);

// --- HÉBERGEMENTS (CRUD) ---
export const getHostings = async () => api.get('/hostings');
export const getHosting = async (id) => api.get(`/hostings/${id}`);
export const addHosting = async (data) => api.post('/hostings', data);
export const updateHosting = async (id, data) => api.put(`/hostings/${id}`, data);
export const deleteHosting = async (id) => api.delete(`/hostings/${id}`);

// --- DOMAINES (CRUD) ---
export const getDomains = async () => api.get('/domains');
export const getDomain = async (id) => api.get(`/domains/${id}`);
export const addDomain = async (data) => api.post('/domains', data);
export const updateDomain = async (id, data) => api.put(`/domains/${id}`, data);
export const deleteDomain = async (id) => api.delete(`/domains/${id}`);

// --- UTILISATEURS (CRUD) ---
export const getUsers = async () => api.get('/users');
export const getUser = async (id) => api.get(`/users/${id}`);
export const registerUser = async (data) => api.post('/users', data);
export const updateUser = async (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = async (id) => api.delete(`/users/${id}`);