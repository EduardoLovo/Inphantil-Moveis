// frontend/src/services/cepService.ts
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
  // 1. Remove tudo que não for número (pontos, traços, etc)
  const cleanCep = cep.replace(/\D/g, "");

  // 2. Validação básica: CEP deve ter 8 dígitos
  if (cleanCep.length !== 8) {
    return null;
  }

  try {
    // 3. Chamada à API pública do ViaCEP
    const response = await axios.get<CepResponse>(
      `https://viacep.com.br/ws/${cleanCep}/json/`,
    );

    // ViaCEP retorna { erro: true } se o formato for válido mas o CEP não existir
    if (response.data.erro) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
};
