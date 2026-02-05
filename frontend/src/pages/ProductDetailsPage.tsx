import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductStore } from "../store/ProductStore";
import { useCartStore } from "../store/CartStore";
import { type Product } from "../types/products";
import {
  FaCartPlus,
  FaArrowLeft,
  FaSpinner,
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, products, fetchProducts } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setLoading(true);

      const data = await getProductById(Number(id));
      setProduct(data);

      if (data?.mainImage) {
        setSelectedImage(data.mainImage);
      } else if (data?.images && data.images.length > 0) {
        setSelectedImage(data.images[0].url);
      }
      setLoading(false);
    };
    loadProduct();
  }, [id, getProductById]);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const relatedProducts = product
    ? products
        .filter(
          (p) => p.categoryId === product.categoryId && p.id !== product.id,
        )
        .slice(0, 4)
    : [];

  const handleRelatedClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <h1 className="text-xl font-bold text-[#313b2f]">
          Carregando detalhes...
        </h1>
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-[#313b2f] mb-4">
          Produto não encontrado
        </h2>
        <Link
          to="/products"
          className="flex items-center gap-2 px-6 py-3 bg-[#313b2f] text-white rounded-lg hover:bg-[#ffd639] hover:text-[#313b2f] transition-all font-bold"
        >
          <FaArrowLeft /> Voltar ao Catálogo
        </Link>
      </div>
    );

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

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

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8 md:pt-32 pb-20">
      <Toaster />

      {/* Breadcrumb / Back Link */}
      <div className="mb-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#313b2f] font-medium transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Voltar para o catálogo
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        {/* --- COLUNA ESQUERDA: GALERIA --- */}
        <div className="space-y-4">
          {/* Imagem Principal */}
          <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center relative group">
            <img
              src={selectedImage || "https://via.placeholder.com/400"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                <span className="bg-red-500 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg transform -rotate-12">
                  ESGOTADO
                </span>
              </div>
            )}
          </div>

          {/* Miniaturas */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {product.mainImage && (
              <button
                onClick={() => setSelectedImage(product.mainImage!)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === product.mainImage
                    ? "border-[#ffd639] ring-2 ring-[#ffd639]/30"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={product.mainImage}
                  alt="Principal"
                  className="w-full h-full object-cover"
                />
              </button>
            )}
            {product.images?.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.url)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === img.url
                    ? "border-[#ffd639] ring-2 ring-[#ffd639]/30"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={img.url}
                  alt="Detalhe"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* --- COLUNA DIREITA: INFORMAÇÕES --- */}
        <div className="flex flex-col">
          {/* Categoria */}
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              <FaTag className="text-[#ffd639]" />
              {product.category?.name || "Geral"}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#313b2f] mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Preço */}
          <div className="text-3xl font-bold text-[#313b2f] mb-6 flex items-baseline gap-2">
            {formatPrice(product.price)}
            <span className="text-sm font-normal text-gray-400 line-through hidden">
              {formatPrice(product.price * 1.2)}
            </span>
          </div>

          {/* Descrição */}
          <div className="prose prose-sm text-gray-600 mb-8 border-b border-gray-100 pb-6">
            <p>
              {product.description ||
                "Sem descrição disponível para este item no momento."}
            </p>
          </div>

          {/* Especificações */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {product.size && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="block text-xs text-gray-400 font-bold uppercase">
                  Tamanho
                </span>
                <span className="font-medium text-[#313b2f]">
                  {product.size}
                </span>
              </div>
            )}
            {product.color && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="block text-xs text-gray-400 font-bold uppercase">
                  Cor
                </span>
                <span className="font-medium text-[#313b2f]">
                  {product.color}
                </span>
              </div>
            )}
            <div
              className={`p-3 rounded-lg border ${product.stock > 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}
            >
              <span className="block text-xs font-bold uppercase opacity-70">
                Disponibilidade
              </span>
              <div className="flex items-center gap-2 font-bold">
                {product.stock > 0 ? (
                  <>
                    <FaCheckCircle className="text-green-600" />
                    <span className="text-green-800">
                      {product.stock} em estoque
                    </span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="text-red-600" />
                    <span className="text-red-800">Esgotado</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="mt-auto space-y-3">
            <button
              onClick={() => handleAddToCart(product)}
              disabled={!product.isAvailable || product.stock <= 0}
              className="w-full py-4 bg-[#313b2f] text-white font-bold rounded-xl hover:bg-[#ffd639] hover:text-[#313b2f] hover:-translate-y-1 shadow-lg shadow-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none text-lg"
            >
              <FaCartPlus />
              {product.stock > 0 ? "Adicionar ao Carrinho" : "Indisponível"}
            </button>

            <Link to="/cart" className="block w-full">
              <button className="w-full py-3 bg-white text-[#313b2f] border-2 border-[#313b2f] font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <CiShoppingCart size={24} /> Ir para o Carrinho
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* --- PRODUTOS RELACIONADOS --- */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-[#313b2f] mb-8 font-[Poppins]">
            Produtos Relacionados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <div
                key={related.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Link
                    to={`/products/${related.id}`}
                    onClick={handleRelatedClick}
                    className="block w-full h-full"
                  >
                    <img
                      src={
                        related.mainImage || "https://via.placeholder.com/200"
                      }
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>
                  {/* Quick Add Overlay (Opcional, apenas visual por enquanto) */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      onClick={() => handleAddToCart(related)}
                      className="w-full py-2 bg-white/90 backdrop-blur-sm text-[#313b2f] font-bold text-sm rounded-lg shadow-lg hover:bg-[#ffd639] transition-colors"
                    >
                      Adicionar Rápido
                    </button>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <Link
                    to={`/products/${related.id}`}
                    onClick={handleRelatedClick}
                    className="font-bold text-[#313b2f] hover:text-[#ffd639] transition-colors mb-2 line-clamp-2"
                  >
                    {related.name}
                  </Link>
                  <div className="mt-auto pt-2">
                    <span className="font-bold text-lg text-[#313b2f]">
                      {formatPrice(related.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
