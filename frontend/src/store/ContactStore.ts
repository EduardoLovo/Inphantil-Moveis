import { create } from "zustand";
import { api } from "../services/api";
import type { ContactMessage } from "../types/contact";
import axios from "axios";

interface ContactState {
  messages: ContactMessage[];
  isLoading: boolean;
  error: string | null;

  fetchMessages: () => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;
}

export const useContactStore = create<ContactState>((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  fetchMessages: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/contact");
      set({ messages: response.data, isLoading: false });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "Erro ao carregar mensagens."
          : "Erro de conexão.";
      set({ isLoading: false, error: errorMessage });
    }
  },
  deleteMessage: async (id: number) => {
    try {
      await api.delete(`/contact/${id}`);
      // Remove a mensagem do estado atual imediatamente para sumir da tela
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== id),
      }));
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error);
      // Opcional: Tratar o erro mostrando uma notificação
    }
  },
}));
