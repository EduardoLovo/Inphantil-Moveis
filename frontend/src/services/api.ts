// frontend/src/services/api.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // Garante que o token é válido e não é uma string de erro
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==========================================
// NOVOS TIPOS E FUNÇÕES DE PAGAMENTO (REDE)
// ==========================================

export interface CreditCardData {
  holderName: string;
  number: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  installments: string;
}

export interface PaymentPayload {
  orderId: string;
  amount: number;
  cardData: CreditCardData;
}

/**
 * Envia os dados do cartão e o ID do pedido para o nosso backend processar com a e-Rede
 */
export const processCreditCardPayment = async (data: PaymentPayload) => {
  // Chamamos a rota que criamos no NestJS
  const response = await api.post("/payment/credit-card", data);
  return response.data;
};

export const downloadRelatorioCotacoes = async () => {
  // Ajuste o caminho da rota conforme o seu controller
  const response = await api.get("/shipping-quote/exportar-relatorio/excel", {
    responseType: "blob", // Essencial para baixar arquivos!
  });
  return response.data;
};
