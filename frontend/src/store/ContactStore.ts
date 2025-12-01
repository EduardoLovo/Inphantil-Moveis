import { create } from 'zustand';
import { api } from '../services/api';
import type { ContactMessage } from '../types/contact';
import axios from 'axios';

interface ContactState {
    messages: ContactMessage[];
    isLoading: boolean;
    error: string | null;

    fetchMessages: () => Promise<void>;
}

export const useContactStore = create<ContactState>((set) => ({
    messages: [],
    isLoading: false,
    error: null,

    fetchMessages: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/contact');
            set({ messages: response.data, isLoading: false });
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response
                    ? error.response.data.message ||
                      'Erro ao carregar mensagens.'
                    : 'Erro de conexão.';
            set({ isLoading: false, error: errorMessage });
        }
    },
}));
