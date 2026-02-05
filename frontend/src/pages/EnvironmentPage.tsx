import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  FaMapMarkerAlt,
  FaImages,
  FaSpinner,
  FaTimes,
  FaEdit,
  FaSearchPlus,
} from "react-icons/fa";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

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

const EnvironmentPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isAdmin = user?.role === "ADMIN" || user?.role === "DEV";

  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para o Zoom/Pan
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const fetchEnvironments = async () => {
      try {
        const response = await api.get("/environments");
        setEnvironments(response.data);
        if (response.data.length > 0) {
          setSelectedEnv(response.data[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar ambientes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnvironments();
  }, []);

  const closePreview = () => {
    setPreviewImage(null);
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
    setHasMoved(false);
  };

  // --- LÓGICA DE ZOOM E ARRASTO ---
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMoved) {
      setHasMoved(false);
      return;
    }
    if (isZoomed) {
      setIsZoomed(false);
      setPosition({ x: 0, y: 0 });
    } else {
      setIsZoomed(true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    e.preventDefault();
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isZoomed) return;
    e.preventDefault();
    setHasMoved(true);
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <h1 className="text-xl font-bold text-[#313b2f]">
          Carregando Showroom...
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 pt-[70px] md:pt-[80px]">
      {/* --- SIDEBAR (Lista de Ambientes) --- */}
      <aside className="w-full md:w-80 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col h-[300px] md:h-[calc(100vh-80px)] md:sticky md:top-20">
        <div className="p-6 bg-[#313b2f] text-white">
          <h2 className="text-2xl font-bold font-[Poppins] flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#ffd639]" /> Ambientes
          </h2>
          <p className="text-gray-300 text-sm mt-1">Escolha uma inspiração</p>
        </div>

        <ul className="flex-1 overflow-y-auto custom-scrollbar">
          {environments.map((env) => (
            <li
              key={env.id}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-b border-gray-100 hover:bg-gray-50 ${
                selectedEnv?.id === env.id
                  ? "bg-yellow-50 border-l-4 border-l-[#ffd639]"
                  : "border-l-4 border-l-transparent"
              }`}
              onClick={() => setSelectedEnv(env)}
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">
                <img
                  src={env.cover}
                  alt={env.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-bold truncate ${selectedEnv?.id === env.id ? "text-[#313b2f]" : "text-gray-700"}`}
                >
                  {env.title}
                </h3>
                <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <FaImages /> {env.images ? env.images.length : 0} fotos
                </span>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* --- ÁREA PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-80px)]">
        {selectedEnv ? (
          <div className="animate-in fade-in duration-500">
            {/* HERO / CAPA */}
            <div className="relative h-64 md:h-96 w-full group overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${selectedEnv.cover})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold font-[Poppins] mb-2 shadow-sm">
                    {selectedEnv.title}
                  </h1>
                  <p className="text-gray-200 flex items-center gap-2 text-sm md:text-base">
                    <FaMapMarkerAlt className="text-[#ffd639]" /> Visualizando
                    Galeria Completa
                  </p>
                </div>

                {isAdmin && (
                  <button
                    onClick={() =>
                      navigate(`/admin/ambientes/edit/${selectedEnv.id}`)
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/50 rounded-lg text-white transition-all font-bold text-sm"
                  >
                    <FaEdit /> Editar
                  </button>
                )}
              </div>
            </div>

            {/* GRID DA GALERIA */}
            <div className="p-6 md:p-10">
              <h3 className="text-xl font-bold text-[#313b2f] mb-6 border-b border-gray-200 pb-2 flex items-center gap-2">
                <FaImages className="text-gray-400" /> Galeria de Detalhes
              </h3>

              {selectedEnv.images && selectedEnv.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {selectedEnv.images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square bg-gray-200 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all"
                      onClick={() => setPreviewImage(img.url)}
                    >
                      <img
                        src={img.url}
                        alt="Detalhe"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      {/* Overlay Hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md border border-white/40 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <FaSearchPlus /> Ampliar
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-100 rounded-xl border border-dashed border-gray-300 text-gray-500">
                  Nenhuma foto adicional neste ambiente.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaMapMarkerAlt className="text-6xl mb-4 opacity-20" />
            <p className="text-lg">
              Selecione um ambiente ao lado para visualizar.
            </p>
          </div>
        )}
      </main>

      {/* --- LIGHTBOX (MODAL DE ZOOM) --- */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center overflow-hidden animate-in fade-in duration-200"
          onClick={closePreview}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Botão Fechar */}
          <button
            className="absolute top-4 right-4 z-[110] text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
            onClick={(e) => {
              e.stopPropagation();
              closePreview();
            }}
          >
            <FaTimes size={24} />
          </button>

          {/* Dica de Uso */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm pointer-events-none bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
            {isZoomed
              ? "Arraste para mover • Clique para reduzir"
              : "Clique para dar zoom"}
          </div>

          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={previewImage}
              alt="Visualização"
              className="max-w-none max-h-none transition-transform duration-300 ease-out select-none"
              onMouseDown={handleMouseDown}
              onClick={handleImageClick}
              style={{
                // Lógica de estilo inline mantida para performance do arrasto
                transform: isZoomed
                  ? `translate(${position.x}px, ${position.y}px) scale(2.5)`
                  : `translate(0, 0) scale(1)`,
                transition: isDragging ? "none" : "transform 0.3s ease-out",
                cursor: isZoomed
                  ? isDragging
                    ? "grabbing"
                    : "grab"
                  : "zoom-in",
                maxHeight: isZoomed ? "none" : "90vh",
                maxWidth: isZoomed ? "none" : "90vw",
                objectFit: "contain",
              }}
              draggable="false"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentPage;
