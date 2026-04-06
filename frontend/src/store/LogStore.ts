import { create } from "zustand";
import { api } from "../services/api";
import axios from "axios";

// Interface para o Log (simplificada)
interface AuthLog {
  id: number;
  success: boolean;
  message: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

interface LogState {
  logs: AuthLog[];
  isLoading: boolean;
  error: string | null;

  fetchLogs: () => Promise<void>;
  clearLogs: () => Promise<void>; // <-- 1. Adicionado na interface
}

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  isLoading: false,
  error: null,

  fetchLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      // Chama a rota RESTRICTED GET /auth-logs
      const response = await api.get("/logs/auth");

      set({
        logs: response.data,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "Sem permissão ou token expirado."
          : "Falha ao carregar logs.";

      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  // <-- 2. Nova função para limpar os logs
  clearLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      // Chama a nova rota DELETE que criamos no NestJS
      await api.delete("/logs/auth/clear-all");

      // Esvazia o array localmente para dar feedback visual imediato
      set({
        logs: [],
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "Sem permissão para apagar os logs."
          : "Falha ao apagar logs.";

      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },
}));
