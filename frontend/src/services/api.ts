import axios from 'axios';

// 1. Cria a instância base do Axios
// O Vite proxy redirecionará todas as chamadas de '/api' para 'http://localhost:3000'
export const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor de Request: Adiciona o Token JWT automaticamente
api.interceptors.request.use((config) => {
    // Pega o token do LocalStorage (onde o AuthStore irá salvar)
    const token = localStorage.getItem('accessToken');

    // Se o token existir, adiciona o cabeçalho Authorization
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Futuramente, você pode adicionar um Interceptor de Response aqui
// para lidar com erros 401 (Não Autorizado) e forçar o logout.
