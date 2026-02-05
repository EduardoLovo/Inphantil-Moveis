import React, { useEffect, useState, useMemo } from "react";
import { api } from "../services/api";
import {
  FaSearch,
  FaUndo,
  FaMagic,
  FaLayerGroup,
  FaImage,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import type { VisualItem } from "../types/visual-item";

const ComposicaoLencolPage: React.FC = () => {
  // Estados de Dados
  const [apliques, setApliques] = useState<VisualItem[]>([]);
  const [apliqueCode, setApliqueCode] = useState<string>("");
  const [tecidos, setTecidos] = useState<VisualItem[]>([]);
  const [tecidoCode, setTecidoCode] = useState<string>("");

  // Estados de Seleção
  const [tecidoSelecionado, setTecidoSelecionado] = useState<string | null>(
    null,
  );
  const [apliqueSelecionado, setApliqueSelecionado] = useState<string | null>(
    null,
  );

  // Estados de Controle
  const [etapa, setEtapa] = useState<
    "ESCOLHA_TECIDO" | "ESCOLHA_APLIQUE" | "RESULTADO"
  >("ESCOLHA_TECIDO");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Busca Dados Iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [resTecidos, resApliques] = await Promise.all([
          api.get("/visual-items", { params: { type: "TECIDO" } }),
          api.get("/visual-items", { params: { type: "APLIQUE" } }),
        ]);

        setTecidos(resTecidos.data);
        setApliques(resApliques.data);
      } catch (err) {
        setError("Erro ao carregar catálogo. Verifique sua conexão.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Filtros e Ordenação
  const apliquesFiltrados = useMemo(() => {
    const filtrados = apliques.filter(
      (item) =>
        item.code.toLowerCase().includes(busca.toLowerCase()) ||
        item.name.toLowerCase().includes(busca.toLowerCase()),
    );
    return filtrados.sort((a, b) => a.code.localeCompare(b.code));
  }, [apliques, busca]);

  const tecidosOrdenados = useMemo(() => {
    return [...tecidos].sort((a, b) => a.code.localeCompare(b.code));
  }, [tecidos]);

  // 3. Handlers
  const handleSelectTecido = (url: string, code: string) => {
    setTecidoSelecionado(url);
    setTecidoCode(code);
    setEtapa("ESCOLHA_APLIQUE");
    window.scrollTo({ top: 260, behavior: "smooth" });
  };

  const handleSelectAplique = (url: string, code: string) => {
    setApliqueSelecionado(url);
    setApliqueCode(code);
    setEtapa("RESULTADO");
    window.scrollTo({ top: 260, behavior: "smooth" });
  };

  const resetar = () => {
    setTecidoSelecionado(null);
    setApliqueSelecionado(null);
    setTecidoCode("");
    setApliqueCode("");
    setEtapa("ESCOLHA_TECIDO");
    setBusca("");
  };

  // 4. Renderização Condicional de Loading/Erro
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <h1 className="text-xl font-bold text-[#313b2f]">
          Carregando simulador...
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
        className={`flex flex-col items-center ${etapa === "ESCOLHA_TECIDO" ? "text-[#313b2f] font-bold" : "text-gray-400"}`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${etapa === "ESCOLHA_TECIDO" ? "bg-[#ffd639] text-[#313b2f]" : "bg-gray-200"}`}
        >
          1
        </div>
        <span className="text-sm">Tecido</span>
      </div>

      <div
        className={`h-1 w-16 md:w-32 mx-2 rounded ${etapa !== "ESCOLHA_TECIDO" ? "bg-[#ffd639]" : "bg-gray-200"}`}
      />

      <div
        className={`flex flex-col items-center ${etapa === "ESCOLHA_APLIQUE" ? "text-[#313b2f] font-bold" : "text-gray-400"}`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${etapa === "ESCOLHA_APLIQUE" ? "bg-[#ffd639] text-[#313b2f]" : etapa === "RESULTADO" ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          2
        </div>
        <span className="text-sm">Aplique</span>
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
          <FaMagic className="text-[#ffd639]" /> Simulador de Composições
        </h1>
        <p className="text-gray-500 text-lg">
          Crie combinações únicas visualizando tecidos e apliques juntos.
        </p>
      </div>

      {/* Steps */}
      <StepIndicator />

      {/* --- ETAPA 1: ESCOLHA TECIDO --- */}
      {etapa === "ESCOLHA_TECIDO" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-[#313b2f] flex items-center justify-center gap-2">
              <FaLayerGroup /> Escolha o Tecido de Fundo
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {tecidosOrdenados.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => handleSelectTecido(item.imageUrl, item.code)}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
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

      {/* --- ETAPA 2: ESCOLHA APLIQUE --- */}
      {etapa === "ESCOLHA_APLIQUE" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-[#313b2f] flex items-center justify-center gap-2 mb-6">
              <FaImage /> Escolha o Aplique
            </h2>

            {/* Barra de Busca */}
            <div className="relative w-full max-w-md mx-auto">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar código do aplique..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all text-gray-700"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {apliquesFiltrados.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => handleSelectAplique(item.imageUrl, item.code)}
              >
                <div className="aspect-[3/4] p-4 flex items-center justify-center bg-gray-50">
                  <img
                    src={item.imageUrl}
                    alt={item.code}
                    className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
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

          {apliquesFiltrados.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhum aplique encontrado para "{busca}".
            </div>
          )}
        </div>
      )}

      {/* --- ETAPA 3: RESULTADO --- */}
      {etapa === "RESULTADO" && tecidoSelecionado && apliqueSelecionado && (
        <div className="animate-in zoom-in-95 duration-500 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-[#313b2f] p-6 text-center">
              <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <FaCheckCircle className="text-[#ffd639]" /> Resultado da
                Composição
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                Confira como o aplique se destaca no tecido escolhido.
              </p>
            </div>

            <div className="p-8">
              {/* ÁREA DAS IMAGENS UNIFICADAS */}
              <div className="flex justify-center mb-10">
                {/* Container Único: 
                                    - Removemos o gap
                                    - Aplicamos o rounded e shadow no pai, não nos filhos
                                */}
                <div className="flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden border-4 border-white ring-1 ring-gray-200">
                  {/* LADO ESQUERDO: TECIDO */}
                  <div className="relative w-64 h-64 md:w-96 md:h-96 group">
                    <img
                      src={tecidoSelecionado}
                      alt="Fundo"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay Sutil ao passar o mouse */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                    {/* Etiqueta Flutuante Interna */}
                    <span className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
                      Fundo:{" "}
                      <strong className="text-[#ffd639]">{tecidoCode}</strong>
                    </span>
                  </div>

                  {/* LADO DIREITO: APLIQUE */}
                  <div className="relative w-64 h-64 md:w-96 md:h-96 bg-gray-50 group border-t md:border-t-0 md:border-l border-gray-100">
                    <img
                      src={apliqueSelecionado}
                      alt="Aplique"
                      className="w-full h-full object-cover drop-shadow-xl  "
                    />

                    {/* Etiqueta Flutuante Interna */}
                    <span className="absolute bottom-4 right-4 bg-white/90 text-gray-800 text-xs px-3 py-1.5 rounded-full backdrop-blur-md border border-gray-200 shadow-lg">
                      Aplique:{" "}
                      <strong className="text-purple-600">{apliqueCode}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={resetar}
                  className="flex items-center gap-2 px-8 py-3 bg-[#313b2f] hover:bg-gray-800 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <FaUndo /> Criar Nova Composição
                </button>
              </div>

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

export default ComposicaoLencolPage;
