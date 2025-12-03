import { create } from 'zustand';
import { api } from '../services/api';
import type { Product } from '../types/products';
import axios from 'axios';

interface CreateProductData {
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    sku?: string;
    slug?: string;
    size?: string;
    color?: string;
    isAvailable?: boolean;
    isFeatured?: boolean;
    categoryId?: number;
}
interface ProductState {
    products: Product[];
    isLoading: boolean;
    error: string | null;

    fetchProducts: () => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;

    getProductById: (id: number) => Promise<Product | undefined>;
    createProduct: (data: CreateProductData) => Promise<void>;
    updateProduct: (
        id: number,
        data: Partial<CreateProductData>
    ) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
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
    getProductById: async (id) => {
        const cachedProduct = get().products.find((p) => p.id === id);
        if (cachedProduct) return cachedProduct;

        try {
            const response = await api.get(`/products/${id}`);
            const product = response.data;
            product.price = parseFloat(product.price as unknown as string);
            return product;
        } catch (error) {
            console.error('Erro ao buscar produto', error);
            return undefined;
        }
    },

    createProduct: async (data) => {
        try {
            await api.post('/products', data);
            // Opcional: Recarregar a lista ou adicionar manualmente
            // get().fetchProducts();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateProduct: async (id, data) => {
        try {
            await api.patch(`/products/${id}`, data);
            // Atualiza a lista local
            set((state) => ({
                products: state.products.map((p) =>
                    p.id === id ? { ...p, ...data } : p
                ),
            }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    deleteProduct: async (id) => {
        try {
            await api.delete(`/products/${id}`);

            // Remove da lista localmente para atualizar a UI instantaneamente
            set((state) => ({
                products: state.products.filter((p) => p.id !== id),
            }));
        } catch (error) {
            console.error(error);
            throw new Error('Erro ao excluir produto.');
        }
    },
}));
