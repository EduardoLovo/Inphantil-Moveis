import { create } from "zustand";
import { api } from "../services/api";
import { VisualItemType } from "../types/visual-item";

interface LencolStore {
  isLoading: boolean;
  createLencol: (data: FormData) => Promise<void>;
}

export const useLencolStore = create<LencolStore>((set) => ({
  isLoading: false,

  createLencol: async (data: FormData) => {
    set({ isLoading: true });
    try {
      // Forçamos o tipo LENCOL aqui para garantir
      data.append("type", VisualItemType.LENCOL);

      await api.post("/visual-item", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Lençol cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar lençol:", error);
      alert("Erro ao criar lençol.");
    } finally {
      set({ isLoading: false });
    }
  },
}));
