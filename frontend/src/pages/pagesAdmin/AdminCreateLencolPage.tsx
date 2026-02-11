import React, { useState, type FormEvent } from "react";
import {
  FaCode,
  FaLink,
  FaSwatchbook,
  FaPalette,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaBed,
  FaRulerCombined,
  FaBoxOpen,
  FaTag,
} from "react-icons/fa";
import { ItemColor, ItemSize, VisualItemType } from "../../types/visual-item";
import axios from "axios";
import { api } from "../../services/api";

// Mapeamento de cores para preview visual (igual ao seu exemplo)
const COLOR_MAP: Record<string, string> = {
  AMARELO: "#FFD700",
  AZUL: "#0000FF",
  AZULAZ3: "#0047AB", // Exemplo de azul específico
  AZULBEBE: "#89CFF0",
  BEGE: "#F5F5DC",
  BRANCO: "#FFFFFF",
  CINZA: "#808080",
  LARANJA: "#FFA500",
  LILAS: "#C8A2C8",
  MOSTARDA: "#FFDB58",
  PRATA: "#C0C0C0",
  ROSA: "#FFC0CB",
  ROSABEBE: "#FFB6C1",
  TIFFANY: "#0ABAB5",
  VERDE: "#008000",
  VERMELHO: "#FF0000",
};

interface CreateLencolData {
  name: string;
  code: string;
  imageUrl: string;
  color: ItemColor | null;
  size: ItemSize | null;
  quantity: number;
  inStock: boolean;
  type: VisualItemType;
}

const AdminCreateLencolPage: React.FC = () => {
  // Estados do Formulário
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [color, setColor] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [inStock, setInStock] = useState(true);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validação básica
    if (!code || !imageUrl) {
      setMessage({
        text: "Código e URL da Imagem são obrigatórios.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    const payload: CreateLencolData = {
      name: name.trim(),
      code: code.trim(),
      imageUrl: imageUrl.trim(),
      color: color ? (color as ItemColor) : null,
      size: size ? (size as ItemSize) : null,
      quantity: Number(quantity),
      inStock,
      type: VisualItemType.LENCOL, // Enum corrigido
    };

    try {
      // Usando api.post diretamente conforme seu padrão
      await api.post("/visual-items", payload); // Ajuste se a rota for /visual-item (singular)

      setMessage({
        text: `Lençol "${payload.code}" criado com sucesso!`,
        type: "success",
      });

      // Resetar form
      setName("");
      setCode("");
      setImageUrl("");
      setColor("");
      setSize("");
      setQuantity(1);
      setInStock(true);
    } catch (error) {
      console.error(error);
      let errorMessage = "Erro ao criar lençol.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pt-24 pb-20">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header - Estilo igual ao Sintético (Verde Escuro + Amarelo) */}
        <div className="bg-[#313b2f] p-6 md:p-8 flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-full">
            <FaBed className="text-[#ffd639] text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Adicionar Novo Lençol
            </h1>
            <p className="text-gray-300 text-sm">
              Cadastre lençóis para o catálogo de pronta entrega.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Mensagem de Feedback */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <FaCheckCircle />
              ) : (
                <FaExclamationCircle />
              )}
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Linha 1: Nome e Código */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                  <FaTag className="text-gray-400" /> Nome (Opcional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  placeholder="Ex: Lençol Azul Bebê com Elástico"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                  <FaCode className="text-gray-400" /> Código (SKU) *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Ex: LEN-001"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                />
              </div>
            </div>

            {/* Linha 2: Cor e Tamanho */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                  <FaPalette className="text-gray-400" /> Cor Predominante
                </label>
                <div className="relative">
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700 appearance-none cursor-pointer"
                  >
                    <option value="">Selecione uma cor (Opcional)</option>
                    {Object.keys(ItemColor).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {/* Preview da Cor */}
                  {color && COLOR_MAP[color] && (
                    <div
                      className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: COLOR_MAP[color] }}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                  <FaRulerCombined className="text-gray-400" /> Tamanho
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700 appearance-none cursor-pointer"
                >
                  <option value="">Selecione um tamanho (Opcional)</option>
                  {Object.keys(ItemSize).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Linha 3: URL da Imagem */}
            <div>
              <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                <FaLink className="text-gray-400" /> URL da Imagem *
              </label>
              <div className="flex gap-4">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="https://..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                />
                {/* Preview Thumbnail */}
                <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = "")} // Fallback se erro
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Img</span>
                  )}
                </div>
              </div>
            </div>

            {/* Linha 4: Estoque e Quantidade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Input Quantidade */}
              <div>
                <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                  <FaBoxOpen className="text-gray-400" /> Quantidade
                </label>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                />
              </div>

              {/* Checkbox Em Estoque */}
              <div style={{ marginTop: "24px" }}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 bg-gray-50 border rounded-xl cursor-pointer transition-all ${inStock ? "border-green-200 bg-green-50 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                  onClick={() => !loading && setInStock(!inStock)}
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${inStock ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`}
                  >
                    {inStock && (
                      <FaCheckCircle className="text-white text-xs" />
                    )}
                  </div>
                  <span
                    className={`font-bold text-sm ${inStock ? "text-green-700" : "text-gray-500"}`}
                  >
                    Disponível em Estoque
                  </span>
                </div>
              </div>
            </div>

            {/* Botão Salvar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#ffd639] text-[#313b2f] font-bold rounded-xl hover:bg-[#e6c235] hover:-translate-y-1 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <FaSwatchbook /> Salvar Lençol
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateLencolPage;
