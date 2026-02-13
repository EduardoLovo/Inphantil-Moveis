import React, { useEffect, useState, useRef } from "react";
import { api } from "../../services/api";
import { type ShippingQuote, ItemSize } from "../../types/shipping-quote";
import { FaTrash, FaExclamationTriangle, FaCopy } from "react-icons/fa";
import { useAuthStore } from "../../store/AuthStore";

// --- LISTA DE OPÇÕES ---
const PROTECTOR_OPTIONS = [
  "Cerca Completa",
  "Cerca 0,92",
  "Cerca 0,98",
  "Cerca 1,08",
  "Cerca 1,16",
  "Cerca 1,30",
  "Cerca 1,51",
  "Cerca 1,58",
  "Cerca 1,76",
  "Cerca 1,78",
  "Cerca 2,06",
  "Cerca 2,16",
  "Cerca 2,12",
  "Cerca 2,21",
  "Aleatoria Completa",
  "Aleatoria 0,92",
  "Aleatoria 0,98",
  "Aleatoria 1,08",
  "Aleatoria 1,16",
  "Aleatoria 1,30",
  "Aleatoria 1,51",
  "Aleatoria 1,58",
  "Aleatoria 1,76",
  "Aleatoria 1,78",
  "Aleatoria 2,06",
  "Aleatoria 2,16",
  "Aleatoria 2,12",
  "Aleatoria 2,21",
  "Encaixe Completo",
  "Encaixe 0,92",
  "Encaixe 0,98",
  "Encaixe 1,08",
  "Encaixe 1,16",
  "Encaixe 1,30",
  "Encaixe 1,51",
  "Encaixe 1,58",
  "Encaixe 1,76",
  "Encaixe 1,78",
  "Encaixe 2,06",
  "Encaixe 2,16",
  "Encaixe 2,12",
  "Encaixe 2,21",
  "Nuvem Completa",
  "Nuvem 0,92",
  "Nuvem 0,98",
  "Nuvem 1,08",
  "Nuvem 1,16",
  "Nuvem 1,30",
  "Nuvem 1,51",
  "Nuvem 1,58",
  "Nuvem 1,76",
  "Nuvem 1,78",
  "Nuvem 2,06",
  "Nuvem 2,16",
  "Nuvem 2,12",
  "Nuvem 2,21",
  "Montanha Completa",
  "Montanha 0,92",
  "Montanha 0,98",
  "Montanha 1,08",
  "Montanha 1,16",
  "Montanha 1,30",
  "Montanha 1,51",
  "Montanha 1,58",
  "Montanha 1,76",
  "Montanha 1,78",
  "Montanha 2,06",
  "Montanha 2,16",
  "Montanha 2,12",
  "Montanha 2,21",
  "Onda Completa",
  "Onda 0,92",
  "Onda 0,98",
  "Onda 1,08",
  "Onda 1,16",
  "Onda 1,30",
  "Onda 1,51",
  "Onda 1,58",
  "Onda 1,76",
  "Onda 1,78",
  "Onda 2,06",
  "Onda 2,16",
  "Onda 2,12",
  "Onda 2,21",
  "Pico Completa",
  "Pico 0,92",
  "Pico 0,98",
  "Pico 1,08",
  "Pico 1,16",
  "Pico 1,30",
  "Pico 1,51",
  "Pico 1,58",
  "Pico 1,76",
  "Pico 1,78",
  "Pico 2,06",
  "Pico 2,16",
  "Pico 2,12",
  "Pico 2,21",
];

