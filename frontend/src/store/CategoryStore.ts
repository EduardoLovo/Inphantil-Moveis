import { create } from 'zustand';
import { api } from '../services/api';
import type { Category } from '../types/category';
import axios from 'axios';

// DTOs (Assumindo que estão definidos em outros arquivos, mas definimos aqui para clareza)
interface CreateCategoryDto {
    name: string;
    slug?: string;
}

interface CategoryState {
    categories: Category[];
    isLoading: boolean;
    error: string | null;

    fetchCategories: () => Promise<void>;
    addCategory: (data: CreateCategoryDto) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, _) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            // Rota GET /categories é pública, mas retorna dados enriquecidos se logado
            const response = await api.get('/categories');

            set({ categories: response.data, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: 'Falha ao carregar categorias.',
            });
        }
    },

    addCategory: async (data) => {
        try {
            const response = await api.post('/categories', data);
            const newCategory = response.data;

            // Adiciona a nova categoria ao estado local
            set((state) => ({
                categories: [...state.categories, newCategory],
            }));
        } catch (error) {
            const message =
                axios.isAxiosError(error) && error.response
                    ? error.response.data.message ||
                      'Erro ao adicionar categoria.'
                    : 'Erro de rede.';
            throw new Error(message);
        }
    },

    deleteCategory: async (id) => {
        try {
            await api.delete(`/categories/${id}`);

            // Remove a categoria do estado local
            set((state) => ({
                categories: state.categories.filter((cat) => cat.id !== id),
            }));
        } catch (error) {
            const message =
                axios.isAxiosError(error) && error.response
                    ? error.response.data.message ||
                      'Não foi possível excluir a categoria.'
                    : 'Erro de rede.';
            throw new Error(message);
        }
    },
}));
