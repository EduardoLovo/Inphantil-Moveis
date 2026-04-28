import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/AuthStore"; // 👈 Importamos para pegar o usuário logado
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaSpinner,
  FaBoxOpen,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa"; // 👈 Adicionamos ícones para editar

// Interfaces
interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: { name: string };
}

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface UserDetail {
  id: number;
  name: string;
  email: string;
  fone: string;
  cpf: string;
  role: string;
  createdAt: string;
  addresses: any[];
  orders: Order[];
}

// Configuração de cores para status (reaproveitando padrão)
const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PAID: "bg-green-100 text-green-800 border-green-200",
  IN_PRODUCTION: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED: "bg-gray-100 text-gray-800 border-gray-200",
  DELIVERED: "bg-green-600 text-white border-green-600",
  CANCELED: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  IN_PRODUCTION: "Em Produção",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

const AdminUserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore(); // 👈 Puxamos o usuário logado no painel

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // 👉 ESTADOS PARA A EDIÇÃO DE CARGO
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  useEffect(() => {
    if (id) fetchUserDetail();
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
      setNewRole(res.data.role); // Preenche o select com o cargo atual
    } catch (error) {
      alert("Erro ao carregar usuário");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  // 👉 FUNÇÃO PARA SALVAR O NOVO CARGO
  const handleUpdateRole = async () => {
    if (!user || newRole === user.role) {
      setIsEditingRole(false);
      return;
    }

    setIsUpdatingRole(true);
    try {
      // Faz o PATCH lá no seu NestJS
      await api.patch(`/users/${user.id}/role`, { role: newRole });

      // Atualiza a tela sem precisar recarregar a página
      setUser({ ...user, role: newRole });
      setIsEditingRole(false);
    } catch (error: any) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Erro ao atualizar cargo. Verifique suas permissões.",
      );
      setNewRole(user.role); // Volta o select pro original se der erro
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const formatPrice = (val: number) =>
    Number(val).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <p className="text-lg font-medium">Carregando Detalhes...</p>
      </div>
    );

  if (!user) return null;

  // 👉 VERIFICA SE QUEM TÁ LOGADO É DEV (Para mostrar o botão de editar)
  const isDev = currentUser?.role === "DEV";

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate("/admin/users")}
        className="flex items-center gap-2 text-gray-500 hover:text-[#313b2f] transition-colors font-medium mb-4"
      >
        <FaArrowLeft className="text-sm" /> Voltar para lista
      </button>

      {/* --- CARTÃO PRINCIPAL DO USUÁRIO --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#313b2f] mb-1">
              {user.name}
            </h1>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
                #{user.id}
              </span>
              <span>
                Cadastrado em {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* 👉 BLOCO DO CARGO (ROLE) */}
            {isEditingRole ? (
              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="text-sm font-bold bg-white border border-gray-300 rounded px-2 py-1 outline-none"
                  disabled={isUpdatingRole}
                >
                  <option value="USER">USER</option>
                  <option value="SELLER">SELLER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="DEV">DEV</option>
                </select>
                <button
                  onClick={handleUpdateRole}
                  disabled={isUpdatingRole}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                  title="Salvar"
                >
                  {isUpdatingRole ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaCheck />
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsEditingRole(false);
                    setNewRole(user.role);
                  }}
                  disabled={isUpdatingRole}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  title="Cancelar"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-700 border-purple-200"
                      : user.role === "SELLER"
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : user.role === "DEV"
                          ? "bg-gray-800 text-white border-gray-800"
                          : "bg-green-50 text-green-700 border-green-100"
                  }`}
                >
                  {user.role}
                </span>

                {/* Mostra o botão de lápis apenas se o usuário logado for DEV */}
                {isDev && (
                  <button
                    onClick={() => setIsEditingRole(true)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                    title="Alterar cargo"
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
            )}

            <span className="text-sm font-medium text-gray-600 flex items-center gap-1 mt-1">
              <FaShoppingBag className="text-gray-400" /> {user.orders.length}{" "}
              Pedidos
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coluna 1: Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#313b2f] flex items-center gap-2 border-l-4 border-[#ffd639] pl-3">
              Dados de Contato
            </h3>
            <div className="space-y-3 pl-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <FaEnvelope />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-bold uppercase">
                    Email
                  </span>
                  {user.email}
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <FaPhone />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-bold uppercase">
                    Telefone
                  </span>
                  {user.fone || (
                    <span className="text-gray-400 italic">Não informado</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <FaIdCard />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-bold uppercase">
                    CPF
                  </span>
                  {user.cpf || (
                    <span className="text-gray-400 italic">Não informado</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Endereços */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#313b2f] flex items-center gap-2 border-l-4 border-[#ffd639] pl-3">
              Endereços
            </h3>
            <div className="pl-4">
              {user.addresses.length === 0 ? (
                <p className="text-gray-400 italic text-sm">
                  Nenhum endereço cadastrado.
                </p>
              ) : (
                <ul className="space-y-3">
                  {user.addresses.map((addr: any) => (
                    <li
                      key={addr.id}
                      className="flex gap-3 text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100"
                    >
                      <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">
                          {addr.street}, {addr.number}
                        </p>
                        <p className="text-gray-500">
                          {addr.city}/{addr.state} • CEP: {addr.zipCode}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- HISTÓRICO DE PEDIDOS --- */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-[#313b2f] mb-4 flex items-center gap-2">
          <FaBoxOpen className="text-[#ffd639]" /> Histórico de Pedidos
        </h3>

        {user.orders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Este usuário ainda não fez pedidos.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {user.orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-50 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#313b2f]">
                      Pedido #{order.id}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        <span className="font-bold">{item.quantity}x</span>{" "}
                        {item.product.name}
                      </span>
                      <span className="text-gray-500 font-mono">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetailsPage;
