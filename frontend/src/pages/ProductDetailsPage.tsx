import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useProductStore } from "../store/ProductStore";
import { useCartStore } from "../store/CartStore";
import { type Product, type ProductVariant } from "../types/products";
import {
  FaCartPlus,
  FaArrowLeft,
  FaSpinner,
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaSearchPlus,
} from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";

// Lista de Cores
const CAMA_COLORS = [
  {
    id: "cz6-cz26",
    Externo: "CZ6",
    Interno: "CZ26",
    hexExterno: "#b4b7ba",
    hexInterno: "#cbcbcb",
  },
  {
    id: "cz6-vd25",
    Externo: "CZ6",
    Interno: "VD25",
    hexExterno: "#b4b7ba",
    hexInterno: "#bfc6c9",
  },
  {
    id: "cz6-r12",
    Externo: "CZ6",
    Interno: "R12",
    hexExterno: "#b4b7ba",
    hexInterno: "#e0c7d2",
  },
  {
    id: "cz6-az10",
    Externo: "CZ6",
    Interno: "AZ10",
    hexExterno: "#b4b7ba",
    hexInterno: "#9ebdd0",
  },
  {
    id: "cz6-l11",
    Externo: "CZ6",
    Interno: "L11",
    hexExterno: "#b4b7ba",
    hexInterno: "#d4c7d9",
  },
  {
    id: "cz6-am14",
    Externo: "CZ6",
    Interno: "AM14",
    hexExterno: "#b4b7ba",
    hexInterno: "#f4e0ad",
  },
  {
    id: "b6-b8",
    Externo: "B6",
    Interno: "B8",
    hexExterno: "#c4bcad",
    hexInterno: "#dad6cb",
  },
  {
    id: "b6-vd25",
    Externo: "B6",
    Interno: "VD25",
    hexExterno: "#c4bcad",
    hexInterno: "#bfcab4",
  },
  {
    id: "b6-r12",
    Externo: "B6",
    Interno: "R12",
    hexExterno: "#c4bcad",
    hexInterno: "#e0c7d2",
  },
  {
    id: "b6-az10",
    Externo: "B6",
    Interno: "AZ10",
    hexExterno: "#c4bcad",
    hexInterno: "#9ebdd0",
  },
  {
    id: "b6-l11",
    Externo: "B6",
    Interno: "L11",
    hexExterno: "#c4bcad",
    hexInterno: "#d4c7d9",
  },
  {
    id: "b6-am14",
    Externo: "B6",
    Interno: "AM14",
    hexExterno: "#c4bcad",
    hexInterno: "#f4e0ad",
  },
];

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { getProductById, products, fetchProducts } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Estados da Galeria e do Modal
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getProductById(Number(id));
      setProduct(data);
      setLoading(false);
    };
    loadProduct();
  }, [id, getProductById]);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  // --- PARÂMETROS DA URL ---
  const selectedColor = searchParams.get("color");
  const selectedSize = searchParams.get("size");
  const selectedComplement = searchParams.get("complement");

  // --- FILTROS DE DISPONIBILIDADE ---
  const availableSizes = useMemo(() => {
    if (!product?.variants) return [];
    return Array.from(
      new Set(product.variants.map((v) => v.size).filter(Boolean)),
    );
  }, [product?.variants]);

  // 2. Puxa as opções extras baseadas no TAMANHO escolhido
  const availableComplements = useMemo(() => {
    if (!product?.variants || !selectedSize) return [];
    return Array.from(
      new Set(
        product.variants
          .filter((v) => v.size === selectedSize)
          .map((v) => v.complement)
          .filter(Boolean),
      ),
    );
  }, [product?.variants, selectedSize]);

  // 3. Puxa as cores baseadas no TAMANHO e COMPLEMENTO escolhidos
  const availableColors = useMemo(() => {
    if (!product?.variants || !selectedSize) return [];
    return Array.from(
      new Set(
        product.variants
          .filter((v) => {
            const matchSize = v.size === selectedSize;
            // Se existem complementos (ex: colchão), só mostra as cores daquele complemento
            const matchComplement =
              availableComplements.length > 0
                ? v.complement === selectedComplement
                : true;
            return matchSize && matchComplement;
          })
          .map((v) => v.color)
          .filter(Boolean),
      ),
    );
  }, [
    product?.variants,
    selectedSize,
    selectedComplement,
    availableComplements,
  ]);

  const activeVariant = useMemo(() => {
    if (!product?.variants) return undefined;
    return product.variants.find((v) => {
      const matchColor = v.color === selectedColor;
      const matchSize = v.size === selectedSize;
      const matchComplement =
        availableComplements.length > 0
          ? v.complement === selectedComplement
          : true;

      return matchColor && matchSize && matchComplement;
    });
  }, [
    product?.variants,
    selectedColor,
    selectedSize,
    selectedComplement,
    availableComplements,
  ]);

  const handleSizeSelect = (size: string) => {
    setSearchParams((prev) => {
      prev.set("size", size);
      // Removemos o prev.delete("complement") e prev.delete("color")
      return prev;
    });
  };

  const handleComplementSelect = (complement: string) => {
    setSearchParams((prev) => {
      prev.set("complement", complement);
      // Removemos o prev.delete("color")
      return prev;
    });
  };

  const handleColorSelect = (color: string) => {
    setSearchParams((prev) => {
      prev.set("color", color);
      return prev;
    });
  };

  // Sempre que a variante mudar, reseta o carrossel
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeVariant]);

  // --- LÓGICA DE IMAGENS & CARROSSEL ---
  const displayImages = useMemo(() => {
    if (!product) return ["https://via.placeholder.com/400"];

    const images: string[] = [];

    if (activeVariant?.images && activeVariant.images.length > 0) {
      activeVariant.images.forEach((img) => {
        if (img.url && !images.includes(img.url)) {
          images.push(img.url);
        }
      });
    } else if ((activeVariant as any)?.imageUrl) {
      images.push((activeVariant as any).imageUrl);
    } else if (product.mainImage) {
      images.push(product.mainImage);
    }

    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        if (img.url && !images.includes(img.url)) {
          images.push(img.url);
        }
      });
    }

    if (images.length === 0) {
      images.push("https://via.placeholder.com/400");
    }

    return images;
  }, [product, activeVariant]);

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1,
    );
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1,
    );
  };

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

  const handleAddToCart = (
    productToAdd: Product,
    variantToAdd?: ProductVariant,
  ) => {
    addItem(productToAdd, variantToAdd);
    toast.success(`${productToAdd.name} adicionado ao carrinho!`, {
      position: "bottom-right",
      style: {
        background: "#313b2f",
        color: "#fff",
        border: "1px solid #ffd639",
      },
      iconTheme: { primary: "#ffd639", secondary: "#313b2f" },
    });
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

  const formatPrice = (price: number | string) => {
    return Number(price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const displayPrice = activeVariant ? activeVariant.price : product.price;
  const currentStock = activeVariant ? activeVariant.stock : product.stock;

  const hasVariants = product.variants && product.variants.length > 0;
  const isFullySelected = hasVariants ? !!activeVariant : true;
  const isOutOfStock = isFullySelected && currentStock <= 0;
  const canPurchase = isFullySelected && !isOutOfStock;

  console.log(product);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8 md:pt-32 pb-20">
      <Toaster />

      {/* MODAL DE IMAGEM EM TELA CHEIA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#ffd639] transition-colors p-2 z-[101]"
          >
            <FaTimes size={32} />
          </button>

          {displayImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white hover:text-[#ffd639] transition-colors p-4 z-[101]"
              >
                <FaChevronLeft size={40} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white hover:text-[#ffd639] transition-colors p-4 z-[101]"
              >
                <FaChevronRight size={40} />
              </button>
            </>
          )}
          <img
            src={displayImages[currentImageIndex]}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

      <div className="mb-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#313b2f] font-medium transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Voltar para o catálogo
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
        {/* --- COLUNA ESQUERDA: GALERIA --- */}
        <div className="flex flex-col gap-4 h-fit lg:sticky lg:top-32 z-10">
          <div
            className="w-full aspect-square relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center group cursor-zoom-in"
            onClick={() => setIsModalOpen(true)}
            title="Clique para ampliar"
          >
            <img
              src={displayImages[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/90 p-3 rounded-full shadow-lg text-[#313b2f] transform translate-y-4 group-hover:translate-y-0 transition-all">
                <FaSearchPlus size={24} />
              </div>
            </div>

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-md text-[#313b2f] hover:bg-[#ffd639] transition-all z-20 opacity-0 group-hover:opacity-100"
                >
                  <FaChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-md text-[#313b2f] hover:bg-[#ffd639] transition-all z-20 opacity-0 group-hover:opacity-100"
                >
                  <FaChevronRight size={16} />
                </button>
              </>
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-30 pointer-events-none">
                <span className="bg-red-500 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg transform -rotate-12">
                  Esgotado
                </span>
              </div>
            )}
          </div>

          {displayImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {displayImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === idx
                      ? "border-[#ffd639] ring-2 ring-[#ffd639]/30"
                      : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- COLUNA DIREITA: INFORMAÇÕES --- */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              <FaTag className="text-[#ffd639]" />
              {product.category?.name || "Geral"}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#313b2f] mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="text-3xl font-bold text-[#313b2f] mb-6 flex items-baseline gap-2">
            {hasVariants && !activeVariant ? (
              <span className="text-lg text-gray-500 font-medium">
                Selecione tamanho, opção extra e cor para ver o preço
              </span>
            ) : (
              formatPrice(displayPrice)
            )}
          </div>

          {/* Seletores de Variantes Organizados */}
          {hasVariants && (
            <div className="mb-8 space-y-6 border-b border-gray-100 pb-6">
              {/* 1. SELETOR DE TAMANHO */}
              {availableSizes.length > 0 && (
                <div>
                  <span className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Tamanho: {selectedSize || "Selecione"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                          selectedSize === size
                            ? "border-[#ffd639] bg-[#ffd639]/10 text-[#313b2f]"
                            : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. SELETOR DE OPÇÃO EXTRA (COLCHÃO) */}
              {selectedSize && availableComplements.length > 0 && (
                <div className="animate-in fade-in duration-300">
                  <span className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Opção Extra: {selectedComplement || "Selecione"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableComplements.map((comp) => (
                      <button
                        key={comp as string}
                        onClick={() => handleComplementSelect(comp as string)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                          selectedComplement === comp
                            ? "border-[#ffd639] bg-[#ffd639]/10 text-[#313b2f] shadow-sm"
                            : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. SELETOR DE COR */}
              {/* Só mostra as cores se o tamanho estiver escolhido E (não houver colchão OU o colchão já estiver escolhido) */}
              {selectedSize &&
                (availableComplements.length === 0 || selectedComplement) &&
                availableColors.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <span className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Cor: {selectedColor ? "" : "Selecione"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color) => {
                        const colorDef = CAMA_COLORS.find(
                          (c) => c.id === color,
                        );
                        return (
                          <button
                            key={color}
                            onClick={() => handleColorSelect(color)}
                            className={`flex items-center justify-start text-left gap-3 px-3 py-2 rounded-lg border-2 font-medium transition-all min-w-[210px] w-full sm:w-auto ${
                              selectedColor === color
                                ? "border-[#313b2f] bg-[#313b2f] text-white shadow-md"
                                : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                            }`}
                          >
                            {colorDef ? (
                              <>
                                <span
                                  className="w-8 h-8 rounded-full block shrink-0 border border-gray-400/30"
                                  style={{
                                    background: `linear-gradient(to bottom, ${colorDef.hexExterno} 50%, ${colorDef.hexInterno} 50%)`,
                                  }}
                                ></span>
                                <span className="text-sm">
                                  Ext: {colorDef.Externo} / Int:{" "}
                                  {colorDef.Interno}
                                </span>
                              </>
                            ) : (
                              <span>{color}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Disponibilidade Inteligente */}
          <div className="grid grid-cols-2 gap-4 mb-8 mt-4">
            {!hasVariants && product.size && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="block text-xs text-gray-400 font-bold uppercase">
                  Tamanho
                </span>
                <span className="font-medium text-[#313b2f]">
                  {product.size}
                </span>
              </div>
            )}
            {!hasVariants && product.color && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="block text-xs text-gray-400 font-bold uppercase">
                  Cor
                </span>
                <span className="font-medium text-[#313b2f]">
                  {product.color}
                </span>
              </div>
            )}

            {!isFullySelected ? (
              <div className="p-3 rounded-lg border bg-blue-50 border-blue-100">
                <span className="block text-xs font-bold uppercase opacity-70">
                  Disponibilidade
                </span>
                <div className="flex items-center gap-2 font-bold text-blue-800">
                  Selecione as opções
                </div>
              </div>
            ) : isOutOfStock ? (
              <div className="p-3 rounded-lg border bg-red-50 border-red-100">
                <span className="block text-xs font-bold uppercase opacity-70">
                  Disponibilidade
                </span>
                <div className="flex items-center gap-2 font-bold text-red-800">
                  <FaTimesCircle /> Esgotado
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg border bg-green-50 border-green-100">
                <span className="block text-xs font-bold uppercase opacity-70">
                  Disponibilidade
                </span>
                <div className="flex items-center gap-2 font-bold text-green-800">
                  <FaCheckCircle /> {currentStock} em estoque
                </div>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="mt-auto space-y-3">
            <button
              onClick={() => handleAddToCart(product, activeVariant)}
              disabled={!canPurchase}
              className="w-full py-4 bg-[#313b2f] text-white font-bold rounded-xl hover:bg-[#ffd639] hover:text-[#313b2f] hover:-translate-y-1 shadow-lg shadow-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 text-lg"
            >
              <FaCartPlus />
              {!isFullySelected
                ? "Selecione as Opções"
                : isOutOfStock
                  ? "Esgotado"
                  : "Adicionar ao Carrinho"}
            </button>

            <Link to="/cart" className="block w-full">
              <button className="w-full py-3 bg-white text-[#313b2f] border-2 border-[#313b2f] font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <CiShoppingCart size={24} /> Ir para o Carrinho
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="prose prose-sm text-gray-600 mb-8 border-b border-gray-100 p-6 mt-6 bg-white rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-[#313b2f] mb-3">
          Detalhes do Produto
        </h3>
        <p className="whitespace-pre-wrap">
          {product.description ||
            "Sem descrição disponível para este item no momento."}
        </p>
      </div>

      {/* Produtos Relacionados */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-[#313b2f] mb-8 ">
            Produtos Relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <div
                key={related.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all flex flex-col"
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
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      onClick={() => handleAddToCart(related)}
                      className="w-full py-2 bg-white/90 backdrop-blur-sm text-[#313b2f] font-bold text-sm rounded-lg shadow-lg hover:bg-[#ffd639]"
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
