import React, { useEffect } from "react";
import { useProductStore } from "../../store/ProductStore";
import { useAuthStore } from "../../store/AuthStore";
import { Navigate, Link } from "react-router-dom";
import {
  FaBox,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaImage,
  FaSearch,
} from "react-icons/fa";

const AdminProductsPage: React.FC = () => {
  const { products, isLoading, error, fetchProducts, deleteProduct } =
    useProductStore();
  const { user } = useAuthStore();

  const canManage =
    user &&
    (user.role === "ADMIN" || user.role === "DEV" || user.role === "SELLER");

  const canDelete = user && (user.role === "ADMIN" || user.role === "DEV");

  if (!canManage) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduct(id);
      } catch (err) {
        alert("Erro ao excluir produto.");
      }
    }
  };

  const formatPrice = (price?: number | string) => {
    // Se o preço não existir ou for inválido, retorna R$ 0,00 para não quebrar a tela
    if (price === undefined || price === null || isNaN(Number(price))) {
      return "R$ 0,00";
    }
    return Number(price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto  space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#313b2f]">
            <FaBox className="text-[#ffd639]" /> Produtos
          </h1>
          <p className="text-gray-500 mt-1 ml-1">
            Visualize, cadastre e gerencie o estoque da loja.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#313b2f] text-white font-bold rounded-xl hover:bg-gray-800 hover:-translate-y-1 shadow-lg shadow-gray-200 transition-all self-start md:self-center"
        >
          <FaPlus /> Novo Produto
        </Link>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* --- VERSÃO MOBILE (CARDS) --- */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4"
          >
            {/* Imagem */}
            <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <FaImage />
                </div>
              )}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-[#313b2f] text-sm truncate pr-2">
                  {product.name}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    product.stock > 5
                      ? "bg-green-50 text-green-700 border-green-100"
                      : product.stock > 0
                        ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                        : "bg-red-50 text-red-700 border-red-100"
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} un` : "Esgotado"}
                </span>
              </div>

              <p className="text-xs text-gray-400 font-mono mt-0.5">
                {product.sku}
              </p>
              <p className="font-bold text-[#313b2f] mt-2">
                {formatPrice(product.price)}
              </p>

              <div className="flex gap-2 mt-3 justify-end">
                <Link
                  to={`/admin/products/edit/${product.id}`}
                  className="p-2 bg-gray-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-gray-100"
                >
                  <FaEdit />
                </Link>
                {canDelete && (
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100"
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- VERSÃO DESKTOP (TABELA) --- */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
              <th className="p-5 w-16">Img</th>
              <th className="p-5">Nome / SKU</th>
              <th className="p-5">Categoria</th>
              <th className="p-5">Preço</th>
              <th className="p-5 text-center">Estoque</th>
              <th className="p-5 text-right w-32">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-yellow-50/30 transition-colors group"
              >
                <td className="p-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-5">
                  <div className="font-bold text-[#313b2f] text-sm">
                    {product.name}
                  </div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">
                    {product.sku}
                  </div>
                </td>
                <td className="p-5 text-sm text-gray-600">
                  {product.category?.name ? (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {product.category.name}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic text-xs">
                      Sem categoria
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#313b2f]">
                  {product.variants && product.variants.length > 0
                    ? formatPrice(product.variants[0].price)
                    : formatPrice(0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    {product.variants &&
                    product.variants.reduce(
                      (total, v) => total + (v.stock || 0),
                      0,
                    ) > 0 ? (
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    )}
                    {product.variants
                      ? product.variants.reduce(
                          (total, v) => total + (v.stock || 0),
                          0,
                        )
                      : 0}{" "}
                    un
                  </div>
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                      title="Editar"
                    >
                      <FaEdit />
                    </Link>
                    {canDelete && (
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        onClick={() => handleDelete(product.id)}
                        title="Excluir"
                      >
                        <FaTrashAlt />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mt-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <FaSearch className="text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-600">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-400 mb-6">
            Comece adicionando itens ao seu inventário.
          </p>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#313b2f] text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FaPlus /> Cadastrar Produto
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
