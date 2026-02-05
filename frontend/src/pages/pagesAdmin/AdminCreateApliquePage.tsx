import React, { useState, type FormEvent } from "react";
import { api } from "../../services/api";
import {
  FaPlus,
  FaCube,
  FaSortNumericUp,
  FaCode,
  FaLink,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaTag,
} from "react-icons/fa";
import { type VisualItem } from "../../types/visual-item";
import axios from "axios";

type VisualItemType = VisualItem["type"];

interface CreateApliqueData {
  code: string;
  name: string;
  imageUrl: string;
  quantity: number | null;
  sequence: number | null;
  inStock: boolean;
  type: VisualItemType;
}

const AdminCreateApliquePage: React.FC = () => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [quantity, setQuantity] = useState<number | null>(null);
  const [sequence, setSequence] = useState<number | null>(null);
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

    const payload: CreateApliqueData = {
      code: code.trim(),
      name: name.trim(),
      imageUrl: imageUrl.trim(),
      quantity: quantity !== null ? quantity : 0,
      sequence: sequence !== null ? sequence : 0,
      inStock: inStock,
      type: "APLIQUE" as VisualItemType,
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
        text: `Aplique "${payload.code}" criado com sucesso!`,
        type: "success",
      });

      setCode("");
      setName("");
      setImageUrl("");
      setQuantity(null);
      setSequence(null);
      setInStock(true);
    } catch (error) {
      console.error(error);
      let errorMessage = "Erro ao criar aplique.";
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
            <FaPlus className="text-[#ffd639] text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white ">
              Adicionar Novo Aplique
            </h1>
            <p className="text-gray-300 text-sm">
              Preencha os detalhes para cadastrar um novo item decorativo.
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
            {/* Linha 1: Código e Nome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {/* CORREÇÃO: Removido 'block', mantido 'flex' */}
                <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                  <FaCode className="text-gray-400" /> Código Único
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Ex: APL-001"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                />
              </div>
              <div>
                {/* CORREÇÃO: Removido 'block', mantido 'flex' */}
                <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                  <FaTag className="text-gray-400" /> Nome (Descrição)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Ex: Coroa Dourada"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                />
              </div>
            </div>

            {/* Linha 2: URL da Imagem */}
            <div>
              {/* CORREÇÃO: Removido 'block', mantido 'flex' */}
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

            {/* Linha 3: Quantidade, Sequência e Checkbox */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                {/* CORREÇÃO: Removido 'block', mantido 'flex' */}
                <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                  <FaCube className="text-gray-400" /> Quantidade
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

              <div>
                {/* CORREÇÃO: Removido 'block', mantido 'flex' */}
                <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                  <FaSortNumericUp className="text-gray-400" /> Sequência
                </label>
                <input
                  type="number"
                  value={sequence === null ? "" : sequence}
                  onChange={(e) =>
                    setSequence(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  disabled={loading}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                />
              </div>

              <div
                className={`flex items-center gap-3 px-4 py-3 bg-gray-50 border rounded-xl cursor-pointer transition-colors h-[50px] ${inStock ? "border-green-200 bg-green-50" : "border-gray-200"}`}
                onClick={() => !loading && setInStock(!inStock)}
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${inStock ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`}
                >
                  {inStock && <FaPlus className="text-white text-xs" />}
                </div>
                <span
                  className={`font-bold text-sm ${inStock ? "text-green-700" : "text-gray-500"}`}
                >
                  Em Estoque
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
                  <FaSpinner className="animate-spin" /> Cadastrando...
                </>
              ) : (
                <>
                  <FaPlus /> Cadastrar Aplique
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateApliquePage;
