import React, { useEffect, useState, type FormEvent } from "react";
import { useCategoryStore } from "../../store/CategoryStore";
import { useAuthStore } from "../../store/AuthStore";
import { Navigate } from "react-router-dom";
import {
  FaTrashAlt,
  FaTag,
  FaSpinner,
  FaEdit,
  FaPlus,
  FaBoxOpen,
} from "react-icons/fa";

// --- COMPONENTE: FORMULÁRIO DE CRIAÇÃO ---
const CategoryForm: React.FC<{ onAdd: (data: any) => Promise<void> }> = ({
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gera slug automaticamente ao digitar o nome
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

    try {
      await onAdd({ name: name.trim(), slug: slug.trim() || undefined });
      setName("");
      setSlug("");
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
          <FaPlus className="text-xl text-[#313b2f]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#313b2f]">Nova Categoria</h3>
          <p className="text-xs text-gray-500">
            Adicione uma nova seção ao seu catálogo.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-5 items-start"
      >
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
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-[#313b2f] placeholder-gray-400"
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
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-mono text-sm text-gray-600 placeholder-gray-400"
            placeholder="Ex: camas-montessorianas"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto mt-auto mb-[2px] px-8 py-3 bg-[#313b2f] text-white font-bold rounded-xl hover:bg-gray-800 hover:-translate-y-1 shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2 h-[50px]"
        >
          {loading ? <FaSpinner className="animate-spin" /> : "Adicionar"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm flex items-center gap-2 animate-in fade-in">
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
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header da Página */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#313b2f]">
            <FaTag className="text-[#ffd639]" /> Categorias
          </h1>
          <p className="text-gray-500 mt-1 ml-1">
            Organize a estrutura do seu e-commerce.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 self-start">
          <FaBoxOpen /> {categories.length} Categorias
        </div>
      </header>

      {/* Formulário */}
      <CategoryForm onAdd={addCategory} />

      {/* Lista de Categorias */}
      <div>
        <h2 className="text-xl font-bold text-[#313b2f] mb-4 flex items-center gap-2">
          Lista Atual
        </h2>

        {(error || deleteError) && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm">
            <strong>Erro:</strong> {error || deleteError}
          </div>
        )}

        {/* --- VERSÃO DESKTOP (TABELA) --- */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
                <th className="p-5 w-20">ID</th>
                <th className="p-5">Nome</th>
                <th className="p-5">Slug</th>
                <th className="p-5 text-center">Produtos</th>
                <th className="p-5 w-32 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((category) => (
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
                  <td className="p-5 text-gray-500 font-mono text-sm bg-gray-50 rounded-lg inline-block my-2 px-2 py-1 mx-5">
                    {category.slug}
                  </td>
                  <td className="p-5 text-center">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${
                        (category._count?.products || 0) > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {category._count?.products || 0} itens
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                        // Implementar lógica de edição depois
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleDelete(category.id)}
                        title="Excluir"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- VERSÃO MOBILE (CARDS) --- */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-[#313b2f] text-lg">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-1">
                  {category.slug}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                  <FaBoxOpen /> {category._count?.products || 0} produtos
                </div>
              </div>
              <div className="flex flex-col gap-2 border-l border-gray-100 pl-4 ml-2">
                <button
                  className="p-2 bg-gray-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  title="Editar"
                >
                  <FaEdit />
                </button>
                <button
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  onClick={() => handleDelete(category.id)}
                  title="Excluir"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mt-4">
            <FaBoxOpen className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">
              Nenhuma categoria encontrada.
            </p>
            <p className="text-sm text-gray-400">
              Use o formulário acima para criar a primeira.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoryPage;
