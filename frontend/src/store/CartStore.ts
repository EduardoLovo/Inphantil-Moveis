import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductVariant } from "../types/products";

export interface CartItem extends Product {
  cartItemId: string; // NOVO: ID único no carrinho (ex: "produto1-variante5")
  productId: number; // ID base do produto
  quantity: number;
  selectedVariant?: ProductVariant; // NOVO: Guarda os dados da variação escolhida
  customData?: any;
}

interface CartState {
  items: CartItem[];
  // Atualizado para aceitar a variante opcionalmente
  addItem: (
    product: Product & { cartItemId?: string },
    variant?: ProductVariant,
  ) => void;
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
        // 1. DEFINE O ID ÚNICO
        // Se a página já enviou um cartItemId próprio (ex: Protetor de Parede), usa ele!
        // Se não enviou, cria o ID padrão juntando o id do Produto + id da Variante.
        const cartItemId = product.cartItemId
          ? product.cartItemId
          : variant
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
          // 2. DEFINE O PREÇO
          // Se o produto veio com um cartItemId customizado, significa que a página
          // já calculou o preço final (ex: Protetor + LED). Então confiamos no price do product.
          // Se for um produto comum com variante, usamos o preço da variante.
          let priceToUse = Number(product.price);

          if (variant && !product.cartItemId) {
            priceToUse = Number(variant.price);
          }

          set({
            items: [
              ...currentItems,
              {
                ...product,
                productId: product.id,
                price: priceToUse, // Salva o preço correto
                cartItemId: cartItemId, // Salva o ID correto
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
