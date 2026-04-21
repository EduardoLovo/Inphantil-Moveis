import React, { useEffect, useState, type FormEvent } from "react";
import { useCategoryStore } from "../../store/CategoryStore";
import { useAuthStore } from "../../store/AuthStore";
import { Navigate } from "react-router-dom";
import {
  FaTrashAlt,
  FaTag,
  FaSpinner,
  FaBoxOpen,
  FaCogs,
  FaPalette,
  FaRuler,
  FaPuzzlePiece,
  FaShapes, // <-- Adicionado o ícone
} from "react-icons/fa";

// --- COMPONENTE: FORMULÁRIO DE CRIAÇÃO ---
const CategoryForm: React.FC<{ onAdd: (data: any) => Promise<void> }> = ({
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  // 👉 NOVOS ESTADOS: As regras do JSON
  const [hasSizes, setHasSizes] = useState(true);
  const [hasColors, setHasColors] = useState(true);
  const [colorPalette, setColorPalette] = useState("CAMA_COLORS");
  const [hasComplements, setHasComplements] = useState(false);
  const [hasModels, setHasModels] = useState(false); // <-- NOVO ESTADO AQUI

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, ""),
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ⚡ A MÁGICA: Empacotando as regras no formato JSON
    const configJson = {
      showSizes: hasSizes,
      showColors: hasColors,
      colorPalette: hasColors ? colorPalette : null,
      showComplements: hasComplements,
      showModels: hasModels, // <-- ENVIANDO PARA O BANCO!
    };

    try {
      await onAdd({
        name: name.trim(),
        slug: slug.trim() || undefined,
        config: configJson, // Mandando pro NestJS!
      });

      // Limpar campos
      setName("");
      setSlug("");
      setHasSizes(true);
      setHasColors(true);
      setHasComplements(false);
      setHasModels(false); // Limpa o estado
    } catch (err: any) {
      setError(err.message || "Erro ao criar categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
        <div className="p-2 bg-yellow-100 rounded-lg text-[#ffd639]">
          <FaCogs className="text-xl text-[#313b2f]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#313b2f]">
            Nova Categoria Inteligente
          </h3>
          <p className="text-xs text-gray-500">
            Defina o nome e as regras que os produtos desta categoria deverão
            seguir.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          <div className="w-full md:flex-1">
            <label
              htmlFor="name"
              className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1"
            >
              Nome da Categoria
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] outline-none transition-all font-medium text-[#313b2f]"
              placeholder="Ex: Camas Montessorianas"
            />
          </div>
          <div className="w-full md:flex-1">
            <label
              htmlFor="slug"
              className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1"
            >
              Slug (URL Amigável)
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] outline-none transition-all font-mono text-sm text-gray-600"
              placeholder="Ex: camas-montessorianas"
            />
          </div>
        </div>

        {/* 👉 PAINEL DE REGRAS JSON */}
        <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
          <h4 className="text-sm font-bold text-[#313b2f] mb-4">
            Regras de Variação (Configuração Dinâmica)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Regra de Tamanho */}
            <label
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${hasSizes ? "border-[#ffd639] bg-[#ffd639]/10" : "border-gray-200 bg-white"}`}
            >
              <input
                type="checkbox"
                checked={hasSizes}
                onChange={(e) => setHasSizes(e.target.checked)}
                className="w-4 h-4 text-[#313b2f] focus:ring-[#313b2f]"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  <FaRuler className="text-gray-400" /> Usa Tamanhos?
                </span>
                <span className="text-[10px] text-gray-500">
                  Ex: Casal, Solteiro
                </span>
              </div>
            </label>

            {/* Regra de Opção Extra */}
            <label
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${hasComplements ? "border-[#ffd639] bg-[#ffd639]/10" : "border-gray-200 bg-white"}`}
            >
              <input
                type="checkbox"
                checked={hasComplements}
                onChange={(e) => setHasComplements(e.target.checked)}
                className="w-4 h-4 text-[#313b2f] focus:ring-[#313b2f]"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  <FaPuzzlePiece className="text-gray-400" /> Opção Extra?
                </span>
                <span className="text-[10px] text-gray-500">
                  Ex: Com Colchão
                </span>
              </div>
            </label>

            {/* Regra de Cor */}
            <label
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${hasColors ? "border-[#ffd639] bg-[#ffd639]/10" : "border-gray-200 bg-white"}`}
            >
              <input
                type="checkbox"
                checked={hasColors}
                onChange={(e) => setHasColors(e.target.checked)}
                className="w-4 h-4 text-[#313b2f] focus:ring-[#313b2f]"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  <FaPalette className="text-gray-400" /> Usa Cores?
                </span>
                <span className="text-[10px] text-gray-500">
                  Ativa a paleta
                </span>
              </div>
            </label>

            {/* ⚡ NOVO: Regra de Modelos */}
            <label
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${hasModels ? "border-[#ffd639] bg-[#ffd639]/10" : "border-gray-200 bg-white"}`}
            >
              <input
                type="checkbox"
                checked={hasModels}
                onChange={(e) => setHasModels(e.target.checked)}
                className="w-4 h-4 text-[#313b2f] focus:ring-[#313b2f]"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  <FaShapes className="text-gray-400" /> Exibir Modelos?
                </span>
                <span className="text-[10px] text-gray-500">
                  Ex: Nuvem, Montanha
                </span>
              </div>
            </label>
          </div>

          {/* Seleção de Paleta (Só aparece se a cor estiver ativada) */}
          {hasColors && (
            <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Qual paleta de cores essa categoria usa?
              </label>
              <select
                value={colorPalette}
                onChange={(e) => setColorPalette(e.target.value)}
                className="w-full md:w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ffd639] outline-none"
              >
                <option value="CAMA_COLORS">
                  Cores de Cama / Parede (Duplas)
                </option>
                <option value="LENCOL_COLORS">Cores de Lençol / Simples</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#313b2f] text-white font-bold rounded-xl hover:bg-[#ffd639] hover:text-[#313b2f] hover:-translate-y-1 shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Salvar Categoria"
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" /> {error}
        </div>
      )}
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
const AdminCategoryPage: React.FC = () => {
  const {
    categories,
    isLoading,
    error,
    fetchCategories,
    addCategory,
    deleteCategory,
  } = useCategoryStore();
  const { user } = useAuthStore();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const canManage = user?.role === "ADMIN" || user?.role === "DEV";
  if (!canManage) return <Navigate to="/dashboard" replace />;

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza? Isso pode afetar produtos vinculados.")) {
      setDeleteError(null);
      try {
        await deleteCategory(id);
      } catch (err: any) {
        setDeleteError(err.message);
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400 animate-pulse">
        <FaBoxOpen className="text-5xl mb-4 opacity-50" />
        <p>Carregando catálogo...</p>
      </div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 py-8 md:pt-24 pb-20 px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#313b2f]">
            <FaTag className="text-[#ffd639]" /> Categorias Dinâmicas
          </h1>
          <p className="text-gray-500 mt-1 ml-1">
            Configure as regras de produtos da sua loja.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 self-start">
          <FaBoxOpen /> {categories.length} Categorias
        </div>
      </header>

      <CategoryForm onAdd={addCategory} />

      <div>
        <h2 className="text-xl font-bold text-[#313b2f] mb-4 flex items-center gap-2">
          Lista Atual
        </h2>
        {(error || deleteError) && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm">
            <strong>Erro:</strong> {error || deleteError}
          </div>
        )}

        {/* TABELA DESKTOP */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
                <th className="p-5 w-20">ID</th>
                <th className="p-5">Nome</th>
                <th className="p-5">Regras (JSON)</th>
                <th className="p-5 text-center">Produtos</th>
                <th className="p-5 w-32 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((category) => {
                const config = (category.config as any) || {}; // Puxa o JSON
                return (
                  <tr
                    key={category.id}
                    className="hover:bg-yellow-50/30 transition-colors group"
                  >
                    <td className="p-5 text-gray-400 font-mono text-sm">
                      #{category.id}
                    </td>
                    <td className="p-5 font-bold text-[#313b2f]">
                      {category.name}
                    </td>
                    <td className="p-5">
                      <div className="flex gap-2 flex-wrap">
                        {config.showSizes && (
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100">
                            Tamanhos
                          </span>
                        )}
                        {config.showColors && (
                          <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-1 rounded border border-purple-100">
                            Cores (
                            {config.colorPalette === "CAMA_COLORS"
                              ? "Duplas"
                              : "Simples"}
                            )
                          </span>
                        )}
                        {config.showComplements && (
                          <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded border border-orange-100">
                            Extras
                          </span>
                        )}
                        {/* ⚡ AVISO NA TABELA SE TIVER MODELO */}
                        {config.showModels && (
                          <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded border border-green-100">
                            Modelos
                          </span>
                        )}
                        {!config.showSizes &&
                          !config.showColors &&
                          !config.showComplements &&
                          !config.showModels && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">
                              Sem Regras
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${(category as any)._count?.products > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}
                      >
                        {(category as any)._count?.products || 0} itens
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleDelete(category.id)}
                        title="Excluir"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryPage;
