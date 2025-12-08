import { create } from 'zustand';
import { api } from '../services/api';
import type { Order, OrderStatus } from '../types/order';
import axios from 'axios';

interface OrderState {
    orders: Order[];
    isLoading: boolean;
    error: string | null;

    fetchAllOrders: () => Promise<void>;
    fetchMyOrders: () => Promise<void>;
    updateOrderStatus: (
        orderId: number,
        newStatus: OrderStatus
    ) => Promise<void>;
    deleteOrder: (id: number) => Promise<void>;
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

    fetchMyOrders: async () => {
        set({ isLoading: true, error: null });
        try {
            // Chama a rota GET /orders (que já filtra pelo usuário no backend)
            const response = await api.get('/orders');
            set({ orders: response.data, isLoading: false });
        } catch (error) {
            const msg = axios.isAxiosError(error)
                ? error.response?.data?.message ||
                  'Erro ao carregar seus pedidos.'
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

    deleteOrder: async (id) => {
        try {
            await api.delete(`/orders/${id}`);

            // Remove o pedido da lista localmente para atualizar a tela sem recarregar
            set((state) => ({
                orders: state.orders.filter((order) => order.id !== id),
            }));

            alert('Pedido excluído com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao excluir pedido.');
        }
    },
}));
