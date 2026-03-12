import React, { useEffect } from "react";
import { useOrderStore } from "../store/OrderStore";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaChevronRight,
  FaSpinner,
  FaShoppingBag,
} from "react-icons/fa";

const MyOrdersPage: React.FC = () => {
  const { orders, fetchMyOrders, isLoading } = useOrderStore();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const formatPrice = (val: number | any) =>
    Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  // Dicionário de Cores e Nomes para os Status
  const statusConfig: Record<
    string,
    { label: string; color: string; bg: string }
  > = {
    PENDING: {
      label: "Aguardando Pagamento",
      color: "text-yellow-700",
      bg: "bg-yellow-100",
    },
    PAID: {
      label: "Pagamento Aprovado",
      color: "text-green-700",
      bg: "bg-green-100",
    },
    IN_PRODUCTION: {
      label: "Em Produção",
      color: "text-blue-700",
      bg: "bg-blue-100",
    },
    SHIPPED: {
      label: "Enviado",
      color: "text-purple-700",
      bg: "bg-purple-100",
    },
    DELIVERED: { label: "Entregue", color: "text-gray-700", bg: "bg-gray-200" },
    CANCELED: { label: "Cancelado", color: "text-red-700", bg: "bg-red-100" },
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-12 md:pt-32 pb-20 min-h-[75vh]">
      <div className="flex items-center gap-3 mb-8">
        <FaShoppingBag className="text-3xl text-[#313b2f]" />
        <h1 className="text-3xl font-bold text-[#313b2f]">Meus Pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <FaBoxOpen className="text-4xl text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Você ainda não fez nenhum pedido
          </h2>
          <p className="text-gray-500 mb-8">
            Que tal explorar nossos móveis e começar a decorar?
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#313b2f] text-white font-bold rounded-full hover:bg-[#ffd639] hover:text-[#313b2f] transition-all shadow-md"
          >
            Explorar Produtos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.PENDING;

            return (
              <Link
                key={order.id}
                to={`/pedidos/${order.id}`}
                className="block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#ffd639] transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Info Básica */}
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400 font-medium">
                      Pedido #{order.id}
                    </p>
                    <p className="text-gray-800 font-bold">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-bold ${config.bg} ${config.color}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Valor e Botão */}
                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                    <div className="text-right">
                      <p className="text-sm text-gray-400 font-medium">Total</p>
                      <p className="text-lg font-bold text-[#313b2f]">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#ffd639] group-hover:text-[#313b2f] transition-colors">
                      <FaChevronRight />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
