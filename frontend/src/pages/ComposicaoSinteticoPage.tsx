import React, { useEffect, useState, useMemo } from "react";
import { api } from "../services/api";
import {
  FaSearch,
  FaUndo,
  FaSwatchbook,
  FaSpinner,
  FaLayerGroup,
  FaDotCircle,
  FaCheckCircle,
} from "react-icons/fa";
import type { VisualItem } from "../types/visual-item";

const ComposicaoSinteticoPage: React.FC = () => {
  // Estados de Dados
  const [sinteticos, setSinteticos] = useState<VisualItem[]>([]);

  // Estados de Seleção
  const [externoSelecionado, setExternoSelecionado] =
    useState<VisualItem | null>(null);
  const [internoSelecionado, setInternoSelecionado] =
    useState<VisualItem | null>(null);

  // Estados de Controle
  const [etapa, setEtapa] = useState<
    "ESCOLHA_EXTERNO" | "ESCOLHA_INTERNO" | "RESULTADO"
  >("ESCOLHA_EXTERNO");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Busca Dados Iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/visual-items", {
          params: { type: "SINTETICO" },
        });
        setSinteticos(response.data);
      } catch (err) {
        setError("Erro ao carregar materiais sintéticos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Filtra Listas (Memoizado)
  const materiaisExternos = useMemo(() => {
    return sinteticos
      .filter((item) => item.isExternal === true && item.inStock)
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [sinteticos]);

  const materiaisInternos = useMemo(() => {
    return sinteticos
      .filter((item) => {
        const matchesSearch = item.code
          .toLowerCase()
          .includes(busca.toLowerCase());
        return item.inStock && matchesSearch;
      })
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [sinteticos, busca]);

  // 3. Handlers
  const handleSelectExterno = (item: VisualItem) => {
    setExternoSelecionado(item);
    setEtapa("ESCOLHA_INTERNO");
    window.scrollTo({ top: 260, behavior: "smooth" });
  };

  const handleSelectInterno = (item: VisualItem) => {
    setInternoSelecionado(item);
    setEtapa("RESULTADO");
    window.scrollTo({ top: 260, behavior: "smooth" });
  };

  const resetar = () => {
    setExternoSelecionado(null);
    setInternoSelecionado(null);
    setEtapa("ESCOLHA_EXTERNO");
    setBusca("");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <h1 className="text-xl font-bold text-[#313b2f]">
          Carregando materiais...
        </h1>
      </div>
    );

  if (error)
    return (
      <div className="w-full max-w-4xl mx-auto p-8 mt-20">
        <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center shadow-sm">
          <h1 className="text-lg font-bold mb-2">Ops! Algo deu errado.</h1>
          <p>{error}</p>
        </div>
      </div>
    );

  // Componente de Barra de Progresso
  const StepIndicator = () => (
    <div className="flex justify-center items-center mb-12 w-full max-w-3xl mx-auto">
      <div
        className={`flex flex-col items-center ${etapa === "ESCOLHA_EXTERNO" ? "text-[#313b2f] font-bold" : "text-gray-400"}`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${etapa === "ESCOLHA_EXTERNO" ? "bg-[#ffd639] text-[#313b2f]" : "bg-gray-200"}`}
        >
          1
        </div>
        <span className="text-sm">Externo</span>
      </div>

      <div
        className={`h-1 w-16 md:w-32 mx-2 rounded ${etapa !== "ESCOLHA_EXTERNO" ? "bg-[#ffd639]" : "bg-gray-200"}`}
      />

      <div
        className={`flex flex-col items-center ${etapa === "ESCOLHA_INTERNO" ? "text-[#313b2f] font-bold" : "text-gray-400"}`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${etapa === "ESCOLHA_INTERNO" ? "bg-[#ffd639] text-[#313b2f]" : etapa === "RESULTADO" ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          2
        </div>
        <span className="text-sm">Interno</span>
      </div>

      <div
        className={`h-1 w-16 md:w-32 mx-2 rounded ${etapa === "RESULTADO" ? "bg-[#ffd639]" : "bg-gray-200"}`}
      />

      <div
        className={`flex flex-col items-center ${etapa === "RESULTADO" ? "text-[#313b2f] font-bold" : "text-gray-400"}`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${etapa === "RESULTADO" ? "bg-[#ffd639] text-[#313b2f]" : "bg-gray-200"}`}
        >
          3
        </div>
        <span className="text-sm">Resultado</span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 py-8 md:pt-32 pb-20 font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-bold text-[#313b2f] mb-3">
          <FaSwatchbook className="text-[#ffd639]" /> Simulador de Sintéticos
        </h1>
        <p className="text-gray-500 text-lg">
          Combine cores e texturas para personalizar seu produto.
        </p>
      </div>

      {/* Steps */}
      <StepIndicator />

      {/* --- ETAPA 1: ESCOLHA EXTERNO --- */}
      {etapa === "ESCOLHA_EXTERNO" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-[#313b2f] flex items-center justify-center gap-2">
              <FaLayerGroup /> Escolha o Material Externo
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {materiaisExternos.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => handleSelectExterno(item)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.code}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 text-center bg-white relative z-10 border-t border-gray-50">
                  <p className="font-bold text-[#313b2f] group-hover:text-[#ffd639] transition-colors">
                    {item.code}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- ETAPA 2: ESCOLHA INTERNO --- */}
      {etapa === "ESCOLHA_INTERNO" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-[#313b2f] flex items-center justify-center gap-2 mb-6">
              <FaDotCircle /> Escolha o Material Interno
            </h2>

            {/* Barra de Busca */}
            <div className="relative w-full max-w-md mx-auto">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar código..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all text-gray-700"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {materiaisInternos.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => handleSelectInterno(item)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.code}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 text-center bg-white border-t border-gray-50">
                  <p className="font-bold text-[#313b2f] group-hover:text-[#ffd639] transition-colors">
                    {item.code}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {materiaisInternos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhum material encontrado para "{busca}".
            </div>
          )}
        </div>
      )}

      {/* --- ETAPA 3: RESULTADO --- */}
      {etapa === "RESULTADO" && externoSelecionado && internoSelecionado && (
        <div className="animate-in zoom-in-95 duration-500 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-[#313b2f] p-6 text-center">
              <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <FaCheckCircle className="text-[#ffd639]" /> Resultado da
                Composição
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                Visualização simulada do produto final.
              </p>
            </div>

            <div className="p-8 flex flex-col items-center">
              {/* CAIXA DE PREVIEW (QUADRADA) */}
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gray-200 mb-8">
                {/* 1. Fundo (Externo) */}
                <img
                  src={externoSelecionado.imageUrl}
                  alt="Externo"
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* 2. Frente (Interno) - Recorte Circular */}
                <div
                  className="absolute inset-0 z-10 w-full h-full bg-white"
                  style={{ clipPath: "circle(35% at 50% 50%)" }}
                >
                  <img
                    src={internoSelecionado.imageUrl}
                    alt="Interno"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Etiquetas Flutuantes */}
                <span className="absolute top-4 left-4 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm z-20 border border-white/20">
                  Externo
                </span>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 text-gray-800 text-[10px] px-2 py-1 rounded backdrop-blur-sm z-20 font-bold shadow-sm">
                  Interno
                </span>
              </div>

              {/* Detalhes dos Códigos */}
              <div className="flex gap-4 mb-8 text-center">
                <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                  <span className="block text-xs text-gray-500 uppercase font-bold">
                    Externo
                  </span>
                  <strong className="text-[#313b2f]">
                    {externoSelecionado.code}
                  </strong>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                  <span className="block text-xs text-gray-500 uppercase font-bold">
                    Interno
                  </span>
                  <strong className="text-[#313b2f]">
                    {internoSelecionado.code}
                  </strong>
                </div>
              </div>

              <button
                onClick={resetar}
                className="flex items-center gap-2 px-8 py-3 bg-[#313b2f] hover:bg-gray-800 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <FaUndo /> Criar Nova Combinação
              </button>

              <p className="text-center text-xs text-gray-400 mt-6">
                * As cores podem variar ligeiramente dependendo da calibração do
                seu monitor.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComposicaoSinteticoPage;
