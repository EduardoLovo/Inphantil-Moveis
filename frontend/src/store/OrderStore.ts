import { create } from "zustand";
import { api } from "../services/api";
import type { Order, OrderStatus } from "../types/order";
import axios from "axios";

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;

  fetchAllOrders: () => Promise<void>;
  fetchMyOrders: () => Promise<void>;
  updateOrderStatus: (orderId: number, newStatus: OrderStatus) => Promise<void>;
  fetchAdminOrders: () => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
  createOrder: (orderData: {
    addressId: number;
    items: any[];
    cpf: string;
  }) => Promise<Order>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  // --- NOVA FUNÇÃO DE CRIAR PEDIDO ---
  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      // Chama o NestJS para criar o pedido no banco (Prisma)
      const response = await api.post("/orders", orderData);

      // Adiciona o novo pedido à lista local
      set((state) => ({
        orders: [response.data, ...state.orders],
        isLoading: false,
      }));

      return response.data; // Retorna o pedido criado para usarmos o ID no Checkout!
    } catch (error) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || "Erro ao criar pedido."
        : "Erro de conexão ao criar pedido.";
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },
  // -----------------------------------

  fetchAllOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/orders/admin/all");
      set({ orders: response.data, isLoading: false });
    } catch (error) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || "Erro ao carregar pedidos."
        : "Erro de conexão.";
      set({ isLoading: false, error: msg });
    }
  },

  fetchMyOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/orders");
      set({ orders: response.data, isLoading: false });
    } catch (error) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || "Erro ao carregar seus pedidos."
        : "Erro de conexão.";
      set({ isLoading: false, error: msg });
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      const updatedOrder = response.data;

      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId
            ? { ...order, status: updatedOrder.status }
            : order,
        ),
      }));
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar status.");
    }
  },

  deleteOrder: async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== id),
      }));
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir pedido.");
    }
  },

  fetchAdminOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      // Ajuste a rota '/admin/orders' para a rota correta da sua API se for diferente
      const response = await api.get("/admin/orders");
      set({ orders: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
