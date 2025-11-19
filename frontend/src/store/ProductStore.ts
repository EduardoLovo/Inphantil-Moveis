import { create } from 'zustand';
import { api } from '../services/api';
import type { Product } from '../types/products';
import axios from 'axios';

interface ProductState {
    products: Product[];
    isLoading: boolean;
    error: string | null;

    fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            // Chama a rota pública GET /products
            const response = await api.get('/products');

            // Mapeia os dados: O preço precisa ser convertido de string para number
            const formattedProducts = response.data.map((p: Product) => ({
                ...p,
                // Garante que o preço (que vem como string do Prisma) é um número float
                price: parseFloat(p.price as unknown as string),
            }));

            set({
                products: formattedProducts,
                isLoading: false,
            });
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response
                    ? error.response.data.message
                    : 'Falha ao carregar produtos.';

            set({
                isLoading: false,
                error: errorMessage,
            });
        }
    },
}));