const formatCurrency = (value: number | string | undefined) => {
  if (!value) return "R$ 0,00";
  const num = Number(value);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AdminShippingQuotePage: React.FC = () => {
  const { user } = useAuthStore();
  const isDev = user?.role === "DEV";
  const canEdit = user?.role === "ADMIN" || user?.role === "DEV";

  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<ShippingQuote | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<ShippingQuote>>({});
  const [saving, setSaving] = useState(false);

  // Autocomplete State
  const [showProtectorSuggestions, setShowProtectorSuggestions] =
    useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Texto Gerado
  const [generatedText, setGeneratedText] = useState("");

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/shipping-quote");
      setQuotes(response.data);
    } catch (error) {
      console.error("Erro ao buscar cotações:", error);
      alert("Erro ao carregar lista.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowProtectorSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenModal = (quote: ShippingQuote) => {
    setSelectedQuote(quote);
    setGeneratedText("");
    setFormData({
      carrierName: quote.carrierName || "",
      deliveryDeadline: quote.deliveryDeadline || "",
      shippingValue: quote.shippingValue || 0,
      weight: quote.weight || "",
      orderValue: quote.orderValue || 0,
      volumeQuantity: quote.volumeQuantity || 0,
      bedSize: quote.bedSize || undefined,
      hasWallProtector: quote.hasWallProtector || false,
      wallProtectorSize: quote.wallProtectorSize || "",
      hasRug: quote.hasRug || false,
      rugSize: quote.rugSize || "",
      hasAccessories: quote.hasAccessories || false,
      accessoryQuantity: quote.accessoryQuantity || 0,
      isConcluded: quote.isConcluded || false,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuote(null);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("ATENÇÃO: Deseja realmente EXCLUIR esta cotação?"))
      return;
    try {
      await api.delete(`/shipping-quote/${id}`);
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      alert("Cotação removida.");
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir.");
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (!canEdit) return;
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return;
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    const floatValue = Number(numericValue) / 100;
    setFormData((prev) => ({ ...prev, [name]: floatValue }));
  };

  const selectProtector = (value: string) => {
    setFormData((prev) => ({ ...prev, wallProtectorSize: value }));
    setShowProtectorSuggestions(false);
  };

  const generateQuoteText = () => {
    if (!selectedQuote) return;

    const valorPedidoFormatado = formData.orderValue
      ? Number(formData.orderValue).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : "R$ 0,00";

    let volumesText = "";
    const qtdVolumes = Number(formData.volumeQuantity) || 1;
    for (let i = 1; i <= qtdVolumes; i++) {
      volumesText += `Volume${i}: \n`;
    }

    const template = `Olá, tudo bem?
Por gentileza, preciso de uma cotação com as seguintes informações: 
CNPJ: 037616830001-98
Dados do destinatário : ${selectedQuote.customerName} - CPF: ${selectedQuote.customerCpf}
CEP: ${selectedQuote.customerZipCode}
Valor Pedido (R$): ${valorPedidoFormatado}
${volumesText}Peso: ${formData.weight || ""}`;

    setGeneratedText(template);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote || !canEdit) return;

    try {
      setSaving(true);
      await api.patch(`/shipping-quote/${selectedQuote.id}`, {
        ...formData,
        shippingValue: Number(formData.shippingValue),
        volumeQuantity: Number(formData.volumeQuantity),
        accessoryQuantity: Number(formData.accessoryQuantity),
        orderValue: Number(formData.orderValue),
      });
      alert("Cotação atualizada!");
      handleCloseModal();
      fetchQuotes();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const filteredProtectors = PROTECTOR_OPTIONS.filter((opt) =>
    opt
      .toLowerCase()
      .includes((formData.wallProtectorSize || "").toLowerCase()),
  );

  // --- ESTILOS COMPACTOS (PARA CABER NA TELA) ---
  // Fonte reduzida, sem quebra de linha forçada, padding menor
  const thClass =
    "px-2 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50";
  const tdClass =
    "px-2 py-3 text-xs text-gray-700 border-b border-gray-100 align-middle";
  const inputClass =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 disabled:bg-gray-100 disabled:text-gray-500";
  const labelClass = "block text-sm font-medium text-gray-700 mt-3";

  return (
    <div className="container mx-auto px-2 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Gerenciar Cotações</h1>
        <button
          onClick={fetchQuotes}
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
        >
          Atualizar Lista
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className={`${thClass} w-20`}>Data</th>
                <th className={thClass}>Solicitante</th>
                <th className={thClass}>Cliente</th>
                <th className={thClass}>Local</th>
                <th className={thClass}>Transp. / Prazo</th>
                <th className={thClass}>Frete</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : quotes.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Nenhuma cotação encontrada.
                  </td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* 1. DATA */}
                    <td className={tdClass}>{formatDate(quote.createdAt)}</td>

                    {/* 2. SOLICITANTE */}
                    <td className={tdClass}>
                      <span className="font-medium text-gray-700 break-words max-w-[100px] block">
                        {quote.createdBy?.name || "Desconhecido"}
                      </span>
                    </td>

                    {/* 3. CLIENTE */}
                    <td className={tdClass}>
                      <div className="font-semibold break-words max-w-[120px]">
                        {quote.customerName || "-"}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {quote.customerCpf}
                      </div>
                    </td>

                    {/* 4. CIDADE */}
                    <td className={tdClass}>
                      <div className="break-words max-w-[100px] leading-tight">
                        {quote.customerCity
                          ? `${quote.customerCity}/${quote.customerState}`
                          : "-"}
                      </div>
                    </td>

                    {/* 5. TRANSP E PRAZO */}
                    <td className={tdClass}>
                      <div className="flex flex-col">
                        {quote.carrierName ? (
                          <span className="font-bold text-blue-900 text-[10px] break-words max-w-[120px]">
                            {quote.carrierName}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            A definir
                          </span>
                        )}

                        {quote.deliveryDeadline && (
                          <span className="text-[10px] text-gray-600 mt-0.5 leading-tight">
                            Prazo: {quote.deliveryDeadline}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 6. FRETE */}
                    <td className={tdClass}>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(quote.shippingValue)}
                      </span>
                    </td>

                    {/* 7. STATUS */}
                    <td className={tdClass}>
                      {quote.isConcluded ? (
                        <span className="px-1.5 py-0.5 inline-flex text-[10px] leading-4 font-bold rounded bg-green-100 text-green-800">
                          Concluído
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 inline-flex text-[10px] leading-4 font-bold rounded bg-yellow-100 text-yellow-800">
                          Pendente
                        </span>
                      )}
                    </td>

                    {/* 8. AÇÕES */}
                    <td className={tdClass}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(quote)}
                          className="text-indigo-600 hover:text-indigo-900 font-bold text-xs"
                        >
                          {canEdit
                            ? quote.isConcluded
                              ? "Editar"
                              : "Responder"
                            : "Visualizar"}
                        </button>
                        {isDev && (
                          <button
                            onClick={(e) => handleDelete(quote.id, e)}
                            className="text-red-500 hover:text-red-700"
                            title="Excluir"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedQuote && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleCloseModal}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSave}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  {!canEdit && (
                    <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex">
                        <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
                        <p className="ml-3 text-sm text-yellow-700">
                          Modo de Visualização
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mb-4 border-b pb-2">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Cotação #{selectedQuote.id} - {selectedQuote.customerName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedQuote.customerAddress},{" "}
                      {selectedQuote.customerCity}/{selectedQuote.customerState}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 h-fit">
                      <h4 className="font-bold mb-2 text-gray-900">
                        Solicitação Original
                      </h4>
                      <p className="whitespace-pre-wrap mb-4">
                        {selectedQuote.quoteDetails}
                      </p>

                      <div className="border-t pt-4 mt-2">
                        <button
                          type="button"
                          onClick={generateQuoteText}
                          className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded mb-2 w-full flex items-center justify-center gap-2"
                        >
                          <FaCopy /> Gerar Texto para Cotação
                        </button>
                        {generatedText && (
                          <textarea
                            className="w-full text-xs p-2 border rounded bg-white text-gray-800 font-mono"
                            rows={8}
                            value={generatedText}
                            onChange={(e) => setGeneratedText(e.target.value)}
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold mb-2 text-gray-900">
                        Dados da Logística
                      </h4>

                      <div>
                        <label className={labelClass}>Transportadora</label>
                        <input
                          name="carrierName"
                          value={formData.carrierName}
                          onChange={handleFormChange}
                          disabled={!canEdit}
                          className={inputClass}
                        />
                      </div>

                      <div className="mt-2">
                        <label className={labelClass}>Prazo de Entrega</label>
                        <input
                          type="text"
                          name="deliveryDeadline"
                          placeholder="Ex: 15 dias úteis"
                          value={formData.deliveryDeadline || ""}
                          onChange={handleFormChange}
                          disabled={!canEdit}
                          className={inputClass}
                        />
                      </div>

                      {/* VALOR PEDIDO E PESO */}
                      <div className="flex gap-2 mt-2">
                        <div className="flex-1">
                          <label className={labelClass}>Peso (Ex: 15kg)</label>
                          <input
                            type="text"
                            name="weight"
                            value={formData.weight || ""}
                            onChange={handleFormChange}
                            disabled={!canEdit}
                            className={inputClass}
                          />
                        </div>
                        <div className="flex-1">
                          <label className={labelClass}>
                            Valor Pedido (R$)
                          </label>
                          <input
                            type="text"
                            name="orderValue"
                            value={
                              formData.orderValue
                                ? formData.orderValue.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                  })
                                : ""
                            }
                            onChange={handleMoneyChange}
                            disabled={!canEdit}
                            placeholder="0,00"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* VALOR FRETE E VOLUMES */}
                      <div className="flex gap-2 mt-2">
                        <div className="flex-1">
                          <label className={labelClass}>Custo Frete (R$)</label>
                          <input
                            type="text"
                            name="shippingValue"
                            value={
                              formData.shippingValue
                                ? formData.shippingValue.toLocaleString(
                                    "pt-BR",
                                    { minimumFractionDigits: 2 },
                                  )
                                : ""
                            }
                            onChange={handleMoneyChange}
                            disabled={!canEdit}
                            placeholder="0,00"
                            className={inputClass}
                          />
                        </div>
                        <div className="flex-1">
                          <label className={labelClass}>Qtd. Volumes</label>
                          <input
                            type="number"
                            name="volumeQuantity"
                            value={formData.volumeQuantity}
                            onChange={handleFormChange}
                            disabled={!canEdit}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div>
                          <label className={labelClass}>Tamanho da Cama</label>
                          <select
                            name="bedSize"
                            value={formData.bedSize}
                            onChange={handleFormChange}
                            disabled={!canEdit}
                            className={inputClass}
                          >
                            <option value="">Selecione...</option>
                            {Object.keys(ItemSize).map((key) => (
                              <option key={key} value={key}>
                                {key}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="pt-2" ref={wrapperRef}>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="hasWallProtector"
                              checked={formData.hasWallProtector}
                              onChange={handleFormChange}
                              disabled={!canEdit}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                              Tem Protetor?
                            </label>
                          </div>

                          {formData.hasWallProtector && (
                            <div className="relative mt-1">
                              <input
                                type="text"
                                name="wallProtectorSize"
                                placeholder="Digite para filtrar..."
                                value={formData.wallProtectorSize}
                                onChange={(e) => {
                                  handleFormChange(e);
                                  setShowProtectorSuggestions(true);
                                }}
                                onFocus={() =>
                                  canEdit && setShowProtectorSuggestions(true)
                                }
                                disabled={!canEdit}
                                className={inputClass}
                                autoComplete="off"
                              />
                              {showProtectorSuggestions && canEdit && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                                  {filteredProtectors.length > 0 ? (
                                    filteredProtectors.map((opt) => (
                                      <li
                                        key={opt}
                                        onClick={() => selectProtector(opt)}
                                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0"
                                      >
                                        {opt}
                                      </li>
                                    ))
                                  ) : (
                                    <li className="px-4 py-2 text-sm text-gray-400 italic">
                                      Nada encontrado
                                    </li>
                                  )}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center pt-2">
                          <input
                            type="checkbox"
                            name="hasRug"
                            checked={formData.hasRug}
                            onChange={handleFormChange}
                            disabled={!canEdit}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-700">
                            Tem Tapete?
                          </label>
                        </div>
                        {formData.hasRug && (
                          <input
                            type="text"
                            name="rugSize"
                            placeholder="Tamanho do tapete"
                            value={formData.rugSize}
                            onChange={handleFormChange}
                            disabled={!canEdit}
                            className={inputClass}
                          />
                        )}

                        <div className="flex items-center pt-2">
                          <input
                            type="checkbox"
                            name="hasAccessories"
                            checked={formData.hasAccessories}
                            onChange={handleFormChange}
                            disabled={!canEdit}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-700">
                            Tem Acessórios?
                          </label>
                        </div>
                        {formData.hasAccessories && (
                          <input
                            type="number"
                            name="accessoryQuantity"
                            placeholder="Qtd."
                            value={formData.accessoryQuantity}
                            onChange={handleFormChange}
                            disabled={!canEdit}
                            className={inputClass}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`mt-6 pt-4 border-t flex items-center justify-between p-3 rounded ${!canEdit ? "opacity-50 pointer-events-none" : "bg-yellow-50"}`}
                  >
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isConcluded"
                        checked={formData.isConcluded}
                        onChange={handleFormChange}
                        disabled={!canEdit}
                        className="h-5 w-5 text-green-600 rounded"
                      />
                      <span className="ml-3 font-bold text-gray-800">
                        Marcar como CONCLUÍDO
                      </span>
                    </label>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  {canEdit && (
                    <button
                      type="submit"
                      disabled={saving}
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                      {saving ? "Salvando..." : "Salvar Dados"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {canEdit ? "Cancelar" : "Fechar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShippingQuotePage;
