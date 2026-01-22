import { create } from 'zustand';
import { api } from '../services/api';
import type { VisualItem } from '../types/visual-item';
import axios from 'axios';

// 1. Interface para o payload de atualização
interface ApliqueUpdatePayload {
    id: number;
    code?: string;
    imageUrl?: string; // Corresponde ao campo 'imagem' no modal
    quantity?: number | null;
    inStock?: boolean;
    sequence?: number | null;
}

interface ApliqueState {
    apllyIcons: VisualItem[];
    isLoading: boolean;
    error: string | null;

    fetchApliques: () => Promise<void>;
    updateAplique: (payload: ApliqueUpdatePayload) => Promise<void>; // ⬅️ NOVO: Função de atualização
    deleteAplique: (id: number) => Promise<void>; // ⬅️ Adicionado: Função de deletar
}

export const useApliqueStore = create<ApliqueState>((set, _) => ({
    apllyIcons: [],
    isLoading: false,
    error: null,

    fetchApliques: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/visual-items', {
                params: {
                    type: 'APLIQUE',
                },
            });

            set({
                apllyIcons: response.data,
                isLoading: false,
            });
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response
                    ? error.response.data.message
                    : 'Falha ao carregar apliques.';

            set({
                isLoading: false,
                error: errorMessage,
            });
        }
    },

    // 2. Implementação da Função de Atualização
    updateAplique: async (payload) => {
        const { id, ...dataFromModal } = payload;

        // 1. FILTRAGEM ROBÚSTA DO PAYLOAD
        const updateData: Record<string, any> = {};

        // Strings: Incluir apenas se não for vazio e não for null
        if (
            dataFromModal.code !== undefined &&
            String(dataFromModal.code).trim() !== ''
        ) {
            updateData.code = dataFromModal.code.trim();
        }
        if (
            dataFromModal.imageUrl !== undefined &&
            String(dataFromModal.imageUrl).trim() !== ''
        ) {
            updateData.imageUrl = dataFromModal.imageUrl.trim();
        }

        // Números (quantity, sequence): Incluir se for um número válido (não null)
        // Se for 0, o DTO aceitará, mas se for null ou undefined, o campo é omitido.
        if (
            dataFromModal.quantity !== undefined &&
            dataFromModal.quantity !== null
        ) {
            updateData.quantity = dataFromModal.quantity;
        }
        if (
            dataFromModal.sequence !== undefined &&
            dataFromModal.sequence !== null
        ) {
            updateData.sequence = dataFromModal.sequence;
        }

        // Booleans (inStock): Incluir sempre, pois é o propósito do campo
        if (dataFromModal.inStock !== undefined) {
            updateData.inStock = dataFromModal.inStock;
        }

        // Se o payload estiver vazio, não faz a requisição
        if (Object.keys(updateData).length === 0) {
            console.warn(
                'Tentativa de atualização sem dados válidos para o backend.',
            );
            return;
        }

        try {
            // Chamada PATCH (agora com payload filtrado)
            const response = await api.patch(`/visual-items/${id}`, updateData);
            const updatedItem = response.data;

            // Atualiza a lista local no estado (Zustand)
            set((state) => ({
                apllyIcons: state.apllyIcons.map((item) =>
                    item.id === updatedItem.id
                        ? { ...item, ...updatedItem }
                        : item,
                ),
            }));
        } catch (error) {
            // Tratamento de erro detalhado para debugar (se for 400, mostra a resposta do backend)
            if (
                axios.isAxiosError(error) &&
                error.response &&
                error.response.status === 400
            ) {
                console.error(
                    'Erro de Validação do Backend (400):',
                    error.response.data,
                );
                throw new Error(
                    `Erro de Validação: ${JSON.stringify(
                        error.response.data.message,
                    )}`,
                );
            }
            throw new Error(
                'Não foi possível salvar as alterações do aplique.',
            );
        }
    },
    // ⬇️ IMPLEMENTAÇÃO DO DELETE
    deleteAplique: async (id: number) => {
        try {
            await api.delete(`/visual-items/${id}`);

            // Remove o item da lista local imediatamente para atualizar a tela
            set((state) => ({
                apllyIcons: state.apllyIcons.filter((item) => item.id !== id),
            }));
        } catch (error) {
            console.error('Erro ao deletar aplique:', error);
            throw new Error('Não foi possível excluir o aplique.');
        }
    },
}));
