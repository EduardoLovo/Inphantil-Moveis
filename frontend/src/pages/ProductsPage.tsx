import { useEffect } from "react";
import { useProductStore } from "../store/ProductStore";
import { useAuthStore } from "../store/AuthStore";
import { useCartStore } from "../store/CartStore";
import { Link } from "react-router-dom";
import {
  FaCartPlus,
  FaBoxOpen,
  FaSpinner,
  FaEdit,
  FaTag,
  FaExclamationCircle,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const ProductsPage = () => {
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success(`${product.name} adicionado ao carrinho!`, {
      position: "bottom-right",
      style: {
        background: "#313b2f",
        color: "#fff",
        border: "1px solid #ffd639",
      },
      iconTheme: {
        primary: "#ffd639",
        secondary: "#313b2f",
      },
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const canEdit = user && (user.role === "ADMIN" || user.role === "DEV");

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <h1 className="text-xl font-bold text-[#313b2f]">
          Carregando Catálogo...
        </h1>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 mt-20 text-center">
        <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-xl inline-block shadow-sm">
          <FaExclamationCircle className="text-3xl mb-2 mx-auto" />
          <h1 className="text-lg font-bold">Erro ao carregar produtos</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8 md:pt-32 pb-20">
      <Toaster />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-10 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#313b2f] flex items-center gap-3">
            <FaBoxOpen className="text-[#ffd639]" /> Catálogo de Produtos
          </h1>
          <p className="text-gray-500 mt-2">
            Explore nossa coleção exclusiva para o quarto do seu bebê.
          </p>
        </div>

        {user && (
          <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">
            Olá, <span className="font-bold text-[#313b2f]">{user.name}</span>.
            Acesso:{" "}
            <span className="uppercase text-xs font-bold bg-gray-200 px-2 py-0.5 rounded ml-1">
              {user.role}
            </span>
          </div>
        )}
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full"
          >
            {/* Imagem */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <Link
                to={`/products/${product.id}`}
                className="block w-full h-full"
              >
                {product.mainImage ? (
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <FaBoxOpen className="text-4xl" />
                  </div>
                )}
              </Link>

              {/* Badge de Esgotado */}
              {(!product.isAvailable || product.stock <= 0) && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg transform -rotate-12">
                    ESGOTADO
                  </span>
                </div>
              )}

              {/* Badge de Categoria */}
              {product.category && (
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#313b2f] text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <FaTag className="text-[#ffd639]" /> {product.category.name}
                </span>
              )}
            </div>

            {/* Conteúdo */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex-1">
                <Link
                  to={`/products/${product.id}`}
                  className="hover:text-[#ffd639] transition-colors"
                >
                  <h3 className="font-bold text-lg text-[#313b2f] mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex justify-between items-center mt-3">
                  <p className="text-2xl font-bold text-[#313b2f]">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Restam: {product.stock}
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="mt-5 space-y-3">
                <button
                  className="w-full py-3 bg-[#313b2f] text-white font-bold rounded-xl hover:bg-[#ffd639] hover:text-[#313b2f] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 shadow-md hover:shadow-lg hover:-translate-y-1"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.isAvailable || product.stock <= 0}
                >
                  {!product.isAvailable || product.stock <= 0 ? (
                    "Indisponível"
                  ) : (
                    <>
                      <FaCartPlus /> Adicionar
                    </>
                  )}
                </button>

                {canEdit && (
                  <Link
                    to={`/admin/products/edit/${product.id}`}
                    className="w-full py-2 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FaEdit /> Editar Produto
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mt-8">
          <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-500">
            Nenhum produto cadastrado no momento.
          </h3>
          <p className="text-gray-400">Volte em breve para novidades!</p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
