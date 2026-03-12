import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../../store/ProductStore";
import { useCategoryStore } from "../../store/CategoryStore";
import {
  FaSave,
  FaArrowLeft,
  FaTrash,
  FaPlus,
  FaImage,
  FaBoxOpen,
  FaTag,
  FaDollarSign,
  FaLayerGroup,
  FaSpinner,
  FaPalette,
  FaRuler,
  FaBarcode,
  FaStar,
  FaPlusCircle,
  FaMagic,
  FaCheckDouble,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import FullScreenLoader from "../../components/FullScreenLoader";

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

const ITEM_SIZES = [
  "BERÇO",
  "JUNIOR",
  "SOLTEIRO",
  "SOLTEIRAO",
  "VIUVA",
  "CASAL",
  "QUEEN",
  "KING",
];

interface VariantForm {
  id: string;
  color: string;
  size: string;
  complement: string;
  price: string;
  stock: string;
  sku: string;
  imageUrls: string[];
  isFeatured: boolean;
}

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, updateProduct, isLoading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [variants, setVariants] = useState<VariantForm[]>([]);

  // Estados do Gerador em Lote (Batch)
  const [batchSize, setBatchSize] = useState("");
  const [batchComplement, setBatchComplement] = useState("");
  const [batchPrice, setBatchPrice] = useState("");
  const [batchStock, setBatchStock] = useState("10");
  const [batchColors, setBatchColors] = useState<string[]>([]);

  // 1. Carregar Categorias e Produto Inicial
  useEffect(() => {
    fetchCategories();
    if (id) {
      loadProductData(Number(id));
    }
  }, [id, fetchCategories]);

  const loadProductData = async (productId: number) => {
    setLoadingInitial(true);
    const data = await getProductById(productId);

    if (data) {
      setName(data.name || "");
      setDescription(data.description || "");
      setCategoryId(data.categoryId ? data.categoryId.toString() : "");
      setMainImage(data.mainImage || "");

      // Monta as variações que vieram do banco
      if (data.variants && data.variants.length > 0) {
        const loadedVariants = data.variants.map((v: any) => ({
          id: v.id.toString(), // ID real do banco
          color: v.color || "",
          size: v.size || "",
          complement: v.complement || "",
          price: v.price
            ? Number(v.price).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "",
          stock: v.stock?.toString() || "0",
          sku: v.sku || "",
          imageUrls:
            v.images && v.images.length > 0
              ? v.images.map((img: any) => img.url)
              : v.imageUrl
                ? [v.imageUrl]
                : [""],
          isFeatured: v.isFeatured || false,
        }));
        setVariants(loadedVariants);
      } else {
        setVariants([
          {
            id: Math.random().toString(),
            color: "",
            size: "",
            complement: "",
            price: data.price?.toString() || "",
            stock: data.stock?.toString() || "0",
            sku: data.sku || "",
            imageUrls: [""],
            isFeatured: false,
          },
        ]);
      }
    }
    setLoadingInitial(false);
  };

  const selectedCategoryObj = categories.find(
    (c) => c.id.toString() === categoryId,
  );
  const categoryName = selectedCategoryObj
    ? selectedCategoryObj.name.toLowerCase()
    : "";

  const isCama = categoryName.includes("cama");
  const isLencol =
    categoryName.includes("lençol") || categoryName.includes("lencol");
  const isProtetor = categoryName.includes("protetor");
  const isColorRequired = !isProtetor;

  // --- LÓGICA DO GERADOR EM LOTE ---
  const toggleBatchColor = (colorId: string) => {
    setBatchColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((c) => c !== colorId)
        : [...prev, colorId],
    );
  };

  const handleSelectAllColors = () => {
    const allColors = isCama
      ? CAMA_COLORS.map((c) => c.id)
      : isLencol
        ? LENCOL_COLORS
        : [];
    if (batchColors.length === allColors.length) {
      setBatchColors([]);
    } else {
      setBatchColors(allColors);
    }
  };

  const handleGenerateBatch = () => {
    if (!batchSize || !batchPrice || !batchStock || batchColors.length === 0) {
      toast.error(
        "Preencha Tamanho, Preço, Estoque e selecione pelo menos 1 Cor!",
      );
      return;
    }

    const newVariants: VariantForm[] = batchColors.map((color) => ({
      id: Math.random().toString(), // ID com ponto para o NestJS saber que é nova
      color: color,
      size: batchSize,
      complement: batchComplement,
      price: batchPrice,
      stock: batchStock,
      sku: "",
      imageUrls: [""],
      isFeatured: false,
    }));

    setVariants((prev) => {
      // Se houver apenas uma variação e ela estiver totalmente em branco, nós a substituímos
      if (
        prev.length === 1 &&
        !prev[0].color &&
        !prev[0].size &&
        !prev[0].price &&
        prev[0].id.includes(".")
      ) {
        return newVariants;
      }
      // Caso contrário, adicionamos as novas à lista existente
      return [...prev, ...newVariants];
    });

    toast.success(
      `${newVariants.length} novas variações adicionadas à lista!`,
      {
        icon: "🪄",
      },
    );
    setBatchColors([]);
  };
  // ---------------------------------

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        id: Math.random().toString(),
        color: "",
        size: "",
        complement: "",
        price: "",
        stock: "",
        sku: "",
        imageUrls: [""],
        isFeatured: false,
      },
    ]);
  };

  const handleRemoveVariant = (variantId: string) => {
    if (variants.length === 1) {
      toast.error("O produto precisa ter pelo menos uma variação.");
      return;
    }
    setVariants(variants.filter((v) => v.id !== variantId));
  };

  const handleVariantChange = (
    variantId: string,
    field: keyof VariantForm,
    value: string | boolean,
  ) => {
    setVariants(
      variants.map((v) => (v.id === variantId ? { ...v, [field]: value } : v)),
    );
  };

  const handleVariantImageChange = (
    variantId: string,
    imageIndex: number,
    value: string,
  ) => {
    setVariants(
      variants.map((v) => {
        if (v.id === variantId) {
          const newUrls = [...v.imageUrls];
          newUrls[imageIndex] = value;
          return { ...v, imageUrls: newUrls };
        }
        return v;
      }),
    );
  };

  const handleAddVariantImage = (variantId: string) => {
    setVariants(
      variants.map((v) => {
        if (v.id === variantId) {
          return { ...v, imageUrls: [...v.imageUrls, ""] };
        }
        return v;
      }),
    );
  };

  const handleRemoveVariantImage = (variantId: string, imageIndex: number) => {
    setVariants(
      variants.map((v) => {
        if (v.id === variantId) {
          const newUrls = v.imageUrls.filter((_, idx) => idx !== imageIndex);
          return { ...v, imageUrls: newUrls };
        }
        return v;
      }),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error("Por favor, selecione uma categoria.");
      return;
    }

    if (variants.length === 0) {
      toast.error("Adicione pelo menos uma variação.");
      return;
    }

    const invalidVariant = variants.find(
      (v) => (isColorRequired && !v.color) || !v.size || !v.price || !v.stock,
    );

    if (invalidVariant) {
      toast.error("Preencha todos os campos obrigatórios das variações.");
      return;
    }

    const basePrice = Math.min(...variants.map((v) => parseCurrency(v.price)));
    const totalStock = variants.reduce(
      (sum, v) => sum + (parseInt(v.stock) || 0),
      0,
    );

    const productData = {
      name,
      description,
      categoryId: parseInt(categoryId),
      mainImage,
      price: basePrice,
      stock: totalStock,
      variants: variants.map((v) => ({
        id: v.id.includes(".") ? undefined : parseInt(v.id),
        color: isColorRequired ? v.color : "Cor Única",
        size: v.size,
        complement: v.complement.trim() !== "" ? v.complement : undefined,
        price: parseCurrency(v.price),
        stock: parseInt(v.stock),
        sku: v.sku || undefined,
        isFeatured: v.isFeatured,
        images: v.imageUrls
          .filter((url) => url.trim() !== "")
          .map((url) => ({ url })),
      })),
    };

    try {
      await updateProduct(Number(id), productData);
      toast.success("Produto atualizado com sucesso!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message;
      const msg = Array.isArray(errorMessage)
        ? errorMessage[0]
        : errorMessage || "Erro ao atualizar produto.";
      toast.error(`Erro: ${msg}`);
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <h1 className="text-xl font-bold text-[#313b2f]">
          Carregando produto...
        </h1>
      </div>
    );
  }

  // 1. Transforma o que o utilizador digita na máscara visual (ex: 1.200,50)
  const formatCurrencyInput = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, ""); // Remove tudo o que não for número
    if (!onlyNumbers) return "";
    return (Number(onlyNumbers) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // 2. Transforma a máscara visual de volta num número para o Backend (ex: 1200.50)
  const parseCurrency = (value: string) => {
    if (!value) return 0;
    // Remove os pontos de milhar e troca a vírgula por ponto
    const cleanString = value.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleanString) || 0;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 pt-24 pb-20">
      <Toaster />
      <FullScreenLoader
        isLoading={isLoading}
        title="A guardar alterações..."
        message={
          <>
            A atualizar o catálogo e as variações do produto.
            <br />
            <span className="font-bold text-[#ffd639]">
              Por favor, aguarde.
            </span>
          </>
        }
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#313b2f] flex items-center gap-3">
            <FaBoxOpen className="text-[#ffd639]" /> Editar Produto
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Modifique as informações e adicione novas variações rapidamente.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold shadow-sm"
        >
          <FaArrowLeft /> Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* INFORMAÇÕES BÁSICAS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#313b2f] mb-4 flex items-center gap-2 pb-2 border-b border-gray-50">
            <FaTag className="text-gray-400" /> Informações Básicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Nome do Produto
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Descrição Detalhada
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none resize-y"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                URL da Imagem Principal
              </label>
              <input
                type="text"
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none bg-white"
              >
                <option value="">Selecione uma categoria...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* GERADOR MÁGICO DE VARIAÇÕES */}
        {categoryId && isColorRequired && (
          <div className="bg-[#313b2f] p-6 rounded-2xl shadow-md border border-[#ffd639]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FaMagic size={100} className="text-white" />
            </div>

            <h2 className="text-xl font-bold text-[#ffd639] mb-1 flex items-center gap-2 relative z-10">
              <FaMagic /> Adicionar Combinações em Lote
            </h2>
            <p className="text-gray-300 text-sm mb-6 relative z-10">
              Gere várias novas cores de uma vez para adicionar a este produto.
            </p>

            <div className="bg-white p-5 rounded-xl space-y-5 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <FaRuler className="text-gray-400" /> Tamanho Fixo
                  </label>
                  <select
                    value={batchSize}
                    onChange={(e) => setBatchSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#ffd639] outline-none"
                  >
                    <option value="">Selecione...</option>
                    {ITEM_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <FaPlusCircle className="text-gray-400" /> Opção Extra
                  </label>
                  <input
                    type="text"
                    value={batchComplement}
                    onChange={(e) => setBatchComplement(e.target.value)}
                    placeholder="Ex: Com Colchão"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#ffd639] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <FaDollarSign className="text-gray-400" /> Preço (R$)
                  </label>
                  <input
                    type="text" // ERA number, AGORA É text!
                    value={batchPrice}
                    onChange={(e) =>
                      setBatchPrice(formatCurrencyInput(e.target.value))
                    }
                    placeholder="0,00"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#ffd639] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <FaLayerGroup className="text-gray-400" /> Estoque
                  </label>
                  <input
                    type="number"
                    value={batchStock}
                    onChange={(e) => setBatchStock(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#ffd639] outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <FaPalette className="text-gray-400" /> Cores a adicionar
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllColors}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full font-bold text-gray-600 flex items-center gap-1 transition-colors"
                  >
                    <FaCheckDouble /> Selecionar Todas
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {isCama &&
                    CAMA_COLORS.map((color) => (
                      <label
                        key={color.id}
                        className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all text-xs font-medium ${batchColors.includes(color.id) ? "border-[#313b2f] bg-[#313b2f]/5 text-[#313b2f]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                      >
                        <input
                          type="checkbox"
                          checked={batchColors.includes(color.id)}
                          onChange={() => toggleBatchColor(color.id)}
                          className="w-4 h-4 text-[#313b2f] rounded focus:ring-[#313b2f]"
                        />
                        {color.id.toUpperCase()}
                      </label>
                    ))}
                  {isLencol &&
                    LENCOL_COLORS.map((color) => (
                      <label
                        key={color}
                        className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all text-xs font-medium ${batchColors.includes(color) ? "border-[#313b2f] bg-[#313b2f]/5 text-[#313b2f]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                      >
                        <input
                          type="checkbox"
                          checked={batchColors.includes(color)}
                          onChange={() => toggleBatchColor(color)}
                          className="w-4 h-4 text-[#313b2f] rounded focus:ring-[#313b2f]"
                        />
                        {color}
                      </label>
                    ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateBatch}
                className="w-full py-3 bg-[#ffd639] text-[#313b2f] font-bold rounded-xl hover:bg-[#e6c135] shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <FaMagic /> Adicionar{" "}
                {batchColors.length > 0 ? batchColors.length : ""} Variações à
                Lista Abaixo
              </button>
            </div>
          </div>
        )}

        {/* LISTA DE VARIAÇÕES (EXISTENTES + NOVAS) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-50">
            <h2 className="text-lg font-bold text-[#313b2f] flex items-center gap-2">
              <FaLayerGroup className="text-gray-400" /> Lista de Variações
            </h2>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-bold text-gray-500">
              {variants.length} cadastradas
            </span>
          </div>

          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {variants.map((variant, index) => (
              <div
                key={variant.id}
                className="p-5 border-2 border-gray-100 rounded-xl bg-gray-50 relative group"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(variant.id)}
                  className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 md:opacity-100"
                  title="Remover Variação"
                >
                  <FaTrash size={12} />
                </button>

                <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                  Variação #{index + 1}
                  {variant.id.includes(".") && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">
                      NOVA
                    </span>
                  )}
                  {variant.isFeatured && (
                    <FaStar className="text-yellow-400" title="Em Destaque" />
                  )}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  {!isProtetor && (
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <FaPalette className="text-gray-400" /> Cor
                      </label>
                      <select
                        value={variant.color}
                        onChange={(e) =>
                          handleVariantChange(
                            variant.id,
                            "color",
                            e.target.value,
                          )
                        }
                        required={isColorRequired}
                        disabled={!categoryId}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#ffd639] outline-none disabled:bg-gray-200"
                      >
                        <option value="">
                          {categoryId
                            ? "Selecione..."
                            : "Escolha a categoria antes"}
                        </option>
                        {isCama &&
                          CAMA_COLORS.map((color) => (
                            <option key={color.id} value={color.id}>
                              Ext: {color.Externo} / Int: {color.Interno}
                            </option>
                          ))}
                        {isLencol &&
                          LENCOL_COLORS.map((color) => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ))}
                        {!isCama && !isLencol && !isProtetor && categoryId && (
                          <option value="Unica">Cor Única</option>
                        )}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <FaRuler className="text-gray-400" /> Tamanho
                    </label>
                    <select
                      value={variant.size}
                      onChange={(e) =>
                        handleVariantChange(variant.id, "size", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#ffd639] outline-none"
                    >
                      <option value="">Selecione...</option>
                      {ITEM_SIZES.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <FaPlusCircle className="text-gray-400" /> Opção Extra
                    </label>
                    <input
                      type="text"
                      value={variant.complement}
                      onChange={(e) =>
                        handleVariantChange(
                          variant.id,
                          "complement",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: Com Colchão"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#ffd639] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <FaDollarSign className="text-gray-400" /> Preço (R$)
                    </label>
                    <input
                      type="text" // ERA number, AGORA É text!
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(
                          variant.id,
                          "price",
                          formatCurrencyInput(e.target.value),
                        )
                      }
                      required
                      placeholder="0,00"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#ffd639] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <FaLayerGroup className="text-gray-400" /> Estoque
                    </label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        handleVariantChange(variant.id, "stock", e.target.value)
                      }
                      required
                      placeholder="Qtd"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#ffd639] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <FaBarcode className="text-gray-400" /> SKU{" "}
                      <span className="text-gray-400 font-normal">
                        (Opcional)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) =>
                        handleVariantChange(variant.id, "sku", e.target.value)
                      }
                      placeholder="Ex: CAMA-SOLT"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#ffd639] outline-none"
                    />
                  </div>

                  {/* CHECKBOX DE DESTAQUE DA VARIAÇÃO */}
                  <div className="flex items-end pb-2 md:col-span-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={variant.isFeatured}
                        onChange={(e) =>
                          handleVariantChange(
                            variant.id,
                            "isFeatured",
                            e.target.checked,
                          )
                        }
                        className="w-5 h-5 text-[#ffd639] bg-white border-gray-300 rounded focus:ring-[#ffd639]"
                      />
                      <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                        Variante em Destaque{" "}
                        <FaStar className="text-gray-300" />
                      </span>
                    </label>
                  </div>

                  <div className="sm:col-span-2 md:col-span-5 border-t border-gray-200 pt-3 mt-1">
                    <label className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                      <FaImage className="text-gray-400" /> Imagens da Variante
                    </label>
                    <div className="space-y-2">
                      {variant.imageUrls.map((url, imgIdx) => (
                        <div key={imgIdx} className="flex gap-2">
                          <input
                            type="text"
                            value={url}
                            onChange={(e) =>
                              handleVariantImageChange(
                                variant.id,
                                imgIdx,
                                e.target.value,
                              )
                            }
                            placeholder="https://..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#ffd639] outline-none bg-white"
                          />
                          {variant.imageUrls.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveVariantImage(variant.id, imgIdx)
                              }
                              className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <FaTrash size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddVariantImage(variant.id)}
                        className="text-xs text-[#007bff] font-bold hover:underline mt-1"
                      >
                        + Adicionar outra foto a esta variação
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddVariant}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-400 hover:text-[#313b2f] transition-all"
            >
              <FaPlus /> Adicionar Variação Manualmente
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#313b2f] text-white font-bold rounded-xl hover:bg-[#ffd639] hover:text-[#313b2f] hover:-translate-y-1 shadow-lg shadow-gray-200 transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" /> Atualizando...
            </>
          ) : (
            <>
              <FaSave /> Salvar Produto Completo
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
