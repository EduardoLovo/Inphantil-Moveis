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
  FaLayerGroup,
  FaSpinner,
  FaPalette,
  FaRuler,
  FaPlusCircle,
  FaTimes,
  FaPuzzlePiece,
  FaStar,
  FaSearch,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import FullScreenLoader from "../../components/FullScreenLoader";

// =========================================================
// 🎨 PALETAS ESTÁTICAS
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
  "UNICO",
  "BERÇO",
  "JUNIOR",
  "SOLTEIRO",
  "SOLTEIRAO",
  "VIUVA",
  "CASAL",
  "QUEEN",
  "KING",
];

// =========================================================
// 🧩 TIPOS DO ESTADO
// =========================================================
interface VariantRowDef {
  id: string;
  size: string;
  complement: string;
  price: string;
  stock: string;
  sku: string;
  isFeatured: boolean; // Destaque na Home!
}

interface VariantGroup {
  id: string;
  color: string;
  imageUrls: string[];
  rows: VariantRowDef[];
}

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, updateProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [mainImage, setMainImage] = useState("");

  const [groups, setGroups] = useState<VariantGroup[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Filtro
  const [variantFilter, setVariantFilter] = useState("");

  useEffect(() => {
    fetchCategories();
    if (id) loadProductData(Number(id));
  }, [id, fetchCategories]);

  // =========================================================
  // 🧠 LEITURA DINÂMICA DAS REGRAS
  // =========================================================
  const selectedCategoryObj = categories.find(
    (c) => c.id.toString() === categoryId,
  );
  let parsedConfig = (selectedCategoryObj as any)?.config;
  if (typeof parsedConfig === "string") {
    try {
      parsedConfig = JSON.parse(parsedConfig);
    } catch (e) {
      parsedConfig = null;
    }
  }
  const config = parsedConfig || {
    showSizes: true,
    showColors: true,
    colorPalette: "CAMA_COLORS",
    showComplements: false,
  };

  const hasColors = config.showColors;
  const hasSizes = config.showSizes;
  const hasComplements = config.showComplements;
  const activePalette =
    config.colorPalette === "LENCOL_COLORS" ? LENCOL_COLORS : CAMA_COLORS;

  // =========================================================
  // 🔄 CONSTRUTOR DE BLOCOS (Flat -> Grouped)
  // =========================================================
  const loadProductData = async (productId: number) => {
    setLoadingInitial(true);
    const data = await getProductById(productId);

    if (data) {
      setName(data.name || "");
      setDescription(data.description || "");
      setCategoryId(data.categoryId ? data.categoryId.toString() : "");
      setMainImage(data.mainImage || "");

      if (data.variants && data.variants.length > 0) {
        // Agrupador de Variações por Cor
        const groupMap = new Map<string, VariantGroup>();

        data.variants.forEach((v: any) => {
          const vColor = v.color || "Cor Única";
          const vImages =
            v.images && v.images.length > 0
              ? v.images.map((i: any) => i.url)
              : [""];

          let group = groupMap.get(vColor);
          if (!group) {
            group = {
              id: `group_${Math.random()}`,
              color: vColor === "Cor Única" ? "" : vColor,
              imageUrls: vImages,
              rows: [],
            };
            groupMap.set(vColor, group);
          }

          group.rows.push({
            id: v.id ? v.id.toString() : Math.random().toString(),
            size: v.size === "Tamanho Único" ? "" : v.size || "",
            complement: v.complement || "",
            price: v.price
              ? Number(v.price).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "",
            stock: v.stock?.toString() || "0",
            sku: v.sku || "",
            isFeatured: v.isFeatured || false,
          });
        });

        setGroups(Array.from(groupMap.values()));
      } else {
        setGroups([]); // Caso o produto estivesse totalmente quebrado
      }
    }
    setLoadingInitial(false);
  };

  // =========================================================
  // 🛠️ FUNÇÕES DE MANIPULAÇÃO
  // =========================================================
  const handleAddGroup = () => {
    setGroups([
      ...groups,
      {
        id: Math.random().toString(),
        color: "",
        imageUrls: [""],
        rows: [
          {
            id: Math.random().toString(),
            size: "",
            complement: "",
            price: "",
            stock: "10",
            sku: "",
            isFeatured: false,
          },
        ],
      },
    ]);
  };
  const handleRemoveGroup = (groupId: string) =>
    setGroups(groups.filter((g) => g.id !== groupId));
  const handleGroupColorChange = (groupId: string, color: string) =>
    setGroups(groups.map((g) => (g.id === groupId ? { ...g, color } : g)));

  const handleAddImageToGroup = (groupId: string) =>
    setGroups(
      groups.map((g) =>
        g.id === groupId ? { ...g, imageUrls: [...g.imageUrls, ""] } : g,
      ),
    );
  const handleImageChangeInGroup = (
    groupId: string,
    imgIndex: number,
    value: string,
  ) => {
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          const newUrls = [...g.imageUrls];
          newUrls[imgIndex] = value;
          return { ...g, imageUrls: newUrls };
        }
        return g;
      }),
    );
  };
  const handleRemoveImageFromGroup = (groupId: string, imgIndex: number) => {
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              imageUrls: g.imageUrls.filter((_, idx) => idx !== imgIndex),
            }
          : g,
      ),
    );
  };

  const handleAddRowToGroup = (groupId: string) => {
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              rows: [
                ...g.rows,
                {
                  id: Math.random().toString(),
                  size: "",
                  complement: "",
                  price: "",
                  stock: "10",
                  sku: "",
                  isFeatured: false,
                },
              ],
            }
          : g,
      ),
    );
  };
  const handleRemoveRowFromGroup = (groupId: string, rowId: string) => {
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? { ...g, rows: g.rows.filter((r) => r.id !== rowId) }
          : g,
      ),
    );
  };
  const handleRowChange = (
    groupId: string,
    rowId: string,
    field: keyof VariantRowDef,
    value: string | boolean,
  ) => {
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              rows: g.rows.map((r) =>
                r.id === rowId ? { ...r, [field]: value } : r,
              ),
            }
          : g,
      ),
    );
  };

  // =========================================================
  // 📤 ENVIO PARA O BANCO DE DADOS
  // =========================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!categoryId) {
      toast.error("Selecione uma categoria.");
      setIsSaving(false);
      return;
    }
    if (groups.length === 0) {
      toast.error("Adicione pelo menos um bloco.");
      setIsSaving(false);
      return;
    }

    let hasError = false;
    groups.forEach((g) => {
      if (hasColors && !g.color) hasError = true;
      if (g.rows.length === 0) hasError = true;
      g.rows.forEach((r) => {
        if (hasSizes && !r.size) hasError = true;
        if (!r.price || !r.stock) hasError = true;
      });
    });

    if (hasError) {
      toast.error("Preencha todos os campos obrigatórios nos blocos.");
      setIsSaving(false);
      return;
    }

    const flatVariants: any[] = [];

    groups.forEach((group) => {
      const validImages = group.imageUrls
        .filter((url) => url.trim() !== "")
        .map((url) => ({ url }));

      group.rows.forEach((row) => {
        flatVariants.push({
          color: hasColors ? group.color : "Cor Única",
          size: hasSizes ? row.size : "Tamanho Único",
          complement:
            hasComplements && row.complement.trim() !== ""
              ? row.complement
              : undefined,
          price: parseCurrency(row.price),
          stock: parseInt(row.stock) || 0,
          sku: row.sku || undefined,
          isFeatured: row.isFeatured,
          images: validImages,
        });
      });
    });

    const productData = {
      name,
      description,
      categoryId: parseInt(categoryId),
      mainImage,
      variants: flatVariants,
    };

    try {
      await updateProduct(Number(id), productData);
      toast.success("Produto atualizado com sucesso!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (error: any) {
      toast.error(`Erro: ${error.message || "Falha ao atualizar"}`);
      setIsSaving(false);
    }
  };

  const formatCurrencyInput = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");
    if (!onlyNumbers) return "";
    return (Number(onlyNumbers) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const parseCurrency = (value: string) => {
    if (!value) return 0;
    const cleanString = value.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleanString) || 0;
  };

  // =========================================================
  // 🔍 LÓGICA DE FILTRAGEM DOS BLOCOS E LINHAS
  // =========================================================
  const filteredGroups = groups
    .map((g) => {
      const matchedRows = g.rows.filter((r) => {
        if (!variantFilter) return true;
        const searchString =
          `${g.color} ${r.size} ${r.complement} ${r.sku} ${r.price}`
            .replace(/-/g, " ")
            .toLowerCase();
        const searchTerms = variantFilter
          .replace(/-/g, " ")
          .toLowerCase()
          .split(/\s+/);
        return searchTerms.every((term) => searchString.includes(term));
      });
      return { ...g, rows: matchedRows };
    })
    .filter((g) => g.rows.length > 0); // Só mostra o bloco se tiver alguma linha correspondente

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

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 pt-24 pb-20">
      <Toaster />
      <FullScreenLoader
        isLoading={isSaving}
        title="A guardar alterações..."
        message="Atualizando o catálogo e as variações."
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#313b2f] flex items-center gap-3">
            <FaBoxOpen className="text-[#ffd639]" /> Editar Produto
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Os blocos foram montados a partir das variações salvas.
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
                Descrição
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
                URL da Imagem Principal (Capa)
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
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-gray-100 text-gray-500 cursor-not-allowed"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-red-400 mt-1">
                Para mudar a categoria de um produto existente, crie um novo. A
                troca quebra as regras ativas.
              </p>
            </div>
          </div>
        </div>

        {/* BLOCOS DINÂMICOS */}
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#313b2f] flex items-center gap-2">
              <FaLayerGroup className="text-[#ffd639]" /> Variações do Produto
            </h2>

            {/* PESQUISA DE VARIAÇÕES */}
            {groups.length > 0 && (
              <div className="relative w-full md:w-72">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Buscar variação..."
                  value={variantFilter}
                  onChange={(e) => setVariantFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none text-sm shadow-sm"
                />
              </div>
            )}
          </div>

          {filteredGroups.length === 0 && variantFilter && (
            <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-500 text-sm">
              Nenhuma variação corresponde ao filtro.
            </div>
          )}

          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white border-2 border-[#313b2f]/10 rounded-2xl shadow-sm overflow-hidden relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveGroup(group.id)}
                className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                title="Remover Bloco Inteiro"
              >
                <FaTrash />
              </button>

              <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-col md:flex-row gap-6">
                {/* COR DO BLOCO */}
                {hasColors && (
                  <div className="flex-1">
                    <label className="text-sm font-bold text-[#313b2f] mb-2 flex items-center gap-2">
                      <FaPalette className="text-[#ffd639]" /> Cor Deste Bloco
                    </label>
                    <select
                      value={group.color}
                      onChange={(e) =>
                        handleGroupColorChange(group.id, e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#ffd639] outline-none"
                    >
                      <option value="">Selecione a cor...</option>
                      {activePalette.map((c: any) => (
                        <option key={c.id || c} value={c.id || c}>
                          {c.Externo
                            ? `Ext: ${c.Externo} / Int: ${c.Interno}`
                            : c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* IMAGENS COMPARTILHADAS */}
                <div className="flex-1">
                  <label className="text-sm font-bold text-[#313b2f] mb-2 flex items-center gap-2">
                    <FaImage className="text-[#ffd639]" /> Fotos Compartilhadas{" "}
                    {hasColors ? "desta Cor" : "destes itens"}
                  </label>
                  <div className="space-y-2">
                    {group.imageUrls.map((url, imgIdx) => (
                      <div key={imgIdx} className="flex gap-2">
                        <input
                          type="text"
                          value={url}
                          onChange={(e) =>
                            handleImageChangeInGroup(
                              group.id,
                              imgIdx,
                              e.target.value,
                            )
                          }
                          placeholder="https:// URL da Imagem"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ffd639] outline-none"
                        />
                        {group.imageUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveImageFromGroup(group.id, imgIdx)
                            }
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddImageToGroup(group.id)}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      + Adicionar foto
                    </button>
                  </div>
                </div>
              </div>

              {/* DADOS DA VARIAÇÃO */}
              <div className="p-4 bg-white">
                <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <FaRuler className="text-gray-400" /> Detalhes (Preço e
                  Estoque)
                </label>

                <div className="space-y-3">
                  {group.rows.map((row) => (
                    <div
                      key={row.id}
                      className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-gray-50 p-2 rounded-lg border border-gray-100"
                    >
                      {hasSizes && (
                        <select
                          value={row.size}
                          onChange={(e) =>
                            handleRowChange(
                              group.id,
                              row.id,
                              "size",
                              e.target.value,
                            )
                          }
                          required
                          className="w-full md:w-32 px-2 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                        >
                          <option value="">Tamanho...</option>
                          {ITEM_SIZES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}

                      {hasComplements && (
                        <div className="flex items-center w-full md:w-32 relative">
                          <span className="absolute left-2 text-gray-400">
                            <FaPuzzlePiece size={12} />
                          </span>
                          <input
                            type="text"
                            value={row.complement}
                            onChange={(e) =>
                              handleRowChange(
                                group.id,
                                row.id,
                                "complement",
                                e.target.value,
                              )
                            }
                            placeholder="Extra..."
                            className="w-full pl-7 pr-2 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                      )}

                      <input
                        type="text"
                        value={row.price}
                        onChange={(e) =>
                          handleRowChange(
                            group.id,
                            row.id,
                            "price",
                            formatCurrencyInput(e.target.value),
                          )
                        }
                        required
                        placeholder="Preço R$"
                        className="w-full md:w-28 px-2 py-2 border border-gray-200 rounded-lg text-sm bg-yellow-50/50"
                        title="Preço"
                      />
                      <input
                        type="number"
                        value={row.stock}
                        onChange={(e) =>
                          handleRowChange(
                            group.id,
                            row.id,
                            "stock",
                            e.target.value,
                          )
                        }
                        required
                        placeholder="Estoque"
                        className="w-full md:w-20 px-2 py-2 border border-gray-200 rounded-lg text-sm"
                        title="Estoque"
                      />
                      <input
                        type="text"
                        value={row.sku}
                        onChange={(e) =>
                          handleRowChange(
                            group.id,
                            row.id,
                            "sku",
                            e.target.value,
                          )
                        }
                        placeholder="SKU"
                        className="w-full md:w-28 px-2 py-2 border border-gray-200 rounded-lg text-sm"
                        title="SKU"
                      />

                      {/* ESTRELA DE DESTAQUE AQUI */}
                      <label
                        className="flex items-center justify-center w-full md:w-auto p-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        title="Destacar na Home"
                      >
                        <input
                          type="checkbox"
                          checked={row.isFeatured}
                          onChange={(e) =>
                            handleRowChange(
                              group.id,
                              row.id,
                              "isFeatured",
                              e.target.checked,
                            )
                          }
                          className="hidden"
                        />
                        <FaStar
                          className={`text-lg transition-colors ${row.isFeatured ? "text-yellow-400" : "text-gray-300"}`}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveRowFromGroup(group.id, row.id)
                        }
                        disabled={group.rows.length === 1}
                        className="w-full md:w-auto p-2 text-red-400 hover:text-red-600 disabled:opacity-30 flex justify-center"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>

                {(hasSizes || hasComplements) && (
                  <button
                    type="button"
                    onClick={() => handleAddRowToGroup(group.id)}
                    className="mt-3 text-sm font-bold text-[#313b2f] bg-[#ffd639]/20 hover:bg-[#ffd639]/40 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaPlusCircle /> Adicionar outra variação neste bloco
                  </button>
                )}
              </div>
            </div>
          ))}

          {!variantFilter && (
            <button
              type="button"
              onClick={handleAddGroup}
              className="w-full py-5 border-2 border-dashed border-[#313b2f]/30 bg-[#313b2f]/5 rounded-xl text-[#313b2f] font-bold flex items-center justify-center gap-2 hover:bg-[#313b2f]/10 transition-all"
            >
              <FaPlus /> Adicionar Novo Bloco de Variação
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-4 mt-8 bg-[#313b2f] text-white font-bold rounded-xl hover:bg-[#ffd639] hover:text-[#313b2f] shadow-lg transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-70"
        >
          {isSaving ? (
            <>
              <FaSpinner className="animate-spin" /> Atualizando no Banco...
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
