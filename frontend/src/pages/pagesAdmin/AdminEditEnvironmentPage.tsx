import React, { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import {
  FaSave,
  FaTrash,
  FaImage,
  FaHeading,
  FaStar,
  FaArrowLeft,
  FaPlus,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaImages,
  FaLink,
} from "react-icons/fa";
import axios from "axios";

// Interfaces
interface EnvironmentImage {
  id: number;
  url: string;
}

interface Environment {
  id: number;
  title: string;
  cover: string;
  images: EnvironmentImage[];
}

interface UpdateEnvironmentPayload {
  title: string;
  cover: string;
  images: string[];
}

const EditEnvironmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- Estados ---
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  // Galeria
  const [currentGalleryUrl, setCurrentGalleryUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // 1. Carregar Dados do Ambiente
  useEffect(() => {
    const fetchEnvironment = async () => {
      try {
        const response = await api.get(`/environments/${id}`);
        const env: Environment = response.data;

        setTitle(env.title);
        setCoverUrl(env.cover);
        setGalleryImages(env.images.map((img) => img.url));
      } catch (error) {
        console.error("Erro ao carregar ambiente:", error);
        setMessage({
          text: "Erro ao carregar dados do ambiente.",
          type: "error",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    if (id) {
      fetchEnvironment();
    }
  }, [id]);

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

  // --- Submissão (Update) ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    if (!title.trim() || !coverUrl.trim()) {
      setMessage({
        text: "Título e Imagem de Capa são obrigatórios.",
        type: "error",
      });
      setIsSaving(false);
      return;
    }

    const payload: UpdateEnvironmentPayload = {
      title: title.trim(),
      cover: coverUrl.trim(),
      images: galleryImages,
    };

    try {
      await api.put(`/environments/${id}`, payload);

      setMessage({
        text: `Ambiente atualizado com sucesso!`,
        type: "success",
      });
    } catch (error) {
      console.error(error);
      let errorMessage = "Erro ao atualizar ambiente.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <h1 className="text-xl font-bold text-[#313b2f]">
          Carregando Ambiente...
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 pt-24 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#313b2f]  flex items-center gap-3">
            <FaImage className="text-[#ffd639]" /> Editar Ambiente
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Atualize as informações do showroom.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold shadow-sm self-start md:self-auto"
        >
          <FaArrowLeft /> Voltar
        </button>
      </div>

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

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* --- COLUNA ESQUERDA: DADOS PRINCIPAIS --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#313b2f] mb-4 flex items-center gap-2 pb-2 border-b border-gray-50">
              <FaHeading className="text-gray-400" /> Informações Básicas
            </h2>

            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Título do Ambiente
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isSaving}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all"
                />
              </div>

              {/* Capa */}
              <div>
                <label className=" text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <FaStar className="text-gray-400" /> URL da Capa
                </label>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  required
                  disabled={isSaving}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all mb-3 text-sm"
                />
                {coverUrl && (
                  <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shadow-sm group relative">
                    <img
                      src={coverUrl}
                      alt="Capa Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botão Salvar (Desktop - Coluna Esquerda) */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 bg-[#ffd639] text-[#313b2f] font-bold rounded-xl hover:bg-[#e6c235] hover:-translate-y-1 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
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
        </div>

        {/* --- COLUNA DIREITA: GALERIA --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-[#313b2f] flex items-center gap-2">
                <FaImages className="text-gray-400" /> Galeria de Fotos
              </h2>
              <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-bold text-gray-500">
                {galleryImages.length} fotos
              </span>
            </div>

            <div className="flex gap-2 mb-6">
              <div className="flex-1 relative">
                <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={currentGalleryUrl}
                  onChange={(e) => setCurrentGalleryUrl(e.target.value)}
                  placeholder="Cole a URL da foto extra aqui..."
                  disabled={isSaving}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGalleryImage();
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleAddGalleryImage}
                disabled={!currentGalleryUrl || isSaving}
                className="px-4 py-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPlus /> <span className="hidden sm:inline">Adicionar</span>
              </button>
            </div>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryImages.map((img, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50"
                  >
                    <img
                      src={img}
                      alt={`Galeria ${index}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors shadow-lg transform translate-y-2 group-hover:translate-y-0 duration-300"
                        title="Remover"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
                <FaImages className="text-4xl mx-auto mb-2 opacity-30" />
                <p>Nenhuma foto na galeria.</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditEnvironmentPage;
