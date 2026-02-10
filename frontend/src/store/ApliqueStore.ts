import { create } from "zustand";
import { api } from "../services/api";
import type { VisualItem } from "../types/visual-item";
import axios from "axios";
import { jsPDF } from "jspdf";

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

const getBase64ImageFromURL = (url: string) => {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/jpeg");
      resolve(dataURL);
    };

    img.onerror = (error) => reject(error);

    // Substitua pela URL do seu backend se for diferente
    const proxyUrl = `${import.meta.env.VITE_API_URL}/proxy/image?url=${encodeURIComponent(url)}`;
    img.src = proxyUrl;
  });
};

export const generateApliquesPDF = async (apliques: any[]) => {
  const doc = new jsPDF();

  // --- CONFIGURAÇÕES DE LAYOUT ---
  const pageWidth = 210; // Largura A4 em mm
  const pageHeight = 297; // Altura A4 em mm
  const margin = 10; // Margem esquerda/direita
  const columns = 5; // Itens por linha

  // Cálculos Automáticos
  const usableWidth = pageWidth - margin * 2;
  const colWidth = usableWidth / columns; // Largura de cada "célula" (aprox 38mm)

  const imgSize = 30; // Tamanho da imagem (quadrada 30x30mm)
  const imgXOffset = (colWidth - imgSize) / 2; // Para centralizar a imagem na célula

  const rowHeight = 50; // Altura da linha (Imagem + Texto + Espaço)
  let cursorY = 40; // Posição Y inicial (deixa espaço para o cabeçalho)

  // --- CABEÇALHO ---
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text("Catálogo de Apliques", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, {
    align: "center",
  });

  doc.setLineWidth(0.5);
  doc.line(margin, 32, pageWidth - margin, 32); // Linha divisória

  // --- LOOP DOS ITENS ---
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  for (const [index, aplique] of apliques.entries()) {
    // 1. Calcular Posição na Grade
    const colIndex = index % columns;
    const xPos = margin + colIndex * colWidth;
    // Se mudou de linha (colIndex === 0) e não é o primeiro item, verificamos altura
    if (colIndex === 0 && index !== 0) {
      // Apenas lógica de "quebra de linha virtual", o Y é atualizado abaixo
    }

    // Calcular X e Y atuais

    // Verificar Quebra de Página
    // Se a próxima linha desenhada for passar do fim da página
    if (cursorY + rowHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = 20; // Reseta Y para o topo da nova página
    }

    // Desenhar Imagem
    if (aplique.imageUrl) {
      try {
        const base64Img = await getBase64ImageFromURL(aplique.imageUrl);
        // xPos + imgXOffset centraliza a imagem na célula
        doc.addImage(
          base64Img,
          "JPEG",
          xPos + imgXOffset,
          cursorY,
          imgSize,
          imgSize,
        );
      } catch (e) {
        // Fallback se falhar (desenha um quadrado cinza)
        doc.setFillColor(240, 240, 240);
        doc.rect(xPos + imgXOffset, cursorY, imgSize, imgSize, "F");
        doc.text("Erro img", xPos + colWidth / 2, cursorY + imgSize / 2, {
          align: "center",
        });
      }
    }

    // Desenhar Código/Nome
    doc.setFont("helvetica", "bold");
    // Centraliza o texto baseado no centro da célula
    doc.text(
      aplique.code || "Sem Cód.",
      xPos + colWidth / 2,
      cursorY + imgSize + 5,
      { align: "center" },
    );

    // Se este foi o último item da linha, incrementamos o Y para a próxima iteração
    if (colIndex === columns - 1) {
      cursorY += rowHeight;
    }
  }

  doc.save("catalogo-apliques.pdf");
};

export const useApliqueStore = create<ApliqueState>((set, _) => ({
  apllyIcons: [],
  isLoading: false,
  error: null,

  fetchApliques: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/visual-items", {
        params: {
          type: "APLIQUE",
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
          : "Falha ao carregar apliques.";

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
      String(dataFromModal.code).trim() !== ""
    ) {
      updateData.code = dataFromModal.code.trim();
    }
    if (
      dataFromModal.imageUrl !== undefined &&
      String(dataFromModal.imageUrl).trim() !== ""
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
        "Tentativa de atualização sem dados válidos para o backend.",
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
          item.id === updatedItem.id ? { ...item, ...updatedItem } : item,
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
          "Erro de Validação do Backend (400):",
          error.response.data,
        );
        throw new Error(
          `Erro de Validação: ${JSON.stringify(error.response.data.message)}`,
        );
      }
      throw new Error("Não foi possível salvar as alterações do aplique.");
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
      console.error("Erro ao deletar aplique:", error);
      throw new Error("Não foi possível excluir o aplique.");
    }
  },
}));
