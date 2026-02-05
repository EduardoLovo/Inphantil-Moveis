import React, { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTecidoStore } from "../store/TecidoStore";
import { useAuthStore } from "../store/AuthStore";
import type { VisualItem } from "../types/visual-item";
import {
  FaLayerGroup,
  FaEdit,
  FaSearch,
  FaCube,
  FaTimes,
  FaTrash,
  FaBoxOpen,
  FaLink,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

// =========================================================
// 1. MODAL DE VISUALIZAÇÃO (Para Usuários e Sellers)
// =========================================================
const ViewModal: React.FC<{ item: VisualItem; onClose: () => void }> = ({
  item,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md z-10"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <div className="w-full aspect-square bg-gray-50 flex items-center justify-center relative">
          <img
            src={item.imageUrl}
            alt={item.code}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-[#313b2f] mb-1">
            {item.code}
          </h2>
          <p className="text-gray-500 text-sm uppercase tracking-wider font-bold">
            Tecido
          </p>

          {!item.inStock && (
            <div className="mt-4">
              <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wide border border-red-200 flex items-center justify-center gap-2 w-fit mx-auto">
                <FaExclamationCircle /> Indisponível
              </span>
            </div>
          )}
          {item.inStock && (
            <div className="mt-4">
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide border border-green-200 flex items-center justify-center gap-2 w-fit mx-auto">
                <FaCheckCircle /> Disponível
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =========================================================
// 2. MODAL DE EDIÇÃO (Para ADMIN e DEV)
// =========================================================
const EditModal: React.FC<{
  item: VisualItem;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete: (id: number) => Promise<void>;
}> = ({ item, onClose, onSave, onDelete }) => {
  const [code, setCode] = useState(item.code || "");
  const [quantity, setQuantity] = useState<number | null>(
    item.quantity || null,
  );
  const [imagem, setImagem] = useState(item.imageUrl || "");
  const [inStock, setInStock] = useState(item.inStock);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        id: item.id,
        imageUrl: imagem,
        code,
        quantity,
        inStock,
      });
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar as alterações.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if (
      window.confirm(`Tem certeza que deseja EXCLUIR o tecido "${item.code}"?`)
    ) {
      setLoading(true);
      try {
        await onDelete(item.id);
        onClose();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir o tecido.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-[#313b2f] p-5 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <FaEdit className="text-[#ffd639]" /> Editar Tecido
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Código */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
              Código / Nome
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all"
              required
            />
          </div>

          {/* Imagem */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
              <FaLink className="text-gray-400" /> URL da Imagem
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={imagem}
                onChange={(e) => setImagem(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all text-sm"
                required
              />
              <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                <img
                  src={imagem}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Quantidade */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
              <FaCube className="text-gray-400" /> Quantidade (Metros)
            </label>
            <input
              type="number"
              value={quantity === null ? "" : quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all"
            />
          </div>

          {/* Estoque Checkbox */}
          <div
            className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${inStock ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
            onClick={() => setInStock(!inStock)}
          >
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center ${inStock ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`}
            >
              {inStock && <FaCheckCircle className="text-white text-xs" />}
            </div>
            <span
              className={`font-bold select-none ${inStock ? "text-green-700" : "text-gray-500"}`}
            >
              Disponível em Estoque
            </span>
          </div>

          {/* Ações */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-bold transition-colors"
            >
              <FaTrash /> Excluir
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#ffd639] text-[#313b2f] rounded-lg font-bold hover:brightness-95 transition-all shadow-md"
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================
// 3. COMPONENTE PRINCIPAL
// =========================================================
const TecidosPage: React.FC = () => {
  const {
    tecidos,
    isLoading,
    error,
    fetchTecidos,
    updateTecido,
    deleteTecido,
  } = useTecidoStore();
  const user = useAuthStore((state) => state.user);

  // Estados Locais
  const [editingItem, setEditingItem] = useState<VisualItem | null>(null);
  const [viewingItem, setViewingItem] = useState<VisualItem | null>(null);
  const [busca, setBusca] = useState("");

  const canEdit = user && (user.role === "ADMIN" || user.role === "DEV");
  const isStaff =
    user &&
    (user.role === "ADMIN" || user.role === "DEV" || user.role === "SELLER");

  useEffect(() => {
    if (tecidos.length === 0) {
      fetchTecidos();
    }
  }, [fetchTecidos, tecidos.length]);

  // Filtragem e Ordenação
  const tecidosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    const filtrados = tecidos.filter((item) => {
      const codigo = item.code?.toLowerCase() || "";
      const nome = item.name?.toLowerCase() || "";
      return codigo.includes(termo) || nome.includes(termo);
    });

    return [...filtrados].sort((a, b) =>
      (a.code || "").localeCompare(b.code || ""),
    );
  }, [tecidos, busca]);

  // Handler de Clique no Card
  const handleCardClick = (item: VisualItem) => {
    if (canEdit) {
      setEditingItem(item);
    } else {
      setViewingItem(item);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 animate-pulse">
        <FaLayerGroup className="text-4xl text-[#ffd639] mb-4" />
        <p className="text-lg font-medium">Carregando Tecidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 mt-20">
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          Erro: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8 md:pt-32 pb-20">
      {/* Header e Busca */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-[#313b2f] font-ins] mb-2 flex items-center justify-center md:justify-start gap-3">
            <FaLayerGroup className="text-[#ffd639]" /> Catálogo de Tecidos
          </h1>
          <p className="text-gray-500">
            {isStaff
              ? "Painel de Gestão: Clique para editar (Admin) ou ver detalhes."
              : "Toque nas imagens para ampliar."}
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Pesquisar tecido..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all text-gray-700"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {tecidosFiltrados.map((item) => (
          <div
            key={item.id}
            className={`group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
              isStaff && !item.inStock
                ? "opacity-70 border-red-200 bg-red-50/30"
                : ""
            }`}
            onClick={() => handleCardClick(item)}
          >
            {/* Imagem (Aspect Ratio para Tecidos costuma ser bom quadrado ou 3:4) */}
            <div className="aspect-square w-full bg-gray-50">
              <img
                src={item.imageUrl}
                alt={item.code}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Informações */}
            <div className="p-3 text-center border-t border-gray-100 bg-white relative z-10">
              <h3 className="font-bold text-[#313b2f] text-sm md:text-base truncate">
                {item.code}
              </h3>

              {/* Badges para Staff */}
              {isStaff && (
                <div className="mt-2">
                  {item.inStock ? (
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700 border border-green-200">
                      Estoque
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                      Esgotado
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Ícone de Edição (Hover) apenas para quem pode editar */}
            {canEdit && (
              <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <FaEdit />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feedback Vazio */}
      {tecidosFiltrados.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mt-8">
          <FaBoxOpen className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            Nenhum tecido encontrado para "{busca}".
          </p>
        </div>
      )}

      {/* Modais */}
      {editingItem && (
        <EditModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={updateTecido}
          onDelete={deleteTecido}
        />
      )}

      {viewingItem && (
        <ViewModal item={viewingItem} onClose={() => setViewingItem(null)} />
      )}
    </div>
  );
};

export default TecidosPage;
