import { create } from "zustand";
import { api } from "../services/api";
import type { VisualItem } from "../types/visual-item";
import axios from "axios";

interface TecidoState {
  tecidos: VisualItem[];
  isLoading: boolean;
  error: string | null;

  fetchTecidos: () => Promise<void>;
  updateTecido: (data: Partial<VisualItem>) => Promise<void>;
  deleteTecido: (id: number) => Promise<void>;
}

export const useTecidoStore = create<TecidoState>((set) => ({
  tecidos: [],
  isLoading: false,
  error: null,

  fetchTecidos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/visual-items", {
        params: {
          type: "TECIDO",
        },
      });

      set({
        tecidos: response.data,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Falha ao carregar tecidos.";

      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  // --- Atualizar Tecido ---
  updateTecido: async (data) => {
    if (!data.id) return;

    // 1. Separamos o ID do resto dos dados
    // 'payload' conterá tudo MENOS o id.
    const { id, ...payload } = data;

    set({ isLoading: true, error: null });

    try {
      console.log("Enviando PATCH para ID:", id);
      console.log("Dados enviados:", payload); // Debug para ver o que está indo

      // 2. Enviamos apenas o 'payload' (sem o ID) no corpo
      const response = await api.patch(`/visual-items/${id}`, payload);

      set((state) => ({
        tecidos: state.tecidos.map((item) =>
          item.id === id ? response.data : item,
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Erro detalhado:", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Falha ao atualizar tecido.";

      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // --- Deletar Tecido ---
  deleteTecido: async (id) => {
    set({ isLoading: true, error: null });

    try {
      // Chama a API para deletar
      await api.delete(`/visual-items/${id}`);

      // Remove o item da lista localmente
      set((state) => ({
        tecidos: state.tecidos.filter((item) => item.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Falha ao excluir tecido.";

      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },
}));
