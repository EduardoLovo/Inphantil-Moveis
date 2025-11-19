import { create } from 'zustand';
import { api } from '../services/api';
import type { LoginDto, RegisterDto } from '../types/auth'; // Usaremos a interface (próximo passo)
import type { User } from '../types/auth';
import axios from 'axios';

// 1. Definição do Estado e Ações
interface AuthState {
    user: User | null;
    accessToken: string | null;
    isLoggedIn: boolean;
    isInitialized: boolean;

    // Ações
    login: (credentials: LoginDto) => Promise<void>;
    logout: () => void;
    initialize: () => Promise<void>; // Para carregar o token ao iniciar o app
    register: (data: RegisterDto) => Promise<void>;
}

// 2. Criação da Store
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isLoggedIn: false,
    isInitialized: false,

    // Inicializa o estado lendo o token do LocalStorage
    initialize: async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // 1. Define o token e o status de logado rapidamente
            set({ accessToken: token, isLoggedIn: true });

            try {
                // 2. Tenta buscar o perfil para preencher o objeto 'user'
                const userResponse = await api.get('/auth/profile');
                set({ user: userResponse.data });
            } catch (error) {
                // Se o token for inválido/expirado (401), limpa a sessão
                localStorage.removeItem('accessToken');
                set({ user: null, accessToken: null, isLoggedIn: false });
            }
        }
        set({ isInitialized: true });
    },

    register: async (data: RegisterDto) => {
        try {
            // 🚨 Nota: O endpoint de registro retorna { accessToken, user }
            const response = await api.post('/auth/register', data);

            const { accessToken, user } = response.data;

            // Salva no LocalStorage
            localStorage.setItem('accessToken', accessToken);

            // Atualiza o estado da Store
            set({ accessToken, isLoggedIn: true, user });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Lança o erro de validação (ex: Email já existe)
                throw new Error(
                    error.response.data.message || 'Erro ao tentar registrar.'
                );
            }
            throw new Error('Ocorreu um erro inesperado no registro.');
        }
    },

    // Lógica de Login
    login: async (credentials: LoginDto) => {
        try {
            // 🚨 Nota: O token ReCAPTCHA deve vir nas credenciais
            const response = await api.post('/auth/login', credentials);

            const { accessToken } = response.data;

            // Salva no LocalStorage
            localStorage.setItem('accessToken', accessToken);

            // Atualiza o estado da Store
            set({ accessToken, isLoggedIn: true });

            // Aqui, faremos uma chamada para /auth/profile para pegar os dados do usuário
            const userResponse = await api.get('/auth/profile');
            set({ user: userResponse.data });
        } catch (error) {
            // Exemplo de tratamento de erro básico
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(
                    error.response.data.message || 'Erro ao tentar fazer login.'
                );
            }
            throw new Error('Ocorreu um erro inesperado.');
        }
    },

    // Lógica de Logout
    logout: () => {
        localStorage.removeItem('accessToken');
        // Garante que o estado seja limpo completamente
        set({
            user: null,
            accessToken: null,
            isLoggedIn: false,
            isInitialized: true,
        });
    },
}));
