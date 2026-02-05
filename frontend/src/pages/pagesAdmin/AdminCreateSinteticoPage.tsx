import React, { useState, type FormEvent } from "react";
import { api } from "../../services/api";
import {
  FaCode,
  FaLink,
  FaSwatchbook,
  FaPalette,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaLayerGroup,
} from "react-icons/fa";
import { type VisualItem } from "../../types/visual-item";
import axios from "axios";
import { FaRug } from "react-icons/fa6";

type VisualItemType = VisualItem["type"];

// Mapeamento de cores para CSS (opcional, para preview visual)
const COLOR_MAP: Record<string, string> = {
  AMARELO: "#FFD700",
  AZUL: "#0000FF",
  BEGE: "#F5F5DC",
  BRANCO: "#FFFFFF",
  CINZA: "#808080",
  LARANJA: "#FFA500",
  LILAS: "#C8A2C8",
  MOSTARDA: "#FFDB58",
  ROSA: "#FFC0CB",
  TIFFANY: "#0ABAB5",
  VERDE: "#008000",
  VERMELHO: "#FF0000",
};

const COLORS = Object.keys(COLOR_MAP);

interface CreateSinteticoData {
  code: string;
  imageUrl: string;
  inStock: boolean;
  color: string | null;
  isExternal: boolean;
  isTapete: boolean;
  type: VisualItemType;
}

const AdminCreateSinteticoPage: React.FC = () => {
  const [code, setCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [color, setColor] = useState("");
  const [inStock, setInStock] = useState(true);
  const [isExternal, setIsExternal] = useState(false);
  const [isTapete, setIsTapete] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload: CreateSinteticoData = {
      code: code.trim(),
      imageUrl: imageUrl.trim(),
      color: color || null,
      inStock,
      isTapete,
      isExternal,
      type: "SINTETICO" as VisualItemType,
    };

    if (!payload.code || !payload.imageUrl) {
      setMessage({
        text: "Código e URL da Imagem são obrigatórios.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      await api.post("/visual-items", payload);

      setMessage({
        text: `Sintético "${payload.code}" criado com sucesso!`,
        type: "success",
      });

      setCode("");
      setImageUrl("");
      setColor("");
      setInStock(true);
      setIsExternal(false);
      setIsTapete(false);
    } catch (error) {
      console.error(error);
      let errorMessage = "Erro ao criar sintético.";
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
        {/* Header */}
        <div className="bg-[#313b2f] p-6 md:p-8 flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-full">
            <FaSwatchbook className="text-[#ffd639] text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Adicionar Novo Sintético
            </h1>
            <p className="text-gray-300 text-sm">
              Cadastre materiais sintéticos, tapetes e acabamentos.
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
            {/* Linha 1: Código e Cor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                  <FaCode className="text-gray-400" /> Código
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Ex: SINT-001"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                />
              </div>
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
                    {COLORS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {/* Bolinha de Preview da Cor */}
                  {color && (
                    <div
                      className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: COLOR_MAP[color] }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Linha 2: URL da Imagem */}
            <div>
              <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                <FaLink className="text-gray-400" /> URL da Imagem
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
                <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Img</span>
                  )}
                </div>
              </div>
            </div>

            {/* Linha 3: Opções (Checkboxes) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Em Estoque */}
              <div
                className={`flex items-center gap-3 px-4 py-3 bg-gray-50 border rounded-xl cursor-pointer transition-all ${inStock ? "border-green-200 bg-green-50 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                onClick={() => !loading && setInStock(!inStock)}
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${inStock ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`}
                >
                  {inStock && <FaCheckCircle className="text-white text-xs" />}
                </div>
                <span
                  className={`font-bold text-sm ${inStock ? "text-green-700" : "text-gray-500"}`}
                >
                  Em Estoque
                </span>
              </div>

              {/* Faz Externo */}
              <div
                className={`flex items-center gap-3 px-4 py-3 bg-gray-50 border rounded-xl cursor-pointer transition-all ${isExternal ? "border-blue-200 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                onClick={() => !loading && setIsExternal(!isExternal)}
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isExternal ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300"}`}
                >
                  {isExternal && (
                    <FaLayerGroup className="text-white text-xs" />
                  )}
                </div>
                <span
                  className={`font-bold text-sm ${isExternal ? "text-blue-700" : "text-gray-500"}`}
                >
                  Faz Externo
                </span>
              </div>

              {/* Apenas Tapete */}
              <div
                className={`flex items-center gap-3 px-4 py-3 bg-gray-50 border rounded-xl cursor-pointer transition-all ${isTapete ? "border-purple-200 bg-purple-50 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                onClick={() => !loading && setIsTapete(!isTapete)}
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isTapete ? "bg-purple-500 border-purple-500" : "bg-white border-gray-300"}`}
                >
                  {isTapete && <FaRug className="text-white text-xs" />}
                </div>
                <span
                  className={`font-bold text-sm ${isTapete ? "text-purple-700" : "text-gray-500"}`}
                >
                  É Tapete?
                </span>
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
                  <FaSwatchbook /> Salvar Sintético
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateSinteticoPage;
