import React, { useState } from "react";
import { api } from "../../services/api";
import { type ShippingQuote } from "../../types/shipping-quote";
import { FaCheckCircle, FaTrash } from "react-icons/fa";
import { useAuthStore } from "../../store/AuthStore";

// Função auxiliar de formatação
const formatCurrency = (value: number | string | undefined) => {
  if (!value) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR");
};

const SearchShippingQuotePage: React.FC = () => {
  const { user } = useAuthStore();
  const isDev = user?.role === "DEV";

  // Estados dos Filtros
  const [carrierSearch, setCarrierSearch] = useState("");
  const [citySearch, setCitySearch] = useState(""); // <--- MUDOU DE CEP PARA CIDADE

  // Estado dos Resultados
  const [results, setResults] = useState<ShippingQuote[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação: precisa de pelo menos um campo
    if (!carrierSearch.trim() && !citySearch.trim()) {
      alert("Por favor, preencha a Transportadora ou a Cidade para pesquisar.");
      return;
    }

    setLoading(true);
    setResults([]);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (carrierSearch) params.append("carrier", carrierSearch);

      // --- ENVIA O PARÂMETRO CITY ---
      if (citySearch) params.append("city", citySearch);

      const response = await api.get(`/shipping-quote?${params.toString()}`);
      setResults(response.data);
    } catch (error) {
      console.error("Erro na pesquisa:", error);
      alert("Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCarrierSearch("");
    setCitySearch("");
    setResults(null);
    setHasSearched(false);
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Tem certeza que deseja EXCLUIR permanentemente esta cotação?",
      )
    ) {
      return;
    }

    try {
      await api.delete(`/shipping-quote/${id}`);
      setResults((prev) =>
        prev ? prev.filter((item) => item.id !== id) : null,
      );
      alert("Cotação excluída com sucesso.");
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir cotação.");
    }
  };

  // Classes Tailwind
  const inputClass =
    "w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";
  const thClass =
    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50";
  const tdClass =
    "px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-100";

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Pesquisa de Cotações
        </h1>
        <p className="text-gray-600">
          Busque por histórico de fretes usando a transportadora ou a cidade do
          cliente.
        </p>
      </div>

      {/* Área de Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transportadora
            </label>
            <input
              type="text"
              placeholder="Ex: Braspress..."
              value={carrierSearch}
              onChange={(e) => setCarrierSearch(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* --- CAMPO DE CIDADE --- */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cidade do Cliente
            </label>
            <input
              type="text"
              placeholder="Ex: São Paulo, Curitiba..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-bold py-2.5 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {loading ? "Buscando..." : "Pesquisar"}
            </button>

            {hasSearched && (
              <button
                type="button"
                onClick={handleClear}
                className="bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded hover:bg-gray-300 transition-colors"
              >
                Limpar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Área de Resultados */}
      {hasSearched && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Carregando resultados...
            </div>
          ) : results && results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className={thClass}>Data</th>
                    <th className={thClass}>Transp.</th>
                    <th className={thClass}>Vol.</th>
                    <th className={thClass}>Valor/Prazo</th>
                    <th className={thClass}>Cliente</th>
                    <th className={thClass}>Itens / Tamanho</th>
                    {isDev && <th className={thClass}>Ações</th>}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {results.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className={tdClass}>{formatDate(item.createdAt)}</td>

                      <td className={tdClass}>
                        {item.carrierName ? (
                          <span className="font-semibold text-blue-900">
                            {item.carrierName}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">ND</span>
                        )}
                      </td>

                      <td className={tdClass}>
                        {item.volumeQuantity ? (
                          <span className="font-medium">
                            {item.volumeQuantity} cx
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* Valor e Prazo */}
                      <td className={tdClass}>
                        <div className="flex flex-col">
                          {item.shippingValue ? (
                            <span className="font-medium text-green-700 text-base">
                              {formatCurrency(item.shippingValue)}
                            </span>
                          ) : (
                            <span>-</span>
                          )}
                          {item.deliveryDeadline && (
                            <span className="text-xs text-gray-500 font-medium mt-1">
                              Prazo: {item.deliveryDeadline}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className={tdClass}>
                        <div className="font-medium">{item.customerName}</div>
                        <div className="text-xs font-bold text-blue-600">
                          {item.customerCity} - {item.customerState}
                        </div>
                        <div className="text-xs text-gray-400">
                          {item.customerZipCode}
                        </div>
                      </td>

                      <td className={tdClass}>
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className="font-bold text-gray-700 text-sm cursor-help"
                            title={item.quoteDetails}
                          >
                            {item.bedSize || "Ver Detalhes"}
                          </span>

                          <div className="flex flex-wrap gap-2">
                            {item.hasWallProtector && (
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200"
                                title="Possui Protetor de Parede"
                              >
                                <FaCheckCircle size={10} />{" "}
                                {item.wallProtectorSize || "Protetor"}
                              </span>
                            )}

                            {item.hasAccessories && (
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200"
                                title="Possui Acessórios"
                              >
                                <FaCheckCircle size={10} /> Acessórios
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {isDev && (
                        <td className={tdClass}>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                            title="Excluir Cotação (Apenas DEV)"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center flex flex-col items-center justify-center text-gray-500">
              <p className="text-lg font-medium">Nenhuma cotação encontrada.</p>
              <p className="text-sm">
                Verifique o nome da cidade ou transportadora.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchShippingQuotePage;
