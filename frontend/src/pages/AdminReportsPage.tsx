import React, { useState } from "react";
import { downloadRelatorioCotacoes } from "../services/api";

export const AdminReportsPage = () => {
  const [loadingCotacoes, setLoadingCotacoes] = useState(false);

  const handleDownloadCotacoes = async () => {
    try {
      setLoadingCotacoes(true);
      const blob = await downloadRelatorioCotacoes();

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "relatorio-cotacoes.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar relatório:", error);
      alert("Erro ao gerar relatório de cotações.");
    } finally {
      setLoadingCotacoes(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabeçalho da Página */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Central de Relatórios
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Selecione o relatório que deseja exportar para o Excel.
        </p>
      </div>

      {/* Grid de Cards de Relatórios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Relatório de Cotações */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Cotações de Frete
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Exporta o histórico de cotações contendo Estado, Transportadora,
              Valor do Pedido e Valor do Frete.
            </p>
          </div>

          <button
            onClick={handleDownloadCotacoes}
            disabled={loadingCotacoes}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {/* Ícone de Download (Opcional, usando SVG básico) */}
            <svg
              className="mr-2 -ml-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {loadingCotacoes ? "Gerando..." : "Baixar Excel"}
          </button>
        </div>

        {/* Card 2: Exemplo para o Futuro (Desabilitado) */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col opacity-60">
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
              Pedidos
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Em breve
              </span>
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Exporta o consolidado de pedidos realizados na plataforma para
              análise financeira.
            </p>
          </div>

          <button
            disabled
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
          >
            Baixar Excel
          </button>
        </div>
      </div>
    </div>
  );
};
