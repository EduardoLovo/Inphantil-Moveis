import React, { useEffect, useState, useMemo } from "react";
import { useOrderStore } from "../../store/OrderStore";
import { useAuthStore } from "../../store/AuthStore";
import { Navigate, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaShoppingCart,
  FaTrashAlt,
  FaSpinner,
  FaBoxOpen,
  FaUser,
  FaClock,
  FaFilePdf,
  FaSearch,
  FaEye,
} from "react-icons/fa";
import { OrderStatus } from "../../types/order";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  IN_PRODUCTION: "Em Produção",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PAID: "bg-green-100 text-green-800 border-green-200",
  IN_PRODUCTION: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED: "bg-gray-100 text-gray-800 border-gray-200",
  DELIVERED: "bg-green-600 text-white border-green-600",
  CANCELED: "bg-red-100 text-red-800 border-red-200",
};

const AdminOrdersPage: React.FC = () => {
  const {
    orders,
    isLoading,
    error,
    fetchAllOrders,
    updateOrderStatus,
    deleteOrder,
  } = useOrderStore();
  const { user } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const canAccess =
    user &&
    (user.role === "ADMIN" || user.role === "DEV" || user.role === "SELLER");

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      const orderId = order.id.toString();
      const userName = order.user?.name?.toLowerCase() || "";
      const userEmail = order.user?.email?.toLowerCase() || "";

      return (
        orderId.includes(searchLower) ||
        userName.includes(searchLower) ||
        userEmail.includes(searchLower)
      );
    });
  }, [orders, searchTerm]);

  if (!canAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleDownloadPDF = (order: any) => {
    const doc = new jsPDF();

    // --- CABEÇALHO ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(49, 59, 47); // Verde Inphantil
    doc.text("INPHANTIL MÓVEIS", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Ordem de Produção e Separação", 105, 26, { align: "center" });

    // --- CAIXA DE INFORMAÇÕES (PEDIDO, CLIENTE E ENDEREÇO) ---
    doc.setFillColor(249, 250, 251); // Fundo cinza clarinho
    doc.rect(15, 35, 180, 50, "F");

    doc.setFontSize(10);
    doc.setTextColor(40);

    // Coluna 1: Dados do Pedido
    doc.setFont("helvetica", "bold");
    doc.text("DADOS DO PEDIDO", 20, 42);
    doc.setFont("helvetica", "normal");
    doc.text(`Pedido: #${order.id}`, 20, 48);
    doc.text(
      `Data: ${new Date(order.createdAt).toLocaleDateString("pt-BR")}`,
      20,
      54,
    );
    doc.text(`Status: ${order.status}`, 20, 60); // Se tiver STATUS_LABELS pode usar

    // Coluna 2: Dados do Cliente
    doc.setFont("helvetica", "bold");
    doc.text("CLIENTE", 100, 42);
    doc.setFont("helvetica", "normal");
    doc.text(`Nome: ${order.user?.name || "Não informado"}`, 100, 48);
    doc.text(`Email: ${order.user?.email || "Não informado"}`, 100, 54);
    doc.text(
      `Telefone: ${order.user?.phone || order.phone || "Não informado"}`,
      100,
      60,
    );

    // Linha Inteira: Endereço de Entrega
    doc.setFont("helvetica", "bold");
    doc.text("ENDEREÇO DE ENTREGA", 20, 72);
    doc.setFont("helvetica", "normal");

    // 🧠 Lógica para encontrar o endereço (Tenta vários nomes de variáveis comuns)
    const addr = order.shippingAddress || order.address || {};
    const rua = addr.street || addr.logradouro || "Endereço não cadastrado";
    const num = addr.number || addr.numero || "S/N";
    const comp =
      addr.complement || addr.complemento
        ? ` - ${addr.complement || addr.complemento}`
        : "";
    const bairro = addr.neighborhood || addr.bairro || "";
    const cidade = addr.city || addr.cidade || "";
    const estado = addr.state || addr.estado || "";
    const cep = addr.zipCode || addr.cep || "";

    doc.text(`${rua}, ${num}${comp}`, 20, 78);
    doc.text(`${bairro} - ${cidade}/${estado} - CEP: ${cep}`, 20, 84);

    // --- TABELA DE ITENS ---
    const tableColumn = [
      "Qtd",
      "Produto / Especificações",
      "V. Unitário",
      "V. Total",
    ];
    const tableRows: any[] = [];

    order.items?.forEach((item: any) => {
      const itemName = item.product?.name || "Produto Desconhecido";

      // 🧠 MÁGICA DA VARIANTE: Procura em todos os cantos possíveis!
      const size = item.size || item.variant?.size || item.productVariant?.size;
      const color =
        item.color || item.variant?.color || item.productVariant?.color;
      const extra =
        item.complement ||
        item.variant?.complement ||
        item.productVariant?.complement;

      const details = [];
      if (size && size !== "UNICO" && size !== "Tamanho Único") {
        details.push(`Tamanho: ${size}`);
      }
      if (color && color !== "Cor Única") {
        details.push(`Cor: ${color}`);
      }
      if (extra) {
        details.push(`Opções: ${extra}`);
      }

      const description =
        details.length > 0
          ? `${itemName}\n>> ${details.join(" | ")}`
          : itemName;

      // Calcula o total da linha
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;

      tableRows.push([
        `${qty}x`,
        description,
        price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        (price * qty).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      ]);
    });

    // Gerando a tabela com AutoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 95,
      theme: "striped",
      headStyles: {
        fillColor: [49, 59, 47],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: "auto" },
        2: { cellWidth: 30, halign: "right" },
        3: { cellWidth: 30, halign: "right" },
      },
      styles: { fontSize: 10, cellPadding: 4, valign: "middle" },
      didDrawPage: (data) => {
        // Rodapé no final de cada página
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          "Inphantil Móveis - Uso Interno da Produção",
          data.settings.margin.left,
          doc.internal.pageSize.height - 10,
        );
      },
    });

    // --- TOTAL FINAL DO PEDIDO ---
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Caixinha de Resumo Financeiro
    doc.setFillColor(249, 250, 251);
    doc.rect(130, finalY - 5, 65, 12, "F");

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(49, 59, 47);
    const totalFormatado = Number(order.total || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    doc.text(`TOTAL: ${totalFormatado}`, 190, finalY + 3, { align: "right" });

    // --- SALVAR ---
    doc.save(`Pedido_${order.id}_Producao.pdf`);
  };

  const handleStatusChange = (
    id: number,
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStatus = e.target.value as OrderStatus;
    if (
      window.confirm(
        `Deseja alterar o status para ${STATUS_LABELS[newStatus]}?`,
      )
    ) {
      updateOrderStatus(id, newStatus);
    } else {
      e.target.value = orders.find((o) => o.id === id)?.status || "";
    }
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "ATENÇÃO: Isso excluirá o pedido permanentemente e devolverá os itens ao estoque. Continuar?",
      )
    ) {
      await deleteOrder(id);
    }
  };

  const formatPrice = (val: number) =>
    Number(val).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <p className="text-lg font-medium">Carregando Pedidos...</p>
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#313b2f]">
            <FaShoppingCart className="text-[#ffd639]" /> Pedidos
          </h1>
          <p className="text-gray-500 mt-1 ml-1">
            Gerencie e atualize o status das vendas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID, nome ou email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 whitespace-nowrap self-start sm:self-auto">
            <FaBoxOpen /> {filteredOrders.length} Pedidos
          </div>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* --- VERSÃO MOBILE (CARDS) --- */}
      <div className="md:hidden space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden"
          >
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${STATUS_STYLES[order.status]?.split(" ")[0].replace("bg-", "bg-")}`}
            />

            <div className="flex justify-between items-start mb-4 pl-3">
              <div>
                <span className="text-xs text-gray-400 font-mono block mb-1">
                  #{order.id}
                </span>
                <h3 className="font-bold text-[#313b2f] text-lg">
                  {formatPrice(order.total)}
                </h3>
              </div>
              <span
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${STATUS_STYLES[order.status]}`}
              >
                {STATUS_LABELS[order.status]}
              </span>
            </div>

            <div className="pl-3 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaUser className="text-gray-400" />
                <span className="font-medium">
                  {order.user?.name || "Cliente Excluído"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <FaClock className="text-gray-400" />
                {new Date(order.createdAt).toLocaleDateString("pt-BR")} às{" "}
                {new Date(order.createdAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                  Itens:
                </p>
                <ul className="list-disc pl-4 space-y-2">
                  {order.items?.map((item: any) => {
                    // 👉 PUXA OS DADOS DE FORMA INTELIGENTE
                    const varSize =
                      item.variant?.attributes?.size || item.variant?.size;
                    const varColor =
                      item.variant?.attributes?.color || item.variant?.color;
                    const varComplement =
                      item.variant?.attributes?.complement ||
                      item.variant?.complement;

                    return (
                      <li key={item.id} className="text-xs">
                        <div>
                          <span className="font-bold">{item.quantity}x</span>{" "}
                          {item.product?.name || "Produto Indisponível"}
                        </div>
                        {/* MOSTRANDO VARIAÇÃO */}
                        {item.variant && (
                          <div className="text-[10px] text-gray-500 mt-0.5 ml-4">
                            {varColor && varColor !== "Cor Única" && (
                              <span>Cor: {varColor} | </span>
                            )}
                            {varSize && varSize !== "Tamanho Único" && (
                              <span>Tam: {varSize} </span>
                            )}
                            {varComplement && (
                              <span>| Extra: {varComplement}</span>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="pl-3 mt-5 flex gap-3">
              <select
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#ffd639] outline-none"
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e)}
              >
                {Object.keys(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
              <button
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100"
                onClick={() => handleDownloadPDF(order)}
                title="Baixar PDF"
              >
                <FaFilePdf />
              </button>
              <button
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100"
                onClick={() => handleDelete(order.id)}
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- VERSÃO DESKTOP (TABELA) --- */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
              <th className="p-5 w-20">ID</th>
              <th className="p-5">Data</th>
              <th className="p-5">Cliente</th>
              <th className="p-5 min-w-[250px]">Itens</th>
              <th className="p-5">Total</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-yellow-50/30 transition-colors group"
              >
                <td className="p-5 font-mono text-gray-400 text-sm">
                  #{order.id} {order.sevenId}
                </td>
                <td className="p-5 text-sm text-gray-600">
                  <div className="font-medium text-gray-800">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>
                <td className="p-5">
                  <div className="font-bold text-[#313b2f] text-sm">
                    {order.user?.name || "Cliente Excluído"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.user?.email || "Email indisponível"}
                  </div>
                </td>
                <td className="p-5">
                  <ul className="list-disc pl-4 space-y-2">
                    {order.items?.map((item: any) => {
                      // 👉 PUXA OS DADOS DE FORMA INTELIGENTE (attributes ou direto)
                      const varSize =
                        item.variant?.attributes?.size || item.variant?.size;
                      const varColor =
                        item.variant?.attributes?.color || item.variant?.color;
                      const varComplement =
                        item.variant?.attributes?.complement ||
                        item.variant?.complement;

                      return (
                        <li key={item.id} className="text-sm text-gray-700">
                          <div>
                            <span className="font-bold text-gray-900">
                              {item.quantity}x
                            </span>{" "}
                            {item.product?.name || "Produto Excluído"}
                          </div>
                          {/* MOSTRANDO VARIAÇÃO NO DESKTOP */}
                          {item.variant && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {varColor && varColor !== "Cor Única" && (
                                <span>Cor: {varColor} | </span>
                              )}
                              {varSize && varSize !== "Tamanho Único" && (
                                <span>Tam: {varSize} </span>
                              )}
                              {varComplement && (
                                <span>| Extra: {varComplement}</span>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </td>
                <td className="p-5 font-bold text-[#313b2f] text-base">
                  {formatPrice(order.total)}
                </td>
                <td className="p-5">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                      STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex items-center justify-center gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                      <select
                        className="appearance-none bg-white border border-gray-200 text-gray-700 py-1.5 pl-3 pr-8 rounded-lg shadow-sm focus:ring-2 focus:ring-[#ffd639] outline-none text-xs font-medium cursor-pointer hover:border-gray-300 transition-colors"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e)}
                      >
                        {Object.keys(OrderStatus).map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg
                          className="h-3 w-3 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>

                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                      onClick={() => handleDownloadPDF(order)}
                      title="Baixar para Produção (PDF)"
                    >
                      <FaFilePdf />
                    </button>

                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                      onClick={() => handleDelete(order.id)}
                      title="Excluir Pedido"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="bg-gray-100 hover:bg-[#ffd639] text-gray-600 hover:text-[#313b2f] p-2 rounded-lg transition-colors shadow-sm inline-flex items-center gap-2 font-bold text-xs"
                    title="Ver Detalhes Completos"
                  >
                    <FaEye size={14} /> Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mt-4">
          <FaBoxOpen className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            {searchTerm
              ? `Nenhum pedido encontrado para "${searchTerm}"`
              : "Nenhum pedido encontrado."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
