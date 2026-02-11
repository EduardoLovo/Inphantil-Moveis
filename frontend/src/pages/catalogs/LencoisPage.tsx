import React, { useEffect, useState, type FormEvent } from "react";
import { useLencolStore } from "../../store/LencolStore";
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
  FaWhatsapp,
  FaBed,
  FaRulerCombined,
  FaTrash,
} from "react-icons/fa";
import { type VisualItem, ItemColor, ItemSize } from "../../types/visual-item";

// Opções de Filtro baseadas nos Tamanhos
const FILTER_OPTIONS = ["TODOS", ...Object.keys(ItemSize)];

const WHATSAPP_NUMBER = "5561982388828";

// =========================================================
// 1. MODAL DE VISUALIZAÇÃO (CLIENTE)
// =========================================================
const ViewModal: React.FC<{ item: VisualItem; onClose: () => void }> = ({
  item,
  onClose,
}) => {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Tenho interesse no lençol código *${item.code}* (${item.name || ""}). Poderia me passar mais detalhes?`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <button
          className="absolute top-4 right-4 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md z-10"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        {/* Imagem */}
        <div className="w-full aspect-square bg-gray-50 flex items-center justify-center relative flex-shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-[#313b2f] mb-1 flex items-center gap-2">
            {item.code}
          </h2>
          {item.name && (
            <p className="text-gray-500 text-lg font-medium mb-4">
              {item.name}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {item.size && (
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-bold uppercase rounded-full border border-purple-100 flex items-center gap-1">
                <FaRulerCombined /> {item.size}
              </span>
            )}
            {item.color && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold uppercase rounded-full border border-blue-100 flex items-center gap-1">
                <FaPalette /> {item.color}
              </span>
            )}
            {item.inStock ? (
              <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-bold uppercase rounded-full border border-green-100 flex items-center gap-1">
                <FaCheckCircle /> Pronta Entrega
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-50 text-red-700 text-sm font-bold uppercase rounded-full border border-red-100 flex items-center gap-1">
                <FaExclamationCircle /> Indisponível
              </span>
            )}
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
          >
            <FaWhatsapp className="text-2xl" /> Tenho Interesse
          </a>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// 2. MODAL DE EDIÇÃO (ADMIN/DEV)
// =========================================================
const EditLencolModal: React.FC<{
  item: VisualItem;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}> = ({ item, onClose, onSave, onDelete }) => {
  const [code, setCode] = useState(item.code);
  const [name, setName] = useState(item.name || "");
  const [imageUrl, setImageUrl] = useState(item.imageUrl);
  const [color, setColor] = useState(item.color || "");
  const [size, setSize] = useState(item.size || "");
  const [quantity, setQuantity] = useState(item.quantity || 0);
  const [inStock, setInStock] = useState(item.inStock);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        id: item.id,
        code,
        name,
        imageUrl,
        color: color ? (color as ItemColor) : null, // Garantindo o tipo correto
        size: size ? (size as ItemSize) : null, // Garantindo o tipo correto
        quantity: Number(quantity),
        inStock,
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Tem certeza que deseja EXCLUIR o lençol "${code}"? Essa ação não pode ser desfeita.`,
      )
    ) {
      setIsDeleting(true);
      try {
        await onDelete(item.id);
        onClose(); // Fecha o modal após excluir
      } catch (error) {
        alert("Erro ao excluir o item.");
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="bg-[#313b2f] p-5 flex justify-between items-center text-white sticky top-0 z-10">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <FaEdit className="text-[#ffd639]" /> Editar Lençol
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
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Tamanho
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none bg-white"
              >
                <option value="">Selecione</option>
                {Object.keys(ItemSize).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
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
                <option value="">Selecione</option>
                {Object.keys(ItemColor).map((c) => (
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

          <div className="flex gap-4 items-center">
            <div className="w-1/3">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Qtd.
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none"
              />
            </div>

            <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-100 self-end">
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
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading || isDeleting}
              className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 border border-red-100"
              title="Excluir Item"
            >
              {isDeleting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaTrash />
              )}
              <span className="hidden sm:inline">Excluir</span>
            </button>
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
const LencoisPage: React.FC = () => {
  // CORREÇÃO: Pegamos updateLencol diretamente do hook aqui ↓
  const { items, isLoading, error, fetchLencois, updateLencol, deleteLencol } =
    useLencolStore();

  const user = useAuthStore((state) => state.user);
  const [selectedFilter, setSelectedFilter] = useState("TODOS");

  const [editingItem, setEditingItem] = useState<VisualItem | null>(null);
  const [viewingItem, setViewingItem] = useState<VisualItem | null>(null);

  const canEdit = user && (user.role === "ADMIN" || user.role === "DEV");
  const isStaff =
    user &&
    (user.role === "ADMIN" || user.role === "DEV" || user.role === "SELLER");

  useEffect(() => {
    fetchLencois();
  }, [fetchLencois]);

  const filteredItems = (items || []).filter((item) => {
    if (selectedFilter === "TODOS") return true;
    return item.size === selectedFilter;
  });

  const handleCardClick = (item: VisualItem) => {
    if (canEdit) setEditingItem(item);
    else setViewingItem(item);
  };

  const generateWhatsappLink = (item: VisualItem) => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=Tenho interesse no lençol *${item.code}*...`;
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <h1 className="text-xl font-bold text-[#313b2f]">
          Carregando Lençóis...
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
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-[#313b2f] mb-4 flex items-center justify-center md:justify-start gap-3">
          <FaBed className="text-[#ffd639]" /> Catálogo de Lençóis (Pronta
          Entrega)
        </h1>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg text-sm font-medium">
          <FaBoxOpen />
          <span>Itens disponíveis para envio imediato.</span>
        </div>
      </div>

      {/* Filtros */}
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

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`group relative bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              isStaff && !item.inStock
                ? "border-red-200 bg-red-50/50"
                : "border-gray-100"
            }`}
          >
            <div
              className="aspect-square w-full bg-gray-50 relative overflow-hidden cursor-pointer"
              onClick={() => handleCardClick(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.code}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              {item.size && (
                <span className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                  {item.size}
                </span>
              )}
              {!item.inStock && !isStaff && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Esgotado
                  </span>
                </div>
              )}
            </div>

            <div className="p-3 text-center border-t border-gray-100 bg-white relative z-10 flex flex-col flex-1">
              <h3
                className="font-bold text-[#313b2f] text-sm md:text-base truncate mb-1"
                title={item.name || item.code}
              >
                {item.name || item.code}
              </h3>
              <p className="text-xs text-gray-500 mb-3">{item.code}</p>

              <div className="mt-auto">
                <a
                  href={generateWhatsappLink(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaWhatsapp /> Tenho Interesse
                </a>
              </div>

              {isStaff && (
                <div className="mt-2 flex justify-center gap-1 flex-wrap border-t border-gray-100 pt-2">
                  {item.inStock ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700 border border-green-200">
                      Estoque
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                      Sem Estoque
                    </span>
                  )}
                  {item.quantity !== undefined && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-700 border border-gray-200">
                      Qtd: {item.quantity}
                    </span>
                  )}
                </div>
              )}
            </div>

            {canEdit && (
              <button
                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm text-[#313b2f] opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-[#ffd639]"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingItem(item);
                }}
              >
                <FaEdit />
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mt-8">
          <FaBed className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            Nenhum lençol encontrado neste tamanho.
          </p>
        </div>
      )}

      {editingItem && (
        <EditLencolModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={updateLencol}
          onDelete={deleteLencol}
        />
      )}

      {viewingItem && (
        <ViewModal item={viewingItem} onClose={() => setViewingItem(null)} />
      )}
    </div>
  );
};

export default LencoisPage;
