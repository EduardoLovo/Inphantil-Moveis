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
  FaShapes,
  FaBolt,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

// =========================================================
// 🎨 PALETAS E MODELOS ESTÁTICOS
// =========================================================
const MODELOS_PROTETORES = [
  "Nuvem - Lado Direito",
  "Nuvem - Lado Esquerdo",
  "Montanha - Lado Direito",
  "Montanha - Lado Esquerdo",
  "Onda - Lado Direito",
  "Onda - Lado Esquerdo",
  "Pico - Lado Direito",
  "Pico - Lado Esquerdo",
  "Encaixe - Lado Direito",
  "Encaixe - Lado Esquerdo",
  "Cerca - Lado Direito",
  "Cerca - Lado Esquerdo",
];

const PROTETOR_MONTANHA_COLORS = [
  { id: "cz6-cz26-B8", Cor1: "CZ6", Cor2: "CZ26", Cor3: "B8" },
  { id: "cz6-vd25-B8", Cor1: "CZ6", Cor2: "VD25", Cor3: "B8" },
];

const CAMA_COLORS = [
  { id: "cz6-cz26", Externo: "CZ6", Interno: "CZ26" },
  { id: "cz6-vd25", Externo: "CZ6", Interno: "VD25" },
  { id: "cz6-r12", Externo: "CZ6", Interno: "R12" },
  { id: "cz6-az10", Externo: "CZ6", Interno: "AZ10" },
  { id: "cz6-l11", Externo: "CZ6", Interno: "L11" },
  { id: "cz6-am14", Externo: "CZ6", Interno: "AM14" },
  { id: "b6-b8", Externo: "B6", Interno: "B8" },
  { id: "b6-vd25", Externo: "B6", Interno: "VD25" },
  { id: "b6-r12", Externo: "B6", Interno: "R12" },
  { id: "b6-az10", Externo: "B6", Interno: "AZ10" },
  { id: "b6-l11", Externo: "B6", Interno: "L11" },
  { id: "b6-am14", Externo: "B6", Interno: "AM14" },
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
}

interface VariantGroup {
  id: string;
  model: string;
  color: string;
  imageUrls: string[];
  rows: VariantRowDef[];
  showGenerator: boolean;
  genSizes: string[];
  genComplements: string;
  genPrice: string;
  genStock: string;
}

