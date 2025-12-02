import { create } from 'zustand';
import { api } from '../services/api';
import type { Order, OrderStatus } from '../types/order';
import axios from 'axios';

interface OrderState {
    orders: Order[];
    isLoading: boolean;
    error: string | null;

    fetchAllOrders: () => Promise<void>;
    updateOrderStatus: (
        orderId: number,
        newStatus: OrderStatus
    ) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
    orders: [],
    isLoading: false,
    error: null,

    fetchAllOrders: async () => {
        set({ isLoading: true, error: null });
        try {
            // Rota administrativa que lista TUDO
            const response = await api.get('/orders/admin/all');
            console.log('Teste de pedidos');

            set({ orders: response.data, isLoading: false });
        } catch (error) {
            const msg = axios.isAxiosError(error)
                ? error.response?.data?.message || 'Erro ao carregar pedidos.'
                : 'Erro de conexão.';
            set({ isLoading: false, error: msg });
        }
    },

    updateOrderStatus: async (orderId, newStatus) => {
        try {
            const response = await api.patch(`/orders/${orderId}/status`, {
                status: newStatus,
            });
            const updatedOrder = response.data;

            // Atualiza a lista localmente
            set((state) => ({
                orders: state.orders.map((order) =>
                    order.id === orderId
                        ? { ...order, status: updatedOrder.status }
                        : order
                ),
            }));
            alert(`Status do pedido #${orderId} atualizado para ${newStatus}!`);
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar status.');
        }
    },
}));
