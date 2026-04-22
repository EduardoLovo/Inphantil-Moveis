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
  FaTimes,
  FaExclamationCircle,
} from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";

// =========================================================
// 🎨 DADOS BRUTOS (Paletas e Ordens)
// =========================================================
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
    hexInterno: "#bfcab4",
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

const LENCOL_COLORS = [
  "AZ3",
  "AZUL BEBÊ",
  "BEGE",
  "BRANCO",
  "CINZA",
  "PALHA",
  "PRATA",
  "ROSA BEBÊ",
  "ROSA",
  "VERDE",
];

const SIZE_ORDER = [
  "BERÇO",
  "JUNIOR",
  "SOLTEIRO",
  "SOLTEIRAO",
  "VIUVA",
  "CASAL",
  "QUEEN",
  "KING",
];
const COMPLEMENT_ORDER = ["com colchão", "sem colchão"];

// =========================================================
// 🧠 CÉREBRO DA PÁGINA: Define as regras por Categoria
// =========================================================
const getCategoryConfig = (categoryName: string = "") => {
  const name = categoryName.toLowerCase();

  if (
    (name.includes("protetor") && !name.includes("parede")) ||
    name.includes("travesseiro")
  ) {
    return {
      showSizes: true,
      showColors: false,
      showComplements: false,
      showModels: false,
      colorPalette: [],
    };
  }
  if (name.includes("parede")) {
    return {
      showSizes: true,
      showColors: true,
      showComplements: true,
      showModels: true,
      colorPalette: CAMA_COLORS,
    };
  }
  if (name.includes("cama")) {
    return {
      showSizes: true,
      showColors: true,
      showComplements: true,
      showModels: false,
      colorPalette: CAMA_COLORS,
    };
  }
  if (name.includes("lençol") || name.includes("lencol")) {
    return {
      showSizes: true,
      showColors: true,
      showComplements: false,
      showModels: false,
      colorPalette: LENCOL_COLORS,
    };
  }

  return {
    showSizes: true,
    showColors: true,
    showComplements: false,
    showModels: false,
    colorPalette: [],
  };
};

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { getProductById, products, fetchProducts } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);

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
    if (products.length === 0) fetchProducts();
  }, [products.length, fetchProducts]);

  const config = useMemo(
    () => getCategoryConfig(product?.category?.name),
    [product?.category?.name],
  );

  const getModelAndExtra = (comp?: string) => {
    if (!comp) return { model: "", extra: "" };
    if (comp.includes(" | ")) {
      const parts = comp.split(" | ");
      return { model: parts[0].trim(), extra: parts[1].trim() };
    }
    if (config.showModels) return { model: comp.trim(), extra: "" };
    return { model: "", extra: comp.trim() };
  };

  // Parâmetros da URL
  const selectedSize = searchParams.get("size");
  const selectedModel = searchParams.get("model");
  const selectedExtra = searchParams.get("extra");
  const selectedColor = searchParams.get("color");

  // --- 1. FILTRO DE TAMANHOS ---
  const availableSizes = useMemo(() => {
    if (!product?.variants || !config.showSizes) return [];
    const uniqueSizes = Array.from(
      new Set(product.variants.map((v) => v.size).filter(Boolean)),
    );
    return uniqueSizes.sort((a, b) => {
      const indexA = SIZE_ORDER.indexOf(a.toUpperCase());
      const indexB = SIZE_ORDER.indexOf(b.toUpperCase());
      return (indexA !== -1 ? indexA : 999) - (indexB !== -1 ? indexB : 999);
    });
  }, [product?.variants, config.showSizes]);

  // --- 2. FILTRO DE MODELOS ---
  const availableModels = useMemo(() => {
    if (!product?.variants || !config.showModels) return [];
    // 👈 REMOVIDO: A dependência do Tamanho estar selecionado
    const uniqueModels = Array.from(
      new Set(
        product.variants
          .map((v) => getModelAndExtra(v.complement).model)
          .filter(Boolean),
      ),
    ) as string[];
    return uniqueModels.sort();
  }, [product?.variants, config.showModels]);

  // --- 3. FILTRO DE EXTRAS ---
  const availableExtras = useMemo(() => {
    if (!product?.variants || !config.showComplements) return [];
    // 👈 REMOVIDO: A dependência do Tamanho/Modelo estarem selecionados
    const uniqueExtras = Array.from(
      new Set(
        product.variants
          .map((v) => getModelAndExtra(v.complement).extra)
          .filter(Boolean),
      ),
    ) as string[];

    return uniqueExtras.sort((a, b) => {
      const indexA = COMPLEMENT_ORDER.indexOf(a.toLowerCase().trim());
      const indexB = COMPLEMENT_ORDER.indexOf(b.toLowerCase().trim());
      const posA = indexA !== -1 ? indexA : 999;
      const posB = indexB !== -1 ? indexB : 999;
      return posA === posB ? a.localeCompare(b) : posA - posB;
    });
  }, [product?.variants, config.showComplements]);

  // --- 4. FILTRO DE CORES ---
  const availableColors = useMemo(() => {
    if (!product?.variants || !config.showColors) return [];
    // 👈 REMOVIDO: A dependência dos outros estarem selecionados
    const uniqueColors = Array.from(
      new Set(product.variants.map((v) => v.color).filter(Boolean)),
    );
    return uniqueColors.sort((a, b) => a.localeCompare(b));
  }, [product?.variants, config.showColors]);

  // =========================================================
  // ⚡ AUTO-SELEÇÃO INTELIGENTE (Apenas Opções Únicas)
  // =========================================================
  useEffect(() => {
    const currentSize = searchParams.get("size");
    const currentModel = searchParams.get("model");
    const currentExtra = searchParams.get("extra");
    const currentColor = searchParams.get("color");

    let changed = false;
    const newParams = new URLSearchParams(searchParams);

    if (config.showSizes && availableSizes.length === 1 && !currentSize) {
      newParams.set("size", availableSizes[0]);
      changed = true;
    }
    if (config.showModels && availableModels.length === 1 && !currentModel) {
      newParams.set("model", availableModels[0]);
      changed = true;
    }
    if (
      config.showComplements &&
      availableExtras.length === 1 &&
      !currentExtra
    ) {
      newParams.set("extra", availableExtras[0]);
      changed = true;
    }
    if (config.showColors && availableColors.length === 1 && !currentColor) {
      newParams.set("color", availableColors[0]);
      changed = true;
    }

    if (!config.showModels && currentModel) {
      newParams.delete("model");
      changed = true;
    }
    if (!config.showComplements && currentExtra) {
      newParams.delete("extra");
      changed = true;
    }
    if (!config.showColors && currentColor) {
      newParams.delete("color");
      changed = true;
    }
    if (newParams.has("complement")) {
      newParams.delete("complement");
      changed = true;
    }

    if (changed) setSearchParams(newParams, { replace: true });
  }, [
    availableSizes,
    availableModels,
    availableExtras,
    availableColors,
    searchParams,
    setSearchParams,
    config,
  ]);

  // --- VARIAÇÃO ATIVA (Exige tudo selecionado) ---
  const activeVariant = useMemo(() => {
    if (!product?.variants) return undefined;
    return product.variants.find((v) => {
      const matchSize = config.showSizes ? v.size === selectedSize : true;
      const { model: vModel, extra: vExtra } = getModelAndExtra(v.complement);
      const matchModel = config.showModels ? vModel === selectedModel : true;
      const matchExtra = config.showComplements
        ? vExtra === selectedExtra
        : true;
      const matchColor = config.showColors ? v.color === selectedColor : true;
      return matchSize && matchModel && matchExtra && matchColor;
    });
  }, [
    product,
    selectedColor,
    selectedSize,
    selectedModel,
    selectedExtra,
    config,
  ]);

  // --- HANDLERS DOS CLICKS ---
  // 👈 REMOVIDO as linhas que apagavam as outras opções (prev.delete...)
  const handleSizeSelect = (size: string) => {
    setSearchParams((prev) => {
      prev.set("size", size);
      return prev;
    });
  };

  const handleModelSelect = (model: string) => {
    setSearchParams((prev) => {
      prev.set("model", model);
      return prev;
    });
  };

  const handleExtraSelect = (extra: string) => {
    setSearchParams((prev) => {
      prev.set("extra", extra);
      return prev;
    });
  };

  const handleColorSelect = (color: string) => {
    setSearchParams((prev) => {
      prev.set("color", color);
      return prev;
    });
  };

  useEffect(() => setCurrentImageIndex(0), [activeVariant]);

  // --- LÓGICA DE IMAGENS ---
  // 👉 AGORA USA A VARIAÇÃO ATIVA (A foto só muda quando escolher tudo)
  const displayImages = useMemo(() => {
    if (!product) return ["https://via.placeholder.com/400"];
    const images: string[] = [];
    if (activeVariant?.images && activeVariant.images.length > 0) {
      activeVariant.images.forEach((img) => {
        if (img.url && !images.includes(img.url)) images.push(img.url);
      });
    } else if (product.mainImage) {
      images.push(product.mainImage);
    }
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        if (img.url && !images.includes(img.url)) images.push(img.url);
      });
    }
    if (images.length === 0) images.push("https://via.placeholder.com/400");
    return images;
  }, [product, activeVariant]);

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
          to="/loja"
          className="flex items-center gap-2 px-6 py-3 bg-[#313b2f] text-white rounded-lg hover:bg-[#ffd639] transition-all font-bold"
        >
          <FaArrowLeft /> Voltar ao Catálogo
        </Link>
      </div>
    );

  const formatPrice = (price: number | string) =>
    Number(price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // 👉 PREÇO FINAL (Só exibe o exato se tiver activeVariant, senão mostra o preço base do produto)
  const displayPrice = activeVariant ? activeVariant.price : product.price;
  const currentStock = activeVariant ? activeVariant.stock : product.stock;

  const hasVariants = product.variants && product.variants.length > 0;
  const isFullySelected = hasVariants ? !!activeVariant : true;
  const isOutOfStock = isFullySelected && currentStock <= 0;
  const canPurchase = isFullySelected && !isOutOfStock;

  return (
    <div className="w-full mx-auto px-4 md:px-32 py-8 md:pt-32 pb-20">
      <Toaster />
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#ffd639] transition-colors p-2 z-[101]"
          >
            <FaTimes size={32} />
          </button>
          <img
            src={displayImages[currentImageIndex]}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

      <div className="mb-8">
        <Link
          to="/loja"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#313b2f] font-medium transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />{" "}
          Voltar para o catálogo
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
        {/* --- COLUNA ESQUERDA: GALERIA --- */}
        <div className="flex flex-col gap-4 h-fit lg:sticky lg:top-32 z-10 items-center justify-center">
          <div
            className="w-[80vw] md:w-[30vw] aspect-square relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center cursor-zoom-in"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={displayImages[currentImageIndex]}
              alt={product.name}
              className="w-full transition-transform duration-500 hover:scale-105"
            />
            {hasVariants && !isFullySelected && (
              <div className="absolute w-full md:w-[30vw] bg-[#ffd639]/20 border border-[#ffd639] text-[#313b2f] flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl shadow-sm animate-pulse">
                <FaExclamationCircle className="text-[#313b2f]" /> Conclua sua
                seleção abaixo
              </div>
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
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx ? "border-[#ffd639]" : "border-transparent opacity-70"}`}
                >
                  <img src={imgUrl} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- COLUNA DIREITA: INFORMAÇÕES E SELETORES --- */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              <FaTag className="text-[#ffd639]" />{" "}
              {product.category?.name || "Geral"}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#313b2f] mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="text-3xl font-bold text-[#313b2f] mb-6 flex items-baseline gap-2">
            <span className="text-green-700">
              {displayPrice
                ? `${formatPrice(displayPrice)}`
                : "Escolha todas opções para aparecer o valor"}
            </span>
          </div>

          {/* Seletores de Variantes Dinâmicos */}
          {hasVariants && (
            <div className="mb-8 space-y-6 border-b border-gray-100 pb-6">
              {/* 1. SELETOR DE TAMANHO */}
              {config.showSizes && availableSizes.length > 0 && (
                <div>
                  <span className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Tamanho: {selectedSize || "Selecione"}{" "}
                    {availableSizes.length === 1 && (
                      <span className="text-xs text-green-600 ml-2">
                        (Opção Única)
                      </span>
                    )}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`w-48 px-4 py-2 rounded-lg border-2 font-medium transition-all ${selectedSize === size ? "border-[#ffd639] bg-[#ffd639]/10 text-[#313b2f]" : "border-gray-200 text-gray-600 bg-white"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. SELETOR DE MODELOS (Ex: Montanha, Nuvem) */}
              {config.showModels && availableModels.length > 0 && (
                <div className="animate-in fade-in duration-300">
                  <span className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Modelo: {selectedModel || "Selecione"}{" "}
                    {availableModels.length === 1 && (
                      <span className="text-xs text-green-600 ml-2">
                        (Opção Única)
                      </span>
                    )}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableModels.map((model) => (
                      <button
                        key={model}
                        onClick={() => handleModelSelect(model)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${selectedModel === model ? "border-[#ffd639] bg-[#ffd639]/10 text-[#313b2f]" : "border-gray-200 text-gray-600 bg-white"}`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. SELETOR DE COMPLEMENTO / KIT */}
              {config.showComplements && availableExtras.length > 0 && (
                <div className="animate-in fade-in duration-300">
                  <span className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    {config.showModels ? "Kit / Opcional" : "Opção Extra"}:{" "}
                    {selectedExtra || "Selecione"}{" "}
                    {availableExtras.length === 1 && (
                      <span className="text-xs text-green-600 ml-2">
                        (Opção Única)
                      </span>
                    )}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableExtras.map((extra) => (
                      <button
                        key={extra}
                        onClick={() => handleExtraSelect(extra)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${selectedExtra === extra ? "border-[#ffd639] bg-[#ffd639]/10 text-[#313b2f]" : "border-gray-200 text-gray-600 bg-white"}`}
                      >
                        {extra}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. SELETOR DE COR */}
              {config.showColors && availableColors.length > 0 && (
                <div className="animate-in fade-in duration-300">
                  <span className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Cor: {selectedColor ? "" : "Selecione"}{" "}
                    {availableColors.length === 1 && (
                      <span className="text-xs text-green-600 ml-2">
                        (Opção Única)
                      </span>
                    )}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => {
                      const colorDef = CAMA_COLORS?.find(
                        (c: any) => c.id === color || c === color,
                      );
                      return (
                        <button
                          key={color}
                          onClick={() => handleColorSelect(color)}
                          className={`flex items-center w-56 gap-3 px-3 py-2 rounded-lg border-2 font-medium transition-all ${selectedColor === color ? "border-[#313b2f] bg-[#313b2f] text-white" : "border-gray-200 text-gray-600 bg-white"}`}
                        >
                          {colorDef?.hexExterno ? (
                            <>
                              <span
                                className="w-8 h-8 rounded-full border border-gray-400/30"
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

          {/* Botões de Ação */}
          <div className="mt-auto space-y-3">
            <button
              onClick={() => handleAddToCart(product, activeVariant)}
              disabled={!canPurchase}
              className="w-full py-4 bg-[#313b2f] text-white font-bold rounded-xl hover:bg-[#ffd639] hover:text-[#313b2f] shadow-lg transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50"
            >
              <FaCartPlus />{" "}
              {!isFullySelected
                ? "Selecione as Opções"
                : isOutOfStock
                  ? "Esgotado"
                  : "Adicionar ao Carrinho"}
            </button>
            <Link to="/cart" className="block w-full">
              <button className="w-full py-3 bg-white text-[#313b2f] border-2 border-[#313b2f] font-bold rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2">
                <CiShoppingCart size={24} /> Ir para o Carrinho
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="prose prose-sm text-gray-600 mb-8 p-6 mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#313b2f] mb-3">
          Detalhes do Produto
        </h3>
        <p className="whitespace-pre-wrap">
          {product.description || "Sem descrição disponível."}
        </p>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
