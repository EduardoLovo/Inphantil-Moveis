import React, { useState, type FormEvent } from "react";
import { api } from "../../services/api";
import {
  FaCube,
  FaCode,
  FaLink,
  FaLayerGroup,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaCheck,
} from "react-icons/fa";
import { type VisualItem } from "../../types/visual-item";
import axios from "axios";

type VisualItemType = VisualItem["type"];

interface CreateTecidoData {
  code: string;
  imageUrl: string;
  quantity: number | null;
  inStock: boolean;
  type: VisualItemType;
}

const AdminCreateTecidoPage: React.FC = () => {
  const [code, setCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [quantity, setQuantity] = useState<number | null>(null);
  const [inStock, setInStock] = useState(true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload: CreateTecidoData = {
      code: code.trim(),
      imageUrl: imageUrl.trim(),
      quantity: quantity !== null ? quantity : 0,
      inStock: inStock,
      type: "TECIDO" as VisualItemType,
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
        text: `Tecido "${payload.code}" adicionado com sucesso!`,
        type: "success",
      });

      setCode("");
      setImageUrl("");
      setQuantity(null);
      setInStock(true);
    } catch (error) {
      console.error(error);
      let errorMessage = "Erro ao criar tecido.";
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
            <FaLayerGroup className="text-[#ffd639] text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white ">
              Adicionar Novo Tecido
            </h1>
            <p className="text-gray-300 text-sm">
              Cadastre um novo tecido para o catálogo de demonstração.
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
            {/* Código e Nome */}
            <div>
              <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                <FaCode className="text-gray-400" /> Código / Nome do Tecido
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                disabled={loading}
                placeholder="Ex: Algodão 200 Fios Bege"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700"
              />
            </div>

            {/* URL da Imagem */}
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

            {/* Quantidade e Estoque */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                  <FaCube className="text-gray-400" /> Quantidade (Metros/Unid)
                </label>
                <input
                  type="number"
                  value={quantity === null ? "" : quantity}
                  onChange={(e) =>
                    setQuantity(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  min="0"
                  disabled={loading}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                />
              </div>

              <div
                className={`flex items-center gap-3 px-4 py-3 bg-gray-50 border rounded-xl cursor-pointer transition-all h-[52px] ${inStock ? "border-green-200 bg-green-50 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                onClick={() => !loading && setInStock(!inStock)}
              >
                <div
                  className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${inStock ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`}
                >
                  {inStock && <FaCheck className="text-white text-xs" />}
                </div>
                <span
                  className={`font-bold text-sm ${inStock ? "text-green-700" : "text-gray-500"}`}
                >
                  Disponível em Estoque
                </span>
              </div>
            </div>

            {/* Botão Salvar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#ffd639] text-[#313b2f] font-bold rounded-xl hover:bg-[#e6c235] hover:-translate-y-1 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <FaLayerGroup /> Salvar Tecido
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateTecidoPage;
