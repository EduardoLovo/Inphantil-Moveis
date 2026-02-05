import React, { useState, type FormEvent } from "react";
import { api } from "../../services/api";
import {
  FaPlus,
  FaTrash,
  FaImage,
  FaHeading,
  FaStar,
  FaLink,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";

// Interface do Payload
interface CreateEnvironmentPayload {
  title: string;
  cover: string;
  images: string[];
}

const AdminCreateEnvironmentPage: React.FC = () => {
  // --- Estados ---
  const [title, setTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  // Estado para a Galeria
  const [currentGalleryUrl, setCurrentGalleryUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // --- Handlers de Imagem ---
  const handleAddGalleryImage = () => {
    const url = currentGalleryUrl.trim();
    if (url && !galleryImages.includes(url)) {
      setGalleryImages([...galleryImages, url]);
      setCurrentGalleryUrl("");
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  // --- Submissão ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validação simples
    if (!title.trim() || !coverUrl.trim()) {
      setMessage({
        text: "Título e Imagem de Capa são obrigatórios.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    const payload: CreateEnvironmentPayload = {
      title: title.trim(),
      cover: coverUrl.trim(),
      images: galleryImages,
    };

    try {
      await api.post("/environments", payload);

      setMessage({
        text: `Ambiente "${payload.title}" criado com sucesso!`,
        type: "success",
      });

      // Limpar formulário
      setTitle("");
      setCoverUrl("");
      setGalleryImages([]);
      setCurrentGalleryUrl("");
    } catch (error) {
      console.error(error);
      let errorMessage = "Erro ao criar ambiente.";
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
            <FaImage className="text-[#ffd639] text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white ">
              Novo Ambiente (Showroom)
            </h1>
            <p className="text-gray-300 text-sm">
              Crie um ambiente inspiracional com uma capa e uma galeria de
              fotos.
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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* SEÇÃO 1: DADOS PRINCIPAIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título */}
              <div>
                <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                  <FaHeading className="text-gray-400" /> Título do Ambiente
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Quarto Safari Baby"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                />
              </div>

              {/* Capa */}
              <div>
                <label className="text-sm font-bold text-[#313b2f] mb-1 flex items-center gap-2">
                  <FaStar className="text-gray-400" /> URL da Capa (Principal)
                </label>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                />
                {/* Preview da Capa */}
                {coverUrl && (
                  <div className="mt-3 w-full h-40 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={coverUrl}
                      alt="Capa Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* SEÇÃO 2: GALERIA DE FOTOS */}
            <div>
              <h3 className="text-lg font-bold text-[#313b2f] mb-4 flex items-center gap-2">
                <FaImage className="text-[#ffd639]" /> Galeria de Fotos Internas
              </h3>

              <div className="flex gap-2 mb-6">
                <div className="flex-1">
                  <label className="sr-only">URL da Imagem</label>
                  <div className="relative">
                    <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      value={currentGalleryUrl}
                      onChange={(e) => setCurrentGalleryUrl(e.target.value)}
                      placeholder="Cole a URL da imagem aqui..."
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddGalleryImage();
                        }
                      }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  disabled={!currentGalleryUrl || loading}
                  className="px-6 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPlus /> <span className="hidden sm:inline">Adicionar</span>
                </button>
              </div>

              {/* Grid de Imagens Adicionadas */}
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  {galleryImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm"
                    >
                      <img
                        src={img}
                        alt={`Galeria ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          title="Remover imagem"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                  Nenhuma imagem adicionada à galeria ainda.
                </div>
              )}
            </div>

            {/* Botão Salvar Final */}
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
                  <FaCheckCircle /> Criar Ambiente
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateEnvironmentPage;
