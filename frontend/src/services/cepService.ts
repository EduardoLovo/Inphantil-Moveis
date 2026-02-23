import axios from "axios";

export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // Cidade
  uf: string; // Estado
  erro?: boolean;
}

export const searchCep = async (cep: string): Promise<CepResponse | null> => {
  // 1. Remove tudo que não for número
  const cleanCep = cep.replace(/\D/g, "");

  // 2. Validação básica
  if (cleanCep.length !== 8) {
    return null;
  }

  try {
    // TENTATIVA 1: ViaCEP
    const response = await axios.get<CepResponse>(
      `https://viacep.com.br/ws/${cleanCep}/json/`,
    );

    if (response.data.erro) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.warn(
      "ViaCEP falhou ou foi bloqueado. Tentando BrasilAPI...",
      error,
    );

    // TENTATIVA 2: Fallback para BrasilAPI
    try {
      // A BrasilAPI é outra API gratuita excelente e muito estável
      const fallbackResponse = await axios.get(
        `https://brasilapi.com.br/api/cep/v1/${cleanCep}`,
      );

      // A BrasilAPI retorna com nomes em inglês, então mapeamos para o padrão ViaCEP
      // para não quebrar o seu formulário no Frontend
      return {
        cep: fallbackResponse.data.cep,
        logradouro: fallbackResponse.data.street || "",
        complemento: "",
        bairro: fallbackResponse.data.neighborhood || "",
        localidade: fallbackResponse.data.city || "",
        uf: fallbackResponse.data.state || "",
      };
    } catch (fallbackError) {
      console.error(
        "Erro em ambas as APIs de CEP (ViaCEP e BrasilAPI):",
        fallbackError,
      );
      return null;
    }
  }
};
