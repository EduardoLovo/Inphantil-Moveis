import { create } from 'zustand';
import { api } from '../services/api';
import type { VisualItem } from '../types/visual-item'; // Reutiliza a interface
import axios from 'axios';

interface TecidoState {
    tecidos: VisualItem[];
    isLoading: boolean;
    error: string | null;

    fetchTecidos: () => Promise<void>;
}

export const useTecidoStore = create<TecidoState>((set) => ({
    tecidos: [],
    isLoading: false,
    error: null,

    fetchTecidos: async () => {
        set({ isLoading: true, error: null });
        try {
            // CHAVE: Chamada da API com o filtro 'type=TECIDO'
            const response = await api.get('/visual-items', {
                params: {
                    type: 'TECIDO', // O filtro que o backend usará
                },
            });

            set({
                tecidos: response.data,
                isLoading: false,
            });
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response
                    ? error.response.data.message
                    : 'Falha ao carregar tecidos.';

            set({
                isLoading: false,
                error: errorMessage,
            });
        }
    },
}));
