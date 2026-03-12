import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import {
  FaArrowLeft,
  FaFilePdf,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaMoneyBillWave,
  FaSpinner,
  FaTools,
} from "react-icons/fa";

// Tipo provisório para a página ler os dados completos
interface OrderDetail {
  id: number;
  createdAt: string;
  total: number | string;
  shippingFee: number | string;
  paymentMethod: string;
  status:
    | "PENDING"
    | "PAID"
    | "IN_PRODUCTION"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELED";
  invoiceUrl: string | null;
  items: Array<{
    id: number;
    quantity: number;
    price: number | string;
    product: {
      name: string;
      mainImage: string;
    };
  }>;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const DetalhesPedidoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError("Não foi possível carregar os detalhes desta encomenda.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const formatPrice = (val: number | string | any) =>
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

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "credit":
        return "Cartão de Crédito";
      case "debit":
        return "Cartão de Débito";
      case "pix":
        return "Pix";
      default:
        return "Não especificado";
    }
  };

  // Lógica da Barra de Progresso
  const statusFlow = [
    "PENDING",
    "PAID",
    "IN_PRODUCTION",
    "SHIPPED",
    "DELIVERED",
  ];
  const currentStepIndex = statusFlow.indexOf(order?.status || "PENDING");
  const isCanceled = order?.status === "CANCELED";

  const stepIcons = [
    <FaMoneyBillWave key="1" />,
    <FaCheckCircle key="2" />,
    <FaTools key="3" />,
    <FaTruck key="4" />,
    <FaBox key="5" />,
  ];
  const stepLabels = [
    "Aguardando Pagamento",
    "Pago",
    "Em Produção",
    "Enviado",
    "Entregue",
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          {error || "Encomenda não encontrada"}
        </h2>
        <Link to="/pedidos" className="text-[#313b2f] underline font-bold">
          Voltar aos meus pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-12 md:pt-32 pb-20 min-h-[75vh]">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-in fade-in duration-500">
        <div>
          <Link
            to="/pedidos"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#313b2f] transition-colors mb-2 font-medium"
          >
            <FaArrowLeft /> Voltar
          </Link>
          <h1 className="text-3xl font-bold text-[#313b2f]">
            Encomenda #{order.id}
          </h1>
          <p className="text-gray-500 mt-1">
            Realizada em {formatDate(order.createdAt)}
          </p>
        </div>

        {/* BOTÃO DA NOTA FISCAL */}
        {order.invoiceUrl ? (
          <a
            href={order.invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <FaFilePdf /> Baixar Nota Fiscal
          </a>
        ) : (
          <div
            className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl border border-gray-200 cursor-not-allowed"
            title="A Nota Fiscal será disponibilizada em breve"
          >
            <FaFilePdf /> Nota Fiscal Indisponível
          </div>
        )}
      </div>

      {/* BARRA DE PROGRESSO DO STATUS */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 animate-in slide-in-from-bottom-4 duration-500">
        {isCanceled ? (
          <div className="text-center py-6 text-red-500">
            <h2 className="text-2xl font-bold mb-2">Encomenda Cancelada</h2>
            <p>Infelizmente, esta encomenda foi cancelada.</p>
          </div>
        ) : (
          <div className="relative flex flex-col md:flex-row justify-between w-full">
            {/* Linha de fundo conectando as bolinhas */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 hidden md:block z-0 rounded-full"></div>

            {statusFlow.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div
                  key={step}
                  className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2 mb-6 md:mb-0"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 ${
                      isActive
                        ? "bg-[#313b2f] text-[#ffd639] shadow-lg scale-110"
                        : "bg-gray-100 text-gray-300"
                    }`}
                  >
                    {stepIcons[index]}
                  </div>
                  <div
                    className={`text-sm md:text-center font-bold ${isActive ? "text-[#313b2f]" : "text-gray-400"}`}
                  >
                    {stepLabels[index]}
                    {isCurrent && (
                      <span className="block text-xs font-normal text-gray-500 md:mt-1">
                        Status Atual
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUNA ESQUERDA: LISTA DE PRODUTOS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#313b2f] mb-6 pb-4 border-b border-gray-100">
              Itens Comprados
            </h2>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                    {item.product.mainImage ? (
                      <img
                        src={item.product.mainImage}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <FaBox />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Qtd: {item.quantity}
                    </p>
                  </div>
                  <div className="font-bold text-[#313b2f]">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: RESUMO E ENDEREÇO */}
        <div className="space-y-6">
          {/* Resumo Financeiro */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#313b2f] mb-4 pb-3 border-b border-gray-100">
              Resumo da Encomenda
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {formatPrice(Number(order.total) - Number(order.shippingFee))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span className="text-green-600">
                  {Number(order.shippingFee) === 0
                    ? "Grátis"
                    : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
                <span className="font-bold text-gray-800">Total Pago</span>
                <span className="text-xl font-bold text-[#313b2f]">
                  {formatPrice(order.total)}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">
                  Método de Pagamento
                </p>
                <p className="font-medium text-gray-800">
                  {getPaymentMethodName(order.paymentMethod)}
                </p>
              </div>
            </div>
          </div>

          {/* Endereço de Entrega */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#313b2f] mb-4 pb-3 border-b border-gray-100">
              Endereço de Entrega
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-bold text-gray-800">
                {order.address.street}, {order.address.number}
              </p>
              <p>{order.address.neighborhood}</p>
              <p>
                {order.address.city} - {order.address.state}
              </p>
              <p className="text-gray-400 font-mono mt-2">
                CEP: {order.address.zipCode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesPedidoPage;
