import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/OrderStore";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaSpinner,
  FaPrint,
  FaSave,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Assumindo que você tem essas funções no seu OrderStore
  const { orders, fetchAdminOrders, updateOrderStatus } = useOrderStore();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusAcao, setStatusAcao] = useState<string>("");
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      // Se a lista já tem os pedidos, pega de lá. Se não, busca.
      let foundOrder = orders.find((o) => o.id.toString() === id);

      if (!foundOrder) {
        await fetchAdminOrders(); // Recarrega se acessou o link direto
        const currentOrders = useOrderStore.getState().orders;
        foundOrder = currentOrders.find((o) => o.id.toString() === id);
      }

      if (foundOrder) {
        setOrder(foundOrder);
        setStatusAcao(foundOrder.status);
      }
      setLoading(false);
    };

    loadOrder();
  }, [id, orders, fetchAdminOrders]);

  const handleUpdateStatus = async () => {
    if (statusAcao === order.status) return;

    setIsSavingStatus(true);
    try {
      await updateOrderStatus(order.id, statusAcao as any);
      toast.success("Status atualizado com sucesso!");
      setOrder({ ...order, status: statusAcao });
    } catch (error) {
      toast.error("Erro ao atualizar o status.");
    } finally {
      setIsSavingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <p className="text-lg font-bold text-[#313b2f]">Carregando pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <h2 className="text-2xl font-bold text-[#313b2f] mb-2">
          Pedido não encontrado
        </h2>
        <button
          onClick={() => navigate("/admin/orders")}
          className="text-blue-500 hover:underline"
        >
          Voltar para a lista
        </button>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          text: "Pendente",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case "PAID":
        return {
          text: "Pago",
          color: "bg-green-100 text-green-800 border-green-200",
        };
      case "IN_PRODUCTION":
        return {
          text: "Em Produção",
          color: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "SHIPPED":
        return {
          text: "Enviado",
          color: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "DELIVERED":
        return {
          text: "Entregue",
          color: "bg-purple-100 text-purple-800 border-purple-200",
        };
      case "CANCELED":
        return {
          text: "Cancelado",
          color: "bg-red-100 text-red-800 border-red-200",
        };
      default:
        return {
          text: status,
          color: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  const statusInfo = translateStatus(order.status);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 pt-24 pb-20">
      <Toaster />

      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#313b2f] flex items-center gap-3">
            Pedido #{order.id}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Realizado em: {new Date(order.createdAt).toLocaleString("pt-BR")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-bold"
          >
            <FaPrint /> Imprimir
          </button>
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold shadow-sm"
          >
            <FaArrowLeft /> Voltar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUNA ESQUERDA: LISTA DE PRODUTOS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-[#313b2f] flex items-center gap-2">
                <FaBoxOpen className="text-gray-400" /> Itens do Pedido (
                {order.items.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map((item: any) => {
                // Se for a cama personalizada (ID 34), a formatação é especial
                // 👉 PUXA OS DADOS DO LUGAR NOVO (attributes) OU DO ANTIGO
                const varSize =
                  item.variant?.attributes?.size || item.variant?.size;
                const varColor =
                  item.variant?.attributes?.color || item.variant?.color;
                const varComplement =
                  item.variant?.attributes?.complement ||
                  item.variant?.complement;
                const isCustom = item.product?.id === 34 && item.customData;
                const custom =
                  typeof item.customData === "string"
                    ? JSON.parse(item.customData)
                    : item.customData;

                return (
                  <div
                    key={item.id}
                    className="p-4 flex flex-col sm:flex-row gap-4 items-start"
                  >
                    <img
                      src={
                        item.product?.mainImage ||
                        "https://via.placeholder.com/100"
                      }
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-[#313b2f]">
                        {item.product?.name || "Produto Excluído"}
                      </h3>

                      {/* DETALHES DA VARIAÇÃO (Tamanho, Cor, SKU) */}
                      <div className="text-sm text-gray-500 mt-1 space-y-1">
                        {isCustom ? (
                          <div className="bg-yellow-50 p-2 rounded border border-yellow-100 text-xs">
                            <p>
                              <strong>Modelo:</strong> {custom?.modelo}
                            </p>
                            <p>
                              <strong>Tamanho:</strong> {custom?.tamanho}
                            </p>
                            <p>
                              <strong>LED:</strong> {custom?.kitLed}
                            </p>
                            {custom?.cores && (
                              <p>
                                <strong>Cores:</strong>{" "}
                                {Object.entries(custom.cores)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(", ")}
                              </p>
                            )}
                          </div>
                        ) : (
                          <>
                            {varSize && varSize !== "Tamanho Único" && (
                              <p>
                                <strong>Tamanho:</strong> {varSize}
                              </p>
                            )}
                            {varColor && varColor !== "Cor Única" && (
                              <p>
                                <strong>Cor:</strong> {varColor}
                              </p>
                            )}
                            {varComplement && (
                              <p>
                                <strong>Extra:</strong> {varComplement}
                              </p>
                            )}
                          </>
                        )}
                        <p className="text-xs text-gray-400 font-mono">
                          SKU: {item.variant?.sku || "S/N"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-[#313b2f]">
                        {formatCurrency(Number(item.price))}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qtd: {item.quantity}
                      </p>
                      <p className="font-bold text-[#ffd639] mt-2 border-t pt-1">
                        {formatCurrency(Number(item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: CLIENTE, ENDEREÇO E RESUMO */}
        <div className="space-y-6">
          {/* MUDAR STATUS DO PEDIDO */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#313b2f] mb-3 text-sm uppercase tracking-wider">
              Status do Pedido
            </h2>
            <div className="flex items-center gap-2">
              <select
                value={statusAcao}
                onChange={(e) => setStatusAcao(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#ffd639] outline-none font-bold text-gray-700"
              >
                <option value="PENDING">Pendente</option>
                <option value="PAID">Pago</option>
                <option value="IN_PRODUCTION">Em produção</option>
                <option value="SHIPPED">Enviado</option>
                <option value="DELIVERED">Entregue</option>
                <option value="CANCELED">Cancelado</option>
              </select>
              <button
                onClick={handleUpdateStatus}
                disabled={statusAcao === order.status || isSavingStatus}
                className="bg-[#313b2f] text-[#ffd639] px-4 py-2 rounded-lg font-bold text-sm hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSavingStatus ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaSave />
                )}{" "}
                Salvar
              </button>
            </div>
            <div className="mt-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}
              >
                Status Atual: {statusInfo.text}
              </span>
            </div>
          </div>

          {/* DADOS DO CLIENTE */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#313b2f] mb-3 flex items-center gap-2 pb-2 border-b border-gray-50">
              <FaUser className="text-gray-400" /> Cliente
            </h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong className="text-gray-800">Nome:</strong>{" "}
                {order.user?.name}
              </p>
              <p>
                <strong className="text-gray-800">Email:</strong>{" "}
                {order.user?.email}
              </p>
              <p>
                <strong className="text-gray-800">CPF/CNPJ:</strong>{" "}
                {order.user?.cpf || "Não informado"}
              </p>
              <p>
                <strong className="text-gray-800">Telefone:</strong>{" "}
                {order.user?.fone || "Não informado"}
              </p>
            </div>
          </div>

          {/* DADOS DE ENTREGA */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#313b2f] mb-3 flex items-center gap-2 pb-2 border-b border-gray-50">
              <FaMapMarkerAlt className="text-gray-400" /> Endereço de Entrega
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                {order.address?.street}, {order.address?.number}
              </p>
              {order.address?.complement && <p>{order.address.complement}</p>}
              <p>{order.address?.neighborhood}</p>
              <p>
                {order.address?.city} - {order.address?.state}
              </p>
              <p className="font-bold mt-2">CEP: {order.address?.zipCode}</p>
            </div>
          </div>

          {/* RESUMO FINANCEIRO */}
          <div className="bg-[#313b2f] p-5 rounded-2xl shadow-sm border border-[#ffd639]/20 text-white">
            <h2 className="font-bold text-[#ffd639] mb-3 flex items-center gap-2 pb-2 border-b border-gray-600">
              <FaCreditCard /> Resumo Financeiro
            </h2>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal Itens:</span>
                <span>
                  {formatCurrency(
                    Number(order.total) - Number(order.shippingCost),
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>{formatCurrency(Number(order.shippingCost))}</span>
              </div>
              <div className="flex justify-between">
                <span>Método:</span>
                <span className="uppercase">
                  {order.paymentMethod || "Não informado"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-600">
                <span className="font-bold text-white text-base">
                  Total Final:
                </span>
                <span className="font-bold text-[#ffd639] text-xl">
                  {formatCurrency(Number(order.total))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
