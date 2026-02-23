import React, { useEffect, useState, useRef } from "react";
import { api } from "../../services/api";
import { type ShippingQuote } from "../../types/shipping-quote";
import { FaTrash, FaCopy, FaChevronDown, FaChevronUp } from "react-icons/fa";
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

const BED_SIZE_OPTIONS = [
  "Berço",
  "Junior",
  "Solteiro",
  "Solteirão",
  "Viuva",
  "Casal",
  "Queen",
  "King",
  "Borda Berço",
  "Borda Junior",
  "Borda Solteiro",
  "Borda Solteirão",
  "Borda Viuva",
  "Borda Casal",
  "Borda Queen",
  "Borda King",
  "Sob Medida",
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

  // Estado para abrir/fechar a solicitação original
  const [showOriginalQuote, setShowOriginalQuote] = useState(false);
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [showAdminNotes, setShowAdminNotes] = useState(false);

  // Adicionado isRequested no formData (Novo Status)
  const [formData, setFormData] = useState<
    Partial<ShippingQuote & { isRequested?: boolean }>
  >({});
  const [saving, setSaving] = useState(false);

  const [showProtectorSuggestions, setShowProtectorSuggestions] =
    useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const handleOpenModal = (
    quote: ShippingQuote & { isRequested?: boolean },
  ) => {
    setSelectedQuote(quote);
    setGeneratedText("");
    setShowOriginalQuote(!canEdit); // Se for Vendedor, já abre direto. Se for Logística, começa fechado.

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
      isRequested: quote.isRequested || false,
      isConcluded: quote.isConcluded || false,
      adminNotes: quote.adminNotes || "",
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >, // <--- Adicionado o HTMLTextAreaElement aqui
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
      volumesText += `Volume ${i}: \n`;
    }

    const template = `Olá, tudo bem?
Por gentileza, preciso de uma cotação com as seguintes informações: 
CNPJ: 037616830001-98
Dados do destinatário : ${selectedQuote.customerName} - CPF: ${selectedQuote.customerCpf}
CEP: ${selectedQuote.customerZipCode}
Valor Pedido: ${valorPedidoFormatado}
${volumesText}Peso Total: ${formData.weight || ""}
Qual o prazo de Entrega?`;

    setGeneratedText(template);
  };

  // Botão de Copiar Texto
  const handleCopyText = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
      alert("Texto copiado para a área de transferência!");
    }
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
        isRequested: formData.isRequested,
        adminNotes: formData.adminNotes,
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

  const displayedQuotes = showOnlyMine
    ? quotes.filter((q) => q.createdBy?.id === user?.id)
    : quotes;

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
        <div className="flex items-center gap-4">
          <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={showOnlyMine}
              onChange={(e) => setShowOnlyMine(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            Mostrar apenas minhas cotações
          </label>

          <button
            onClick={fetchQuotes}
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
          >
            Atualizar Lista
          </button>
        </div>
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
              ) : displayedQuotes.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Nenhuma cotação encontrada.
                  </td>
                </tr>
              ) : (
                displayedQuotes.map((quote: any) => (
                  <tr
                    key={quote.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className={tdClass}>{formatDate(quote.createdAt)}</td>
                    <td className={tdClass}>
                      {quote.createdBy?.id === user?.id ? (
                        <span className="font-bold text-violet-700 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded text-[10px] break-words max-w-[100px] inline-block">
                          {quote.createdBy?.name}
                        </span>
                      ) : (
                        <span className="font-medium text-gray-700 break-words max-w-[100px] block">
                          {quote.createdBy?.name || "Desconhecido"}
                        </span>
                      )}
                    </td>
                    <td className={tdClass}>
                      <div className="font-semibold break-words max-w-[120px]">
                        {quote.customerName || "-"}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {quote.customerCpf}
                      </div>
                    </td>
                    <td className={tdClass}>
                      <div className="break-words max-w-[100px] leading-tight">
                        {quote.customerCity
                          ? `${quote.customerCity}/${quote.customerState}`
                          : "-"}
                      </div>
                    </td>
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
                    <td className={tdClass}>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(quote.shippingValue)}
                      </span>
                    </td>

                    {/* --- LÓGICA DO NOVO STATUS --- */}
                    <td className={tdClass}>
                      {quote.isConcluded ? (
                        <span className="px-1.5 py-0.5 inline-flex text-[10px] leading-4 font-bold rounded bg-green-100 text-green-800">
                          Concluído
                        </span>
                      ) : quote.isRequested ? (
                        <span className="px-1.5 py-0.5 inline-flex text-[10px] leading-4 font-bold rounded bg-blue-100 text-blue-800 border border-blue-200">
                          Aguardando Resposta
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 inline-flex text-[10px] leading-4 font-bold rounded bg-yellow-100 text-yellow-800">
                          Pendente
                        </span>
                      )}
                    </td>

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

      {/* --- MODAL --- */}
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
                <div className="bg-white px-6 pt-5 pb-6">
                  {/* Cabeçalho do Modal */}
                  <div className="mb-4 border-b pb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      Cotação #{selectedQuote.id} - {selectedQuote.customerName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedQuote.customerAddress},{" "}
                      {selectedQuote.customerCity}/{selectedQuote.customerState}
                    </p>
                  </div>

                  {/* --- UMA COLUNA: FLUXO DE CIMA PARA BAIXO --- */}
                  <div className="flex flex-col gap-6">
                    {/* 1. Solicitação Original (Abre e Fecha) */}
                    <div className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowOriginalQuote(!showOriginalQuote)}
                        className="w-full flex justify-between items-center p-3 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-bold text-gray-800 text-sm">
                          Ver Solicitação Original
                        </span>
                        {showOriginalQuote ? (
                          <FaChevronUp className="text-gray-500" />
                        ) : (
                          <FaChevronDown className="text-gray-500" />
                        )}
                      </button>
                      {showOriginalQuote && (
                        <div className="p-4 border-t border-gray-200 text-sm text-gray-700 whitespace-pre-wrap bg-white">
                          {selectedQuote.quoteDetails}
                        </div>
                      )}
                    </div>
                    {/* --- OBSERVAÇÕES INTERNAS (SÓ ADMIN/DEV VÊ E EDITA) --- */}
                    {canEdit && (
                      <div className="border border-yellow-300 rounded-lg bg-yellow-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setShowAdminNotes(!showAdminNotes)}
                          className="w-full flex justify-between items-center p-3 hover:bg-yellow-100 transition-colors"
                        >
                          <span className="font-bold text-yellow-900 text-sm">
                            Observações Internas
                          </span>
                          {showAdminNotes ? (
                            <FaChevronUp className="text-yellow-700" />
                          ) : (
                            <FaChevronDown className="text-yellow-700" />
                          )}
                        </button>

                        {showAdminNotes && (
                          <div className="p-4 border-t border-yellow-200 bg-white">
                            <textarea
                              name="adminNotes"
                              value={formData.adminNotes || ""}
                              onChange={handleFormChange}
                              rows={3}
                              placeholder="Ex: Transportadora X não atende essa região..."
                              className="w-full p-2.5 border border-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 outline-none text-sm bg-yellow-50"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* 2. Dados da Logística (Físico/Itens) */}
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-3 border-b pb-2">
                        Dados da Carga & Itens
                      </h4>

                      {/* Grid interno para alinhar Peso, Valor e Volumes bonitinho */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
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
                        <div>
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
                        <div>
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

                      {/* Itens Adicionais */}
                      <div className="space-y-3 bg-gray-50 p-3 rounded border border-gray-100">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Tamanho da Cama
                          </label>
                          <select
                            name="bedSize"
                            // Se o texto começar com "Sob Medida", ele trava o select na opção "Sob Medida"
                            value={
                              formData.bedSize?.startsWith("Sob Medida")
                                ? "Sob Medida"
                                : formData.bedSize || ""
                            }
                            onChange={(e) => {
                              if (!canEdit) return;
                              if (e.target.value === "Sob Medida") {
                                // Se escolheu sob medida, prepara a string
                                setFormData((prev) => ({
                                  ...prev,
                                  bedSize: "Sob Medida: ",
                                }));
                              } else {
                                // Se for tamanho padrão, salva o padrão
                                setFormData((prev) => ({
                                  ...prev,
                                  bedSize: e.target.value,
                                }));
                              }
                            }}
                            disabled={!canEdit}
                            className={inputClass}
                          >
                            <option value="">Nenhuma / Selecione...</option>
                            {BED_SIZE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>

                          {/* CAIXA EXTRA: Aparece apenas se "Sob Medida" estiver selecionado */}
                          {formData.bedSize?.startsWith("Sob Medida") && (
                            <input
                              type="text"
                              placeholder="Digite as medidas. Ex: 1,40 x 2,00"
                              // Tira o prefixo só visualmente para a pessoa digitar
                              value={formData.bedSize.replace(
                                "Sob Medida: ",
                                "",
                              )}
                              onChange={(e) => {
                                if (!canEdit) return;
                                // Salva no banco com o prefixo
                                setFormData((prev) => ({
                                  ...prev,
                                  bedSize: `Sob Medida: ${e.target.value}`,
                                }));
                              }}
                              disabled={!canEdit}
                              className={`mt-2 ${inputClass} border-blue-300 bg-blue-50 focus:border-blue-500`}
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                          {/* Protetor */}
                          <div ref={wrapperRef}>
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                              <input
                                type="checkbox"
                                name="hasWallProtector"
                                checked={formData.hasWallProtector}
                                onChange={handleFormChange}
                                disabled={!canEdit}
                                className="h-4 w-4 text-blue-600 rounded mr-2"
                              />
                              Tem Protetor?
                            </label>
                            {formData.hasWallProtector && (
                              <div className="relative">
                                <input
                                  type="text"
                                  name="wallProtectorSize"
                                  placeholder="Filtrar modelo..."
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
                                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                                    {filteredProtectors.length > 0 ? (
                                      filteredProtectors.map((opt) => (
                                        <li
                                          key={opt}
                                          onClick={() => selectProtector(opt)}
                                          className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-xs text-gray-700 border-b border-gray-100"
                                        >
                                          {opt}
                                        </li>
                                      ))
                                    ) : (
                                      <li className="px-3 py-2 text-xs text-gray-400 italic">
                                        Nada encontrado
                                      </li>
                                    )}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Tapete */}
                          <div>
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                              <input
                                type="checkbox"
                                name="hasRug"
                                checked={formData.hasRug}
                                onChange={handleFormChange}
                                disabled={!canEdit}
                                className="h-4 w-4 text-blue-600 rounded mr-2"
                              />
                              Tem Tapete?
                            </label>
                            {formData.hasRug && (
                              <input
                                type="text"
                                name="rugSize"
                                placeholder="Tamanho..."
                                value={formData.rugSize}
                                onChange={handleFormChange}
                                disabled={!canEdit}
                                className={inputClass}
                              />
                            )}
                          </div>

                          {/* Acessórios */}
                          <div>
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                              <input
                                type="checkbox"
                                name="hasAccessories"
                                checked={formData.hasAccessories}
                                onChange={handleFormChange}
                                disabled={!canEdit}
                                className="h-4 w-4 text-blue-600 rounded mr-2"
                              />
                              Tem Acessórios?
                            </label>
                            {formData.hasAccessories && (
                              <input
                                type="number"
                                name="accessoryQuantity"
                                placeholder="Qtd..."
                                value={formData.accessoryQuantity}
                                onChange={handleFormChange}
                                disabled={!canEdit}
                                className={inputClass}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Gerador de Texto e Botão Copiar (SÓ ADMIN VÊ) */}
                    {canEdit && (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <button
                          type="button"
                          onClick={generateQuoteText}
                          className="w-full bg-white border border-blue-300 text-blue-700 font-bold py-2 px-4 rounded shadow-sm hover:bg-blue-100 transition flex justify-center items-center gap-2"
                        >
                          <FaCopy /> Gerar Texto para Enviar à Transportadora
                        </button>

                        {generatedText && (
                          <div className="mt-3">
                            <textarea
                              className="w-full text-sm p-3 border border-blue-300 rounded bg-white text-gray-800 font-mono shadow-inner"
                              rows={8}
                              value={generatedText}
                              onChange={(e) => setGeneratedText(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={handleCopyText}
                              className="mt-2 w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 shadow-md"
                            >
                              COPIAR TEXTO ACIMA
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 4. Checkbox "Solicitado / Aguardando Resposta" */}
                    <div
                      className={`p-4 rounded border-2 ${formData.isRequested ? "bg-blue-50 border-blue-400" : "bg-gray-50 border-gray-200"} ${!canEdit && "opacity-70 pointer-events-none"}`}
                    >
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isRequested"
                          checked={formData.isRequested}
                          onChange={handleFormChange}
                          disabled={!canEdit}
                          className="h-5 w-5 text-blue-600 rounded"
                        />
                        <div className="ml-3">
                          <span className="font-bold text-gray-800 block">
                            Solicitado (Aguardando Resposta)
                          </span>
                          <span className="text-xs text-gray-500">
                            Marque isso após enviar os dados para a
                            transportadora.
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* 5. Resposta da Transportadora */}
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-3 border-b pb-2">
                        Resposta da Transportadora
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className={labelClass}>
                            Nome da Transportadora
                          </label>
                          <input
                            name="carrierName"
                            placeholder="Ex: Braspress"
                            value={formData.carrierName}
                            onChange={handleFormChange}
                            disabled={!canEdit}
                            className={inputClass}
                          />
                        </div>
                        <div>
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
                        <div>
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
                      </div>
                    </div>

                    {/* 6. Checkbox "Concluído" */}
                    <div
                      className={`p-4 rounded border-2 ${formData.isConcluded ? "bg-green-50 border-green-400" : "bg-gray-50 border-gray-200"} ${!canEdit && "opacity-70 pointer-events-none"}`}
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
                        <div className="ml-3">
                          <span className="font-bold text-gray-800 block">
                            Marcar como CONCLUÍDO
                          </span>
                          <span className="text-xs text-gray-500">
                            A cotação está finalizada e pronta para o cliente.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Rodapé do Modal */}
                <div className="bg-gray-100 px-4 py-3 sm:px-6 flex justify-end gap-3 rounded-b-lg border-t">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {canEdit ? "Cancelar" : "Fechar Visualização"}
                  </button>
                  {canEdit && (
                    <button
                      type="submit"
                      disabled={saving}
                      className={`w-full sm:w-auto px-6 py-2 rounded shadow-sm text-sm font-bold text-white ${saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
                    >
                      {saving ? "Salvando..." : "Salvar Cotação"}
                    </button>
                  )}
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
