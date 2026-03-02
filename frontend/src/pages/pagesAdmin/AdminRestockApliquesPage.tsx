import React, { useEffect, useState } from "react";
import { useApliqueStore } from "../../store/ApliqueStore";
import type { VisualItem } from "../../types/visual-item";
import {
  FaTimes,
  FaClipboardList,
  FaCheckCircle,
  FaSpinner,
  FaExclamationCircle,
  FaFilePdf, // Ícone adicionado para o botão de PDF
} from "react-icons/fa";

// Importações para geração de PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// =========================================================
// 1. MODAL DE VISUALIZAÇÃO
// =========================================================
const ViewModal: React.FC<{ item: VisualItem; onClose: () => void }> = ({
  item,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-200">
        <button
          className="absolute top-3 right-3 bg-white/90 hover:bg-red-500 hover:text-white text-gray-500 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md z-10"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        {/* Removido o grayscale daqui para a foto aparecer colorida no modal */}
        <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
          <img
            src={item.imageUrl}
            alt={item.code}
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>

        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-500 mb-2">{item.code}</h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full border border-red-100">
            <FaExclamationCircle />
            <span className="text-sm font-bold">
              Item Indisponível (Estoque: {item.quantity ?? 0})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// 3. PÁGINA PRINCIPAL
// =========================================================
const RestockApliquesPage: React.FC = () => {
  const { apllyIcons, isLoading, error, fetchApliques } = useApliqueStore();

  const [viewingItem, setViewingItem] = useState<VisualItem | null>(null);

  useEffect(() => {
    if (apllyIcons.length === 0) {
      fetchApliques();
    }
  }, [fetchApliques, apllyIcons.length]);

  // Filtra itens indisponíveis com quantidade menor que 4
  const restockItems = apllyIcons.filter(
    (item) =>
      item.inStock === false &&
      (item.quantity === null ||
        item.quantity === undefined ||
        item.quantity <= 4), // <-- AQUI FOI ALTERADO PARA MENOR QUE 4
  );

  // Função responsável por gerar o PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Adiciona título
    doc.setFontSize(18);
    doc.text("Lista de Reposição - Apliques", 14, 22);

    // Configura data de geração
    doc.setFontSize(10);
    doc.setTextColor(100);
    const dateStr = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.text(`Gerado em: ${dateStr}`, 14, 30);

    // Preparação dos dados para a tabela
    const tableColumn = ["Código", "Quantidade Restante", "Status"];
    const tableRows = restockItems.map((item) => [
      item.code,
      item.quantity?.toString() || "0",
      "Indisponível",
    ]);

    // Cria a tabela
    autoTable(doc, {
      startY: 35,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [142, 68, 173] }, // Cor roxa baseada na UI
      styles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Salva o PDF
    doc.save(`reposicao_apliques_${new Date().getTime()}.pdf`);
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#8e44ad] mb-4" />
        <h1 className="text-xl font-bold text-[#313b2f]">
          Carregando Lista de Compras...
        </h1>
      </div>
    );

  if (error)
    return (
      <div className="w-full max-w-4xl mx-auto p-8 mt-20 text-center">
        <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-xl inline-block">
          <h1 className="font-bold text-lg mb-1">Erro ao carregar dados</h1>
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-32 pb-20">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-center border-b border-purple-100 pb-6 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-[#8e44ad] flex items-center justify-center md:justify-start gap-3 mb-2 ">
            <FaClipboardList /> Lista de Reposição (Apliques)
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto md:mx-0">
            Itens atualmente <strong>indisponíveis</strong> no site que precisam
            ser comprados. Clique para visualizar o item em detalhes.
          </p>
        </div>

        {/* Botão de PDF */}
        {restockItems.length > 0 && (
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-6 py-3 bg-[#8e44ad] text-white font-bold rounded-xl shadow hover:bg-[#732d91] transition-colors"
          >
            <FaFilePdf size={18} />
            Baixar PDF
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
        {restockItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setViewingItem(item)} // <--- AQUI: ADICIONADO O ONCLICK
            className="group relative bg-gray-50 rounded-xl shadow-sm border-2 border-dashed border-gray-300 hover:border-[#8e44ad] hover:shadow-md transition-all cursor-pointer overflow-hidden opacity-90 hover:opacity-100"
          >
            {/* DIMINUÍMOS O PADDING (de p-4 para p-2) PARA A FOTO CRESCER DENTRO DO CARD */}
            <div className="aspect-square p-2 flex items-center justify-center group-hover:grayscale-0 transition-all duration-500">
              <img
                src={item.imageUrl}
                alt={item.code}
                className="w-full h-full object-contain drop-shadow-sm group-hover:scale-115 transition-transform duration-300"
              />
            </div>

            {/* Badge de Quantidade Restante */}
            <div className="absolute bottom-12 right-2 bg-gray-500 text-white text-[12px] font-bold px-3 py-1 rounded shadow-sm transition-colors z-10">
              Restam: {item.quantity ?? 0}
            </div>

            {/* Info */}
            <div className="p-4 text-center border-t border-gray-200 bg-white relative z-0">
              <h3 className="font-bold text-gray-500 group-hover:text-[#8e44ad] text-base truncate transition-colors">
                {item.code}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Estado Vazio (Sucesso) */}
      {restockItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-green-50 rounded-3xl border border-green-200 text-center mt-8">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Nenhuma reposição necessária!
          </h2>
          <p className="text-green-700">
            Não há apliques inativos com estoque crítico no momento.
          </p>
        </div>
      )}

      {/* Renderiza o modal se houver um item selecionado */}
      {viewingItem && (
        <ViewModal item={viewingItem} onClose={() => setViewingItem(null)} />
      )}
    </div>
  );
};

export default RestockApliquesPage;
