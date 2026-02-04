import React, { useEffect } from "react";
import { useOrderStore } from "../../store/OrderStore";
import { useAuthStore } from "../../store/AuthStore";
import { Navigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaTrashAlt,
  FaSpinner,
  FaBoxOpen,
  FaUser,
  FaClock,
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

  const canAccess =
    user &&
    (user.role === "ADMIN" || user.role === "DEV" || user.role === "SELLER");

  if (!canAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#313b2f]">
            <FaShoppingCart className="text-[#ffd639]" /> Pedidos
          </h1>
          <p className="text-gray-500 mt-1 ml-1">
            Gerencie e atualize o status das vendas.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 self-start">
          <FaBoxOpen /> {orders.length} Pedidos
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
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden"
          >
            {/* Faixa lateral colorida baseada no status */}
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
                <span className="font-medium">{order.user.name}</span>
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
                <ul className="list-disc pl-4 space-y-1">
                  {order.items.map((item) => (
                    <li key={item.id} className="text-xs">
                      <span className="font-bold">{item.quantity}x</span>{" "}
                      {item.product.name}
                    </li>
                  ))}
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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-yellow-50/30 transition-colors group"
              >
                <td className="p-5 font-mono text-gray-400 text-sm">
                  #{order.id}
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
                    {order.user.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.user.email}
                  </div>
                </td>
                <td className="p-5">
                  <ul className="list-disc pl-4 space-y-1">
                    {order.items.map((item) => (
                      <li key={item.id} className="text-sm text-gray-700">
                        <span className="font-bold text-gray-900">
                          {item.quantity}x
                        </span>{" "}
                        {item.product.name}
                      </li>
                    ))}
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
                  <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
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
                      {/* Seta customizada */}
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
                      onClick={() => handleDelete(order.id)}
                      title="Excluir Pedido"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mt-4">
          <FaBoxOpen className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhum pedido encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
