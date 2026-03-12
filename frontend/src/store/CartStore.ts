import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductVariant } from "../types/products";

export interface CartItem extends Product {
  cartItemId: string; // NOVO: ID único no carrinho (ex: "produto1-variante5")
  quantity: number;
  selectedVariant?: ProductVariant; // NOVO: Guarda os dados da variação escolhida
}

interface CartState {
  items: CartItem[];
  // Atualizado para aceitar a variante opcionalmente
  addItem: (product: Product, variant?: ProductVariant) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant) => {
        // Cria um ID único combinando o Produto e a Variante
        const cartItemId = variant
          ? `${product.id}-${variant.id}`
          : `${product.id}-base`;
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.cartItemId === cartItemId,
        );

        if (existingItem) {
          // Se já existe EXATAMENTE a mesma variação no carrinho, só aumenta a quantidade
          set({
            items: currentItems.map((item) =>
              item.cartItemId === cartItemId
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          // Pega o preço da variação (se existir), senão pega do produto base
          const priceToUse = variant
            ? Number(variant.price)
            : Number(product.price);

          set({
            items: [
              ...currentItems,
              {
                ...product,
                price: priceToUse, // Sobrescreve o preço para o valor da variação
                cartItemId,
                selectedVariant: variant,
                quantity: 1,
              },
            ],
          });
        }
      },

      removeItem: (cartItemId) => {
        set({
          items: get().items.filter((item) => item.cartItemId !== cartItemId),
        });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
        } else {
          set({
            items: get().items.map((item) =>
              item.cartItemId === cartItemId ? { ...item, quantity } : item,
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.price) * item.quantity,
          0,
        );
      },

      getCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "inphantil-cart", // Nome da chave no localStorage
    },
  ),
);
