import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaHome,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPlus,
  FaRegEdit,
  FaSignOutAlt,
  FaTrash,
  FaUserCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { api } from "../services/api";
import AddressForm from "../components/AddressForm";
import { useOrderStore } from "../store/OrderStore";
import type { Address } from "../types/address";
import axios from "axios";

const STATUS_MAP: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  IN_PRODUCTION: "Em Produção",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

// Cores dos badges de status (reutilizando padrão)
const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PAID: "bg-green-100 text-green-800 border-green-200",
  IN_PRODUCTION: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED: "bg-gray-100 text-gray-800 border-gray-200",
  DELIVERED: "bg-green-600 text-white border-green-600",
  CANCELED: "bg-red-100 text-red-800 border-red-200",
};

const DashboardPage = () => {
  const { user, isLoggedIn, logout } = useAuthStore();
  const { orders, fetchMyOrders, isLoading: ordersLoading } = useOrderStore();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchMyOrders();
      fetchAddresses();
    }
  }, [isLoggedIn, navigate, fetchMyOrders]);

  const fetchAddresses = async () => {
    try {
      const response = await api.get("/addresses");
      setAddresses(response.data);
    } catch (error) {
      console.error("Erro ao buscar endereços");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este endereço?")) {
      try {
        await api.delete(`/addresses/${id}`);
        fetchAddresses();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          alert(error.response.data.message);
        } else {
          alert("Erro ao excluir endereço.");
        }
      }
    }
  };

  const handleAddressSuccess = () => {
    setShowAddressModal(false);
    fetchAddresses();
  };

  const handleLogout = () => {
    logout();
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR");

  const formatPrice = (val: number) =>
    Number(val).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  if (!user || !isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-500 animate-pulse">
        <h1 className="text-xl font-bold">Carregando Perfil...</h1>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8  md:pt-32 pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* --- CABEÇALHO DO PERFIL --- */}
        <div className="bg-[#313b2f] p-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-white/10 p-4 rounded-full">
              <FaUserCircle className="text-[#ffd639] text-5xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white ">
                Olá, <span className="text-[#ffd639]">{user.name}</span>
              </h1>
              <p className="text-gray-300 text-sm mt-1">{user.email}</p>

              {user.role !== "USER" && (
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wide">
                  <FaShieldAlt /> {user.role}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-bold border border-red-500/30"
          >
            <FaSignOutAlt /> Sair
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-10">
          {/* --- DADOS PESSOAIS --- */}
          <section>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#313b2f] flex items-center gap-2">
                <FaInfoCircle className="text-[#ffd639]" /> Meus Dados
              </h2>
              <Link
                to="/profile/edit"
                className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1"
              >
                <FaRegEdit /> Editar
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase">
                  Email
                </span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase">
                  Telefone
                </span>
                <span className="font-medium">
                  {user.fone || "Não informado"}
                </span>
              </div>
            </div>
          </section>

          {/* --- MEUS PEDIDOS --- */}
          <section>
            <h2 className="text-xl font-bold text-[#313b2f] flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <FaBoxOpen className="text-[#ffd639]" /> Meus Pedidos
            </h2>

            {ordersLoading ? (
              <p className="text-gray-500 animate-pulse">
                Carregando pedidos...
              </p>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">
                  Você ainda não fez nenhum pedido.
                </p>
                <Link
                  to="/products"
                  className="inline-block mt-3 text-blue-600 font-bold hover:underline"
                >
                  Ir para a Loja
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 pb-3 border-b border-gray-50 gap-2">
                      <div>
                        <span className="font-bold text-[#313b2f]">
                          Pedido #{order.id}
                        </span>
                        <span className="text-gray-400 mx-2">|</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {STATUS_MAP[order.status] || order.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {order.items?.length} item(s)
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {formatPrice(order.total)}
                      </div>
                    </div>

                    {/* Lista resumida de produtos */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.items?.map((item) => (
                        <span
                          key={item.id}
                          className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded border border-gray-100"
                        >
                          {item.quantity}x {item.product?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* --- MEUS ENDEREÇOS --- */}
          <section>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#313b2f] flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#ffd639]" /> Endereços
              </h2>
              <button
                onClick={() => setShowAddressModal(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FaPlus /> Novo
              </button>
            </div>

            {addresses.length === 0 ? (
              <p className="text-gray-500 italic">
                Nenhum endereço cadastrado.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm group hover:border-[#ffd639] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <strong className="text-[#313b2f]">
                        {addr.recipientName}
                      </strong>
                      {addr.isDefault && (
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          Padrão
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        {addr.street}, {addr.number}
                      </p>
                      <p>
                        {addr.neighborhood} - {addr.city}/{addr.state}
                      </p>
                      <p className="font-mono text-xs text-gray-500">
                        {addr.zipCode}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"
                      title="Excluir endereço"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* --- ATALHOS --- */}
          <section className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">
              Acesso Rápido
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-sm transition-colors"
              >
                <FaHome /> Ir para Loja
              </Link>
              {user.role !== "USER" && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 bg-[#313b2f] hover:bg-gray-800 text-white rounded-lg font-bold text-sm transition-colors shadow-md shadow-gray-300"
                >
                  <FaShieldAlt /> Painel Administrativo
                </Link>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* MODAL DE ENDEREÇO */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Novo Endereço</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <AddressForm
                onSuccess={handleAddressSuccess}
                onCancel={() => setShowAddressModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
