import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  // Estados do Gerador em Massa
  showGenerator: boolean;
  genSizes: string[];
  genComplements: string;
  genPrice: string;
  genStock: string;
}

const AdminCreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { createProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [mainImage, setMainImage] = useState("");

  const [groups, setGroups] = useState<VariantGroup[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // =========================================================
  // 🧠 LEITURA DINÂMICA DAS REGRAS DA CATEGORIA
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
    showModels: false,
  };

  const hasColors = config.showColors;
  const hasSizes = config.showSizes;
  const hasComplements = config.showComplements;
  const hasModels = config.showModels;
  const basePalette =
    config.colorPalette === "LENCOL_COLORS" ? LENCOL_COLORS : CAMA_COLORS;

  useEffect(() => {
    setGroups([]);
  }, [categoryId]);

  // =========================================================
  // 🛠️ FUNÇÕES DE MANIPULAÇÃO
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

  const handleGroupModelChange = (groupId: string, model: string) => {
    setGroups(
      groups.map((g) => (g.id === groupId ? { ...g, model, color: "" } : g)),
    );
  };

  const handleGroupColorChange = (groupId: string, color: string) => {
    setGroups(groups.map((g) => (g.id === groupId ? { ...g, color } : g)));
  };

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

  // ⚡ FUNÇÕES DO GERADOR EM MASSA ⚡
  const toggleGenerator = (groupId: string) => {
    setGroups(
      groups.map((g) =>
        g.id === groupId ? { ...g, showGenerator: !g.showGenerator } : g,
      ),
    );
  };

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
                size: size,
                complement: comp,
                price: g.genPrice,
                stock: g.genStock || "10",
                sku: "",
              });
            });
          });

          if (newRows.length === 0) {
            toast.error("Selecione pelo menos um tamanho/opcional.");
            return g;
          }

          toast.success(`${newRows.length} combinações geradas!`);
          return {
            ...g,
            // Se a primeira linha estiver vazia, substitui. Se não, adiciona na lista.
            rows:
              g.rows.length === 1 &&
              !g.rows[0].price &&
              !g.rows[0].size &&
              !g.rows[0].complement
                ? newRows
                : [...g.rows, ...newRows],
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
      if (hasModels && !g.model) hasError = true;
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
        let finalComplement = row.complement;
        if (hasModels) {
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
          isFeatured: false,
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
      await createProduct(productData);
      toast.success("Produto criado com sucesso!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
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
    return parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 pt-24 pb-20">
      <Toaster />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#313b2f] flex items-center gap-3">
            <FaBoxOpen className="text-[#ffd639]" /> Novo Produto
          </h1>
        </div>
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-bold shadow-sm"
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
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none bg-yellow-50 font-bold"
              >
                <option value="">Selecione para liberar as regras...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* BLOCOS DINÂMICOS */}
        {categoryId && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-[#313b2f] flex items-center gap-2 pb-2 border-b border-gray-200">
              <FaLayerGroup className="text-[#ffd639]" /> Variações do Produto
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
                    title="Remover Bloco"
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
                          <option value="">Selecione o modelo...</option>
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
                          disabled={hasModels && !group.model}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#ffd639] outline-none disabled:bg-gray-200"
                        >
                          <option value="">
                            {hasModels && !group.model
                              ? "Escolha o modelo 1º"
                              : "Selecione a cor..."}
                          </option>
                          {activePalette.map((c: any) => {
                            if (typeof c === "string")
                              return (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              );
                            if (c.Cor3)
                              return (
                                <option key={c.id} value={c.id}>
                                  Ext: {c.Cor1} / Int: {c.Cor2} / Det: {c.Cor3}
                                </option>
                              );
                            return (
                              <option key={c.id} value={c.id}>
                                Ext: {c.Externo} / Int: {c.Interno}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="text-sm font-bold text-[#313b2f] mb-2 flex items-center gap-2">
                        <FaImage className="text-[#ffd639]" /> Fotos
                        Compartilhadas
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
                              placeholder="URL da Imagem"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ffd639] outline-none"
                            />
                            {group.imageUrls.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveImageFromGroup(group.id, imgIdx)
                                }
                                className="p-2 bg-red-100 text-red-600 rounded-lg"
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
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 border-b border-gray-100 pb-3">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <FaRuler className="text-gray-400" /> Detalhes (Preço,
                        Estoque)
                      </label>
                      {(hasSizes || hasComplements) && (
                        <button
                          type="button"
                          onClick={() => toggleGenerator(group.id)}
                          className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-purple-200 transition-colors"
                        >
                          <FaBolt /> Gerador Múltiplo
                        </button>
                      )}
                    </div>

                    {/* ⚡ PAINEL DO GERADOR EM MASSA ⚡ */}
                    {group.showGenerator && (
                      <div className="mb-4 bg-purple-50 border border-purple-100 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                        <h4 className="font-bold text-purple-800 text-sm mb-3 flex items-center gap-2">
                          <FaBolt /> Gerar Múltiplas Linhas Automaticamente
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {hasSizes && (
                            <div>
                              <label className="block text-xs font-bold text-purple-600 uppercase mb-2">
                                Marque os Tamanhos:
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
                                      className="text-purple-600 focus:ring-purple-500 rounded-sm"
                                    />{" "}
                                    {s}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                          {hasComplements && (
                            <div>
                              <label className="block text-xs font-bold text-purple-600 uppercase mb-2">
                                Opções Extras (Separe por vírgula):
                              </label>
                              <input
                                type="text"
                                value={group.genComplements}
                                onChange={(e) =>
                                  setGroups(
                                    groups.map((g) =>
                                      g.id === group.id
                                        ? {
                                            ...g,
                                            genComplements: e.target.value,
                                          }
                                        : g,
                                    ),
                                  )
                                }
                                placeholder="Ex: Com Sensor, Sem Sensor, Sem Kit"
                                className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-400"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 items-end">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-purple-600 uppercase mb-1">
                              Preço Base (R$):
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
                            className="bg-purple-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                          >
                            Gerar Agora!
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {group.rows.map((row) => (
                        <div
                          key={row.id}
                          className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
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
                              className="w-full md:w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
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
                                placeholder="Opção Extra"
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
                            placeholder="Preço R$"
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
                            placeholder="Estoque"
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
                            placeholder="SKU (OpcIONAL)"
                            className="w-full md:w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveRowFromGroup(group.id, row.id)
                            }
                            disabled={group.rows.length === 1}
                            className="w-full md:w-auto p-2 text-red-400 disabled:opacity-30 flex justify-center"
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
                        className="mt-3 text-sm font-bold text-[#313b2f] bg-[#ffd639]/20 px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <FaPlusCircle /> Linha manual
                      </button>
                    )}
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
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-4 mt-8 bg-[#313b2f] text-white font-bold rounded-xl hover:bg-[#ffd639] hover:text-[#313b2f] shadow-lg flex items-center justify-center gap-3 text-lg disabled:opacity-70"
        >
          {isSaving ? (
            <>
              <FaSpinner className="animate-spin" /> Salvando...
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

export default AdminCreateProductPage;
