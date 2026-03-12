import { create } from "zustand";
import { api } from "../services/api";
import type { Product } from "../types/products";
import axios from "axios";

// 1. Nova Interface para as Variantes enviadas ao criar
export interface CreateProductVariantData {
  color: string;
  size: string;
  price: number;
  stock: number;
  sku?: string;
  images?: { url: string }[];
}

// 2. Interface de Criação Atualizada (Sem preço/estoque global, com array de variantes)
export interface CreateProductData {
  name: string;
  description?: string;
  categoryId?: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  slug?: string;
  variants: CreateProductVariantData[]; // A mágica das variações entra aqui!
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
    data: Partial<CreateProductData>,
  ) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/products");

      // Mapeia os dados: O preço agora está DENTRO de cada variante e precisa ser convertido para Number
      const formattedProducts = response.data.map((p: Product) => ({
        ...p,
        variants:
          p.variants?.map((v) => ({
            ...v,
            price: parseFloat(v.price as unknown as string),
          })) || [],
      }));

      set({
        products: formattedProducts,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Falha ao carregar produtos.";

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

      // Converte os preços das variantes de string (do Prisma Decimal) para float
      if (product.variants) {
        product.variants = product.variants.map((v: any) => ({
          ...v,
          price: parseFloat(v.price as string),
        }));
      }

      return product;
    } catch (error) {
      console.error("Erro ao buscar produto", error);
      return undefined;
    }
  },

  createProduct: async (data) => {
    try {
      await api.post("/products", data);
      // É uma boa prática buscar novamente para o Zustand atualizar a lista principal
      get().fetchProducts();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateProduct: async (id, data) => {
    try {
      await api.patch(`/products/${id}`, data);

      // Quando atualizamos produtos complexos (com variantes), é melhor
      // buscar do zero para garantir que temos os IDs corretos das variantes
      get().fetchProducts();
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
      throw new Error("Erro ao excluir produto.");
    }
  },
}));