const AdminEditProductPage: React.FC = () => {
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
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  // 1. Carrega Categorias e Produto
  useEffect(() => {
    const loadAll = async () => {
      await fetchCategories();
      if (id) {
        const prod = await getProductById(Number(id));
        if (prod) {
          // Colocamos o || "" para garantir que sempre será uma string (texto)
          setName(prod.name || "");
          setDescription(prod.description || "");
          setCategoryId(prod.categoryId ? prod.categoryId.toString() : "");
          setMainImage(prod.mainImage || "");

          // 🧠 MÁGICA: Reagrupa as variantes vindas do banco em Blocos (Groups)
          const grouped: { [key: string]: VariantGroup } = {};

          prod.variants.forEach((v: any) => {
            // Separa Modelo e Extra se houver a barrinha |
            let model = "";
            let extra = v.complement || "";
            if (v.complement?.includes(" | ")) {
              const parts = v.complement.split(" | ");
              model = parts[0];
              extra = parts[1];
            } else if (MODELOS_PROTETORES.includes(v.complement)) {
              model = v.complement;
              extra = "";
            }

            const colorKey = v.color || "Cor Única";
            const imageKey =
              v.images
                ?.map((img: any) => img.url)
                .sort()
                .join(",") || "no-images";
            const groupKey = `${colorKey}-${model}-${imageKey}`;

            if (!grouped[groupKey]) {
              grouped[groupKey] = {
                id: Math.random().toString(),
                model: model,
                color: colorKey,
                imageUrls: v.images?.map((img: any) => img.url) || [""],
                rows: [],
                showGenerator: false,
                genSizes: [],
                genComplements: "",
                genPrice: "",
                genStock: "10",
              };
            }

            grouped[groupKey].rows.push({
              id: v.id.toString(),
              size: v.size,
              complement: extra,
              price: v.price.toString().replace(".", ","),
              stock: v.stock.toString(),
              sku: v.sku || "",
            });
          });

          setGroups(Object.values(grouped));
        }
        setIsLoadingProduct(false);
      }
    };
    loadAll();
  }, [id, fetchCategories, getProductById]);

  // 2. Configurações da Categoria
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
    showModels: false,
  };
  const hasColors = config.showColors;
  const hasSizes = config.showSizes;
  const hasComplements = config.showComplements;
  const hasModels = config.showModels;
  const basePalette =
    config.colorPalette === "LENCOL_COLORS" ? LENCOL_COLORS : CAMA_COLORS;

  // =========================================================
  // 🛠️ FUNÇÕES DE MANIPULAÇÃO (Copiadas do Create)
  // =========================================================
  const handleAddGroup = () => {
    setGroups([
      ...groups,
      {
        id: Math.random().toString(),
        model: "",
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
          },
        ],
        showGenerator: false,
        genSizes: [],
        genComplements: "",
        genPrice: "",
        genStock: "10",
      },
    ]);
  };

  const handleRemoveGroup = (groupId: string) =>
    setGroups(groups.filter((g) => g.id !== groupId));
  const handleGroupModelChange = (groupId: string, model: string) =>
    setGroups(
      groups.map((g) => (g.id === groupId ? { ...g, model, color: "" } : g)),
    );
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
  const handleRemoveImageFromGroup = (groupId: string, imgIndex: number) =>
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

  const handleAddRowToGroup = (groupId: string) =>
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
                },
              ],
            }
          : g,
      ),
    );
  const handleRemoveRowFromGroup = (groupId: string, rowId: string) =>
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? { ...g, rows: g.rows.filter((r) => r.id !== rowId) }
          : g,
      ),
    );
  const handleRowChange = (
    groupId: string,
    rowId: string,
    field: keyof VariantRowDef,
    value: string,
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

  // ⚡ GERADOR EM MASSA
  const toggleGenerator = (groupId: string) =>
    setGroups(
      groups.map((g) =>
        g.id === groupId ? { ...g, showGenerator: !g.showGenerator } : g,
      ),
    );
  const handleGenSizeToggle = (groupId: string, size: string) => {
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          const hasSize = g.genSizes.includes(size);
          return {
            ...g,
            genSizes: hasSize
              ? g.genSizes.filter((s) => s !== size)
              : [...g.genSizes, size],
          };
        }
        return g;
      }),
    );
  };

  const handleGenerateBulk = (groupId: string) => {
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          const sizesToUse =
            hasSizes && g.genSizes.length > 0 ? g.genSizes : [""];
          const compsToUse =
            hasComplements && g.genComplements
              ? g.genComplements
                  .split(",")
                  .map((c) => c.trim())
                  .filter((c) => c !== "")
              : [""];
          const newRows: VariantRowDef[] = [];
          sizesToUse.forEach((size) => {
            compsToUse.forEach((comp) => {
              newRows.push({
                id: Math.random().toString(),
                size,
                complement: comp,
                price: g.genPrice,
                stock: g.genStock || "10",
                sku: "",
              });
            });
          });
          if (newRows.length === 0) {
            toast.error("Selecione tamanhos/opcionais.");
            return g;
          }
          return {
            ...g,
            rows: [...g.rows, ...newRows],
            showGenerator: false,
            genSizes: [],
            genComplements: "",
            genPrice: "",
          };
        }
        return g;
      }),
    );
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
    return (
      parseFloat(value.toString().replace(/\./g, "").replace(",", ".")) || 0
    );
  };

  // =========================================================
  // 📤 ENVIO PARA O BANCO (UPDATE)
  // =========================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const flatVariants: any[] = [];
    groups.forEach((group) => {
      const validImages = group.imageUrls
        .filter((url) => url.trim() !== "")
        .map((url) => ({ url }));
      group.rows.forEach((row) => {
        let finalComplement = row.complement;
        if (hasModels && group.model) {
          finalComplement =
            row.complement.trim() !== ""
              ? `${group.model} | ${row.complement}`
              : group.model;
        }
        flatVariants.push({
          color: hasColors ? group.color : "Cor Única",
          size: hasSizes ? row.size : "Tamanho Único",
          complement: finalComplement || undefined,
          price: parseCurrency(row.price),
          stock: parseInt(row.stock) || 0,
          sku: row.sku || undefined,
          images: validImages,
        });
      });
    });

    try {
      await updateProduct(Number(id), {
        name,
        description,
        categoryId: parseInt(categoryId),
        mainImage,
        variants: flatVariants,
      } as any);
      toast.success("Produto atualizado com sucesso!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
      setIsSaving(false);
    }
  };

  if (isLoadingProduct)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639]" />
      </div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 pt-24 pb-20">
      <Toaster />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#313b2f] flex items-center gap-3">
          <FaBoxOpen className="text-[#ffd639]" /> Editar Produto
        </h1>
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg font-bold shadow-sm"
        >
          <FaArrowLeft /> Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* INFO BÁSICA */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none"
              />
            </div>
          </div>
        </div>

        {/* VARIAÇÕES (IGUAL AO CREATE) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#313b2f] flex items-center gap-2 pb-2 border-b border-gray-200">
            <FaLayerGroup className="text-[#ffd639]" /> Variações Agrupadas
          </h2>

          {groups.map((group) => {
            const isMontanha = group.model.toLowerCase().includes("montanha");
            const activePalette = isMontanha
              ? PROTETOR_MONTANHA_COLORS
              : basePalette;

            return (
              <div
                key={group.id}
                className="bg-white border-2 border-[#313b2f]/10 rounded-2xl shadow-sm overflow-hidden relative"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveGroup(group.id)}
                  className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg"
                >
                  <FaTrash />
                </button>

                <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-col md:flex-row gap-6">
                  {hasModels && (
                    <div className="flex-1">
                      <label className="text-sm font-bold text-[#313b2f] mb-2 flex items-center gap-2">
                        <FaShapes className="text-[#ffd639]" /> Modelo
                      </label>
                      <select
                        value={group.model}
                        onChange={(e) =>
                          handleGroupModelChange(group.id, e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#ffd639] outline-none"
                      >
                        <option value="">Selecione...</option>
                        {MODELOS_PROTETORES.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {hasColors && (
                    <div className="flex-1">
                      <label className="text-sm font-bold text-[#313b2f] mb-2 flex items-center gap-2">
                        <FaPalette className="text-[#ffd639]" /> Cor
                      </label>
                      <select
                        value={group.color}
                        onChange={(e) =>
                          handleGroupColorChange(group.id, e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#ffd639] outline-none"
                      >
                        <option value="">Selecione...</option>
                        {activePalette.map((c: any) => (
                          <option
                            key={typeof c === "string" ? c : c.id}
                            value={typeof c === "string" ? c : c.id}
                          >
                            {typeof c === "string"
                              ? c
                              : c.Cor3
                                ? `Ext: ${c.Cor1} / Int: ${c.Cor2} / Det: ${c.Cor3}`
                                : `Ext: ${c.Externo} / Int: ${c.Interno}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="text-sm font-bold text-[#313b2f] mb-2 flex items-center gap-2">
                      <FaImage className="text-[#ffd639]" /> Fotos do Grupo
                    </label>
                    {group.imageUrls.map((url, imgIdx) => (
                      <div key={imgIdx} className="flex gap-2 mb-2">
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
                          placeholder="URL Imagem"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        {group.imageUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveImageFromGroup(group.id, imgIdx)
                            }
                            className="p-2 text-red-600"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddImageToGroup(group.id)}
                      className="text-xs text-blue-600 font-bold"
                    >
                      + Foto
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <FaRuler className="text-gray-400" /> Detalhes (Tamanho,
                      Preço, SKU)
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleGenerator(group.id)}
                      className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-purple-200"
                    >
                      <FaBolt /> Gerador Múltiplo
                    </button>
                  </div>

                  {group.showGenerator && (
                    <div className="mb-6 bg-purple-50 border border-purple-100 p-4 rounded-xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {hasSizes && (
                          <div>
                            <label className="block text-xs font-bold text-purple-600 mb-2">
                              TAMANHOS:
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {ITEM_SIZES.slice(1).map((s) => (
                                <label
                                  key={s}
                                  className="flex items-center gap-1 bg-white px-2 py-1 border border-purple-200 rounded text-xs cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={group.genSizes.includes(s)}
                                    onChange={() =>
                                      handleGenSizeToggle(group.id, s)
                                    }
                                    className="text-purple-600"
                                  />{" "}
                                  {s}
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                        {hasComplements && (
                          <div>
                            <label className="block text-xs font-bold text-purple-600 mb-2">
                              OPÇÕES (Separe por vírgula):
                            </label>
                            <input
                              type="text"
                              value={group.genComplements}
                              onChange={(e) =>
                                setGroups(
                                  groups.map((g) =>
                                    g.id === group.id
                                      ? { ...g, genComplements: e.target.value }
                                      : g,
                                  ),
                                )
                              }
                              placeholder="Com Sensor, Sem Sensor"
                              className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <label className="block text-xs font-bold text-purple-600 mb-1">
                            PREÇO BASE:
                          </label>
                          <input
                            type="text"
                            value={group.genPrice}
                            onChange={(e) =>
                              setGroups(
                                groups.map((g) =>
                                  g.id === group.id
                                    ? {
                                        ...g,
                                        genPrice: formatCurrencyInput(
                                          e.target.value,
                                        ),
                                      }
                                    : g,
                                ),
                              )
                            }
                            placeholder="0,00"
                            className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleGenerateBulk(group.id)}
                          className="bg-purple-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-purple-700"
                        >
                          Gerar Agora
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {group.rows.map((row) => (
                      <div
                        key={row.id}
                        className="flex flex-col md:flex-row gap-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
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
                            className="w-full md:w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm"
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
                          <div className="flex items-center w-full md:w-40 relative">
                            <span className="absolute left-3 text-gray-400">
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
                              placeholder="Extra"
                              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
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
                          className="w-full md:w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-yellow-50/50"
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
                          className="w-full md:w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm"
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
                          className="w-full md:w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveRowFromGroup(group.id, row.id)
                          }
                          disabled={group.rows.length === 1}
                          className="text-red-400 disabled:opacity-30"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddRowToGroup(group.id)}
                    className="mt-3 text-xs font-bold text-[#313b2f] bg-[#ffd639]/20 px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <FaPlusCircle /> Adicionar linha manual
                  </button>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleAddGroup}
            className="w-full py-5 border-2 border-dashed border-[#313b2f]/30 bg-[#313b2f]/5 rounded-xl font-bold flex items-center justify-center gap-2 text-[#313b2f]"
          >
            <FaPlus /> Adicionar Novo Bloco de Variação
          </button>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-4 bg-[#313b2f] text-white font-bold rounded-xl hover:bg-[#ffd639] hover:text-[#313b2f] shadow-lg flex items-center justify-center gap-3 text-lg disabled:opacity-70"
        >
          {isSaving ? (
            <>
              <FaSpinner className="animate-spin" /> Salvando...
            </>
          ) : (
            <>
              <FaSave /> Salvar Alterações
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminEditProductPage;
