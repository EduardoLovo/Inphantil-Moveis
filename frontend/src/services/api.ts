import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
    baseURL: baseURL,
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
