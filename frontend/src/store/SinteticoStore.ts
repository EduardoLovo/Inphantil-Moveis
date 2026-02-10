import { create } from "zustand";
import { api } from "../services/api";
import type { ItemColor, VisualItem } from "../types/visual-item";
import axios from "axios";

interface SinteticoUpdatePayload {
  id: number;
  code?: string;
  imageUrl?: string;
  color?: ItemColor | null;
  inStock?: boolean;
  isExternal?: boolean;
  isTapete?: boolean;
}

interface SinteticoState {
  sinteticos: VisualItem[];
  isLoading: boolean;
  error: string | null;

  fetchSinteticos: () => Promise<void>;
  updateSintetico: (payload: SinteticoUpdatePayload) => Promise<void>;
}

export const useSinteticoStore = create<SinteticoState>((set) => ({
  sinteticos: [],
  isLoading: false,
  error: null,

  fetchSinteticos: async () => {
    set({ isLoading: true, error: null });
    try {
      // Busca apenas itens do tipo SINTETICO
      const response = await api.get("/visual-items", {
        params: {
          type: "SINTETICO",
        },
      });

      set({
        sinteticos: response.data,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Falha ao carregar sintéticos.";

      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },
  // Implementação da Atualização
  updateSintetico: async (payload) => {
    const { id, ...updateData } = payload;
    try {
      const response = await api.patch(`/visual-items/${id}`, updateData);
      const updatedItem = response.data;

      // Atualiza a lista localmente para refletir a mudança imediata
      set((state) => ({
        sinteticos: state.sinteticos.map((item) =>
          item.id === updatedItem.id ? { ...item, ...updatedItem } : item,
        ),
      }));
    } catch (error) {
      console.error("Erro ao atualizar sintético:", error);
      throw error;
    }
  },
}));
