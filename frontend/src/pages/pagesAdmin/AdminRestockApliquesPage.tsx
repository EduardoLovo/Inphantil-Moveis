import React, { useEffect, useState, type FormEvent } from "react";
import { useApliqueStore } from "../../store/ApliqueStore";
import { useAuthStore } from "../../store/AuthStore";
import type { VisualItem } from "../../types/visual-item";
import {
  FaCube,
  FaEdit,
  FaTimes,
  FaShoppingCart,
  FaClipboardList,
  FaCheckCircle,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";

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

        <div className="aspect-square bg-gray-100 flex items-center justify-center p-4 grayscale">
          <img
            src={item.imageUrl}
            alt={item.code}
            className="w-full h-full object-contain drop-shadow-md opacity-80"
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
// 2. MODAL DE EDIÇÃO (REPOSIÇÃO)
// =========================================================
const EditModal: React.FC<{
  item: VisualItem;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}> = ({ item, onClose, onSave }) => {
  const [code, setCode] = useState(item.code || "");
  const [quantity, setQuantity] = useState<number | null>(item.quantity || 0);
  const [inStock, setInStock] = useState(item.inStock); // Vem como false
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        id: item.id,
        imageUrl: item.imageUrl,
        code,
        quantity,
        inStock,
        sequence: item.sequence,
      });
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-green-50 p-4 border-b border-green-100 flex justify-between items-center">
          <h2 className="text-green-700 font-bold flex items-center gap-2">
            <FaEdit /> Reposição de Estoque
          </h2>
          <button
            onClick={onClose}
            className="text-green-400 hover:text-green-700 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-500 mb-2">
            Ao receber novos itens, atualize a quantidade e marque "Reativar
            Venda".
          </p>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Código
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed font-medium"
              disabled
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
              <FaCube className="text-green-600" /> Nova Quantidade
            </label>
            <input
              type="number"
              value={quantity === null ? "" : quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              className="w-full px-4 py-2 border-2 border-green-400 bg-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-lg font-bold text-green-700"
              autoFocus
            />
          </div>

          <div
            className={`flex items-center gap-3 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
              inStock
                ? "bg-green-50 border-green-400"
                : "bg-gray-50 border-gray-300 hover:border-green-300"
            }`}
            onClick={() => setInStock(!inStock)}
          >
            <div
              className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${inStock ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`}
            >
              {inStock && <FaCheckCircle className="text-white text-sm" />}
            </div>
            <span
              className={`font-bold ${inStock ? "text-green-700" : "text-gray-500"}`}
            >
              Reativar Venda (Em Estoque)?
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                "Confirmar Entrada"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================
// 3. PÁGINA PRINCIPAL
// =========================================================
const RestockApliquesPage: React.FC = () => {
  const { apllyIcons, isLoading, error, fetchApliques, updateAplique } =
    useApliqueStore();
  const user = useAuthStore((state) => state.user);

  const [editingItem, setEditingItem] = useState<VisualItem | null>(null);
  const [viewingItem, setViewingItem] = useState<VisualItem | null>(null);

  const canEdit = user && (user.role === "ADMIN" || user.role === "DEV");

  useEffect(() => {
    if (apllyIcons.length === 0) {
      fetchApliques();
    }
  }, [fetchApliques, apllyIcons.length]);

  // Filtra itens indisponíveis com quantidade baixa
  const restockItems = apllyIcons.filter(
    (item) =>
      item.inStock === false &&
      (item.quantity === null ||
        item.quantity === undefined ||
        item.quantity <= 2),
  );

  const handleCardClick = (item: VisualItem) => {
    if (canEdit) setEditingItem(item);
    else setViewingItem(item);
  };

  const handleSave = async (data: any) => {
    await updateAplique(data);
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
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8 pb-20">
      {/* Header */}
      <div className="mb-10 text-center md:text-left border-b border-purple-100 pb-6">
        <h1 className="text-3xl font-bold text-[#8e44ad] flex items-center justify-center md:justify-start gap-3 mb-2 ">
          <FaClipboardList /> Lista de Reposição (Apliques)
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto md:mx-0">
          Itens atualmente <strong>indisponíveis</strong> no site que precisam
          ser comprados. Clique para registrar a entrada de estoque.
        </p>
      </div>

      {/* Grid de Itens */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {restockItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="group relative bg-gray-50 rounded-xl shadow-sm border-2 border-dashed border-gray-300 hover:border-[#8e44ad] hover:shadow-md transition-all cursor-pointer overflow-hidden opacity-90 hover:opacity-100"
          >
            {/* Imagem (Grayscale para indicar inativo) */}
            <div className="aspect-square p-4 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
              <img
                src={item.imageUrl}
                alt={item.code}
                className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Overlay de Carrinho (Badge central) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 text-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:bg-[#8e44ad] transition-colors">
              <FaShoppingCart size={20} />
            </div>

            {/* Badge de Quantidade Restante */}
            <div className="absolute bottom-2 right-2 bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm group-hover:bg-[#8e44ad] transition-colors">
              Restam: {item.quantity ?? 0}
            </div>

            {/* Info */}
            <div className="p-3 text-center border-t border-gray-200 bg-white">
              <h3 className="font-bold text-gray-500 group-hover:text-[#8e44ad] text-sm truncate transition-colors">
                {item.code}
              </h3>
            </div>

            {/* Overlay de Edição (Hover) */}
            {canEdit && (
              <div className="absolute inset-0 bg-[#8e44ad]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                <span className="bg-white text-[#8e44ad] px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 hover:bg-purple-50">
                  <FaEdit /> Repor
                </span>
              </div>
            )}
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

      {/* Modais */}
      {editingItem && (
        <EditModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSave}
        />
      )}
      {viewingItem && (
        <ViewModal item={viewingItem} onClose={() => setViewingItem(null)} />
      )}
    </div>
  );
};

export default RestockApliquesPage;
