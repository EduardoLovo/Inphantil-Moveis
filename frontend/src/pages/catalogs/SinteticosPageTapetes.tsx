import React, { useEffect, useState, type FormEvent } from "react";
import { useSinteticoStore } from "../../store/SinteticoStore";
import { useAuthStore } from "../../store/AuthStore";
import {
  FaEdit,
  FaTimes,
  FaPalette,
  FaFilter,
  FaExclamationCircle,
  FaCheckCircle,
  FaSpinner,
  FaBoxOpen,
} from "react-icons/fa";
import type { VisualItem } from "../../types/visual-item";

const FILTER_OPTIONS = [
  "TODOS",
  "AMARELO",
  "AZUL",
  "BEGE",
  "BRANCO",
  "CINZA",
  "LARANJA",
  "LILAS",
  "MOSTARDA",
  "ROSA",
  "TIFFANY",
  "VERDE",
  "VERMELHO",
  "EXTERNO",
];

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
        <button
          className="absolute top-4 right-4 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md z-10"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <div className="w-full aspect-square bg-gray-50 flex items-center justify-center relative">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#313b2f] mb-1 ">
            {item.code}
          </h2>
          {item.name && (
            <p className="text-gray-500 text-sm font-medium mb-4">
              {item.name}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {item.color && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded-full border border-blue-100 flex items-center gap-1">
                <FaPalette /> {item.color}
              </span>
            )}
            {item.isExternal && (
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold uppercase rounded-full border border-purple-100">
                Uso Externo
              </span>
            )}
            {!item.inStock && (
              <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold uppercase rounded-full border border-red-100 flex items-center gap-1">
                <FaExclamationCircle /> Indisponível
              </span>
            )}
            {item.inStock && (
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase rounded-full border border-green-100 flex items-center gap-1">
                <FaCheckCircle /> Disponível
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// 2. MODAL DE EDIÇÃO
// =========================================================
const EditSinteticoModal: React.FC<{
  item: VisualItem;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}> = ({ item, onClose, onSave }) => {
  const [code, setCode] = useState(item.code);
  const [imageUrl, setImageUrl] = useState(item.imageUrl);
  const [color, setColor] = useState(item.color || "");
  const [inStock, setInStock] = useState(item.inStock);
  const [isExternal, setIsExternal] = useState(item.isExternal || false);
  const [isTapete, setIsTapete] = useState(item.isTapete || false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        id: item.id,
        code,
        imageUrl,
        color: color || null,
        inStock,
        isExternal,
        isTapete,
      });
      onClose();
    } catch (error) {
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#313b2f] p-5 flex justify-between items-center text-white">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <FaEdit className="text-[#ffd639]" /> Editar Sintético
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Código
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Cor
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none bg-white"
              >
                <option value="">Sem cor</option>
                {FILTER_OPTIONS.slice(1, -1).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              URL da Imagem
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none text-sm"
            />
          </div>

          <div className="space-y-3 pt-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-5 h-5 text-[#313b2f] rounded focus:ring-[#ffd639]"
              />
              <span className="text-sm font-bold text-gray-700">
                Disponível em Estoque
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isExternal}
                onChange={(e) => setIsExternal(e.target.checked)}
                className="w-5 h-5 text-[#313b2f] rounded focus:ring-[#ffd639]"
              />
              <span className="text-sm font-bold text-gray-700">
                Faz Externo
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isTapete}
                onChange={(e) => setIsTapete(e.target.checked)}
                className="w-5 h-5 text-[#313b2f] rounded focus:ring-[#ffd639]"
              />
              <span className="text-sm font-bold text-gray-700">
                Apenas para Tapete
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
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
              className="flex-1 py-2 bg-[#313b2f] text-white font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================
// 3. COMPONENTE DA PÁGINA
// =========================================================
const SinteticosPageTapetes: React.FC = () => {
  const { sinteticos, isLoading, error, fetchSinteticos, updateSintetico } =
    useSinteticoStore();
  const user = useAuthStore((state) => state.user);
  const [selectedFilter, setSelectedFilter] = useState("TODOS");

  const [editingItem, setEditingItem] = useState<VisualItem | null>(null);
  const [viewingItem, setViewingItem] = useState<VisualItem | null>(null);

  const canEdit = user && (user.role === "ADMIN" || user.role === "DEV");
  const isStaff =
    user &&
    (user.role === "ADMIN" || user.role === "DEV" || user.role === "SELLER");

  useEffect(() => {
    if (sinteticos.length === 0) fetchSinteticos();
  }, [fetchSinteticos, sinteticos.length]);

  const handleCardClick = (item: VisualItem) => {
    if (canEdit) setEditingItem(item);
    else setViewingItem(item);
  };

  const filteredItems = sinteticos.filter((item) => {
    if (selectedFilter === "TODOS") return true;
    if (selectedFilter === "EXTERNO") return item.isExternal;
    return item.color === selectedFilter;
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <h1 className="text-xl font-bold text-[#313b2f]">
          Carregando Catálogo...
        </h1>
      </div>
    );

  if (error)
    return (
      <div className="w-full max-w-4xl mx-auto p-8 mt-20 text-center">
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          Erro: {error}
        </div>
      </div>
    );

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8 md:pt-32 pb-20">
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-[#313b2f] mb-4 flex items-center justify-center md:justify-start gap-3">
          <FaPalette className="text-[#ffd639]" /> Catálogo de Cores para Tapete
        </h1>

        {/* Aviso Importante */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg text-sm font-medium">
          <FaExclamationCircle />
          <span>
            Atenção: O tom das cores pode variar de acordo com a tela do seu
            dispositivo.
          </span>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all border ${
              selectedFilter === filter
                ? "bg-[#313b2f] text-white border-[#313b2f] shadow-md transform scale-105"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {filter === "TODOS" ? (
              <span className="flex items-center gap-1">
                <FaFilter size={10} /> Todos
              </span>
            ) : (
              filter
            )}
          </button>
        ))}
      </div>

      {/* Grid de Itens */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`group relative bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
              isStaff && !item.inStock
                ? "border-red-200 bg-red-50/50"
                : "border-gray-100"
            }`}
            onClick={() => handleCardClick(item)}
          >
            {/* Imagem */}
            <div className="aspect-square w-full bg-gray-50 relative overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.code}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              {/* Overlay Indisponível (Público) */}
              {!item.inStock && !isStaff && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Esgotado
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3 text-center border-t border-gray-100 bg-white relative z-10">
              <h3 className="font-bold text-[#313b2f] text-sm md:text-base truncate">
                {item.code}
              </h3>

              {/* Badges Staff */}
              {isStaff && (
                <div className="mt-2 flex justify-center gap-1 flex-wrap">
                  {item.inStock ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700 border border-green-200">
                      Estoque
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                      Sem Estoque
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Ícone Editar (Hover) */}
            {canEdit && (
              <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm text-[#313b2f] opacity-0 group-hover:opacity-100 transition-opacity">
                <FaEdit />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mt-8">
          <FaBoxOpen className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            Nenhum item encontrado nesta categoria.
          </p>
        </div>
      )}

      {/* Modais */}
      {editingItem && (
        <EditSinteticoModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={updateSintetico}
        />
      )}

      {viewingItem && (
        <ViewModal item={viewingItem} onClose={() => setViewingItem(null)} />
      )}
    </div>
  );
};

export default SinteticosPageTapetes;
