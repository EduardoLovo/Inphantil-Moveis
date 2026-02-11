import { create } from "zustand";
import { api } from "../services/api";
import {
  type VisualItem,
  VisualItemType,
  ItemColor,
  ItemSize,
} from "../types/visual-item";
import axios from "axios";

interface LencolUpdatePayload {
  id: number;
  name?: string;
  code?: string;
  imageUrl?: string;
  color?: ItemColor | null;
  size?: ItemSize | null;
  quantity?: number;
  inStock?: boolean;
}

interface LencolStore {
  items: VisualItem[];
  isLoading: boolean;
  error: string | null;

  fetchLencois: () => Promise<void>;
  createLencol: (data: FormData) => Promise<void>;
  updateLencol: (data: LencolUpdatePayload) => Promise<void>;
  deleteLencol: (id: number) => Promise<void>;
}

export const useLencolStore = create<LencolStore>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchLencois: async () => {
    set({ isLoading: true, error: null });
    try {
      // Rota ajustada para o plural
      const response = await api.get("/visual-items", {
        params: { type: VisualItemType.LENCOL },
      });
      set({ items: response.data, isLoading: false });
    } catch (error) {
      console.error("Erro ao buscar lençóis:", error);
      set({ isLoading: false, error: "Erro ao carregar lençóis." });
    }
  },

  createLencol: async (data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      // Garante que o tipo enviado seja LENCOL
      data.append("type", VisualItemType.LENCOL);

      // Rota ajustada para o plural
      await api.post("/visual-items", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Lençol cadastrado com sucesso!");

      // Atualiza a lista após criar (opcional, mas recomendado)
      const response = await api.get("/visual-items", {
        params: { type: VisualItemType.LENCOL },
      });
      set({ items: response.data, isLoading: false });
    } catch (error) {
      console.error("Erro ao criar lençol:", error);
      const msg =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Erro ao criar lençol.";
      alert(msg);
      set({ isLoading: false, error: msg });
    }
  },

  updateLencol: async (payload: LencolUpdatePayload) => {
    const { id, ...updateData } = payload;

    try {
      const response = await api.patch(`/visual-items/${id}`, updateData);
      const updatedItem = response.data;

      // Atualiza o item na lista localmente (Optimistic Update ou Update Real)
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item,
        ),
      }));
    } catch (error) {
      console.error("Erro ao atualizar lençol:", error);
      throw error; // Importante para o modal saber que deu erro
    }
  },

  deleteLencol: async (id: number) => {
    try {
      await api.delete(`/visual-items/${id}`);

      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.error("Erro ao excluir lençol:", error);
      throw error;
    }
  },
}));
