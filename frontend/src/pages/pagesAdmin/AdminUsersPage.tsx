import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import {
  FaUsers,
  FaSearch,
  FaShoppingBag,
  FaPhone,
  FaCalendarAlt,
  FaSpinner,
  FaEye,
  FaUserShield,
  FaCode,
} from "react-icons/fa";

interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: string;
  fone: string | null;
  createdAt: string;
  _count: { orders: number };
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.id.toString().includes(term)
    );
  });

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <p className="text-lg font-medium">Carregando Clientes...</p>
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#313b2f] ">
            <FaUsers className="text-[#ffd639]" /> Gerenciar Clientes
          </h1>
          <p className="text-gray-500 mt-1 ml-1">
            Visualize e gerencie a base de usuários da loja.
          </p>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Pesquisar por nome, email ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all text-sm"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </header>

      {/* --- VERSÃO MOBILE (CARDS) --- */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-[#313b2f] text-lg flex items-center gap-2">
                  {user.name}
                  {user.role === "ADMIN" && (
                    <FaUserShield className="text-purple-600 text-xs" />
                  )}
                  {user.role === "DEV" && (
                    <FaCode className="text-gray-800 text-xs" />
                  )}
                </h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-mono">
                #{user.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <FaPhone className="text-gray-400" />
                <span>{user.fone || "-"}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <FaShoppingBag className="text-gray-400" />
                <span>{user._count.orders} pedidos</span>
              </div>
            </div>

            {user.role !== "USER" && (
              <div className="mt-1">
                <span
                  className={`inline-block px-2 py-1 rounded-md text-xs font-bold ${
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "SELLER"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            )}

            <button
              onClick={() => navigate(`/admin/users/${user.id}`)}
              className="mt-2 w-full py-2 bg-[#313b2f] text-white rounded-lg flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              <FaEye /> Ver Detalhes
            </button>
          </div>
        ))}
      </div>

      {/* --- VERSÃO DESKTOP (TABELA) --- */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
              <th className="p-5 w-20">ID</th>
              <th className="p-5">Nome / Role</th>
              <th className="p-5">Contato</th>
              <th className="p-5 text-center">Pedidos</th>
              <th className="p-5">Cadastro</th>
              <th className="p-5 text-center w-32">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-yellow-50/30 transition-colors group"
              >
                <td className="p-5 font-mono text-gray-400 text-sm">
                  #{user.id}
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#313b2f]">
                      {user.name}
                    </span>
                    {user.role === "ADMIN" && (
                      <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-purple-200">
                        ADMIN
                      </span>
                    )}
                    {user.role === "SELLER" && (
                      <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-blue-200">
                        SELLER
                      </span>
                    )}
                    {user.role === "DEV" && (
                      <span className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        DEV
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {user.email}
                  </div>
                </td>
                <td className="p-5 text-sm text-gray-600">
                  {user.fone ? (
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-300" /> {user.fone}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic text-xs">
                      Sem telefone
                    </span>
                  )}
                </td>
                <td className="p-5 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                      user._count.orders > 0
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-gray-50 text-gray-400 border border-gray-100"
                    }`}
                  >
                    <FaShoppingBag className="text-[10px]" />{" "}
                    {user._count.orders}
                  </span>
                </td>
                <td className="p-5 text-sm text-gray-500 flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-300" />
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-5 text-center">
                  <button
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100 inline-flex items-center gap-2 text-sm font-medium"
                    title="Ver Detalhes"
                  >
                    <FaEye />
                    <span className="hidden lg:inline">Detalhes</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mt-4">
          <FaSearch className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            Nenhum usuário encontrado.
          </p>
          {searchTerm && (
            <p className="text-sm text-gray-400 mt-1">
              Tente buscar por outro termo.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
