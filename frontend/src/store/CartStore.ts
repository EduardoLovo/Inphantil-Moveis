import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types/products';

// Extende o tipo Produto para incluir quantidade no carrinho
export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product) => {
                const currentItems = get().items;
                const existingItem = currentItems.find(
                    (item) => item.id === product.id
                );

                if (existingItem) {
                    // Se já existe, aumenta a quantidade
                    set({
                        items: currentItems.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    // Se não, adiciona com quantidade 1
                    set({
                        items: [...currentItems, { ...product, quantity: 1 }],
                    });
                }
            },

            removeItem: (productId) => {
                set({
                    items: get().items.filter((item) => item.id !== productId),
                });
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    // Se diminuir para 0, remove o item
                    get().removeItem(productId);
                } else {
                    set({
                        items: get().items.map((item) =>
                            item.id === productId ? { ...item, quantity } : item
                        ),
                    });
                }
            },

            clearCart: () => set({ items: [] }),

            getTotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },

            getCount: () => {
                return get().items.reduce(
                    (count, item) => count + item.quantity,
                    0
                );
            },
        }),
        {
            name: 'inphantil-cart', // Nome da chave no localStorage
        }
    )
);
