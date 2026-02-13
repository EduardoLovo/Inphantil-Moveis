import React from "react";
import { Outlet, NavLink, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import {
  FaBox,
  FaListAlt,
  FaChartBar,
  FaPalette,
  FaCalculator,
  FaEnvelope,
  FaHome,
  FaSignOutAlt,
  FaUserAlt,
  FaMoneyBillAlt,
  FaTruck,
} from "react-icons/fa";
import { SlLogin } from "react-icons/sl";
import { RiScissorsCutFill } from "react-icons/ri";

// Definição dos itens do menu lateral
const SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: FaHome,
    roles: ["DEV", "ADMIN", "SELLER"],
    end: true,
  },
  {
    title: "Protetores",
    path: "/composicao/protetores",
    icon: FaPalette,
    roles: ["DEV", "ADMIN", "SELLER"],
    end: true,
  },
  {
    title: "Solicitar Cotações",
    path: "/cotacao-frete",
    icon: FaTruck,
    roles: ["DEV", "ADMIN", "SELLER"],
    end: true,
  },
  {
    title: "Cotações",
    path: "/admin/cotacoes",
    icon: FaTruck,
    roles: ["DEV", "ADMIN", "SELLER"],
    end: true,
  },
  {
    title: "Pesquisar Frete",
    path: "/cotacoes/pesquisa",
    icon: FaTruck,
    roles: ["DEV", "ADMIN", "SELLER"],
    end: true,
  },
  {
    title: "Categorias",
    path: "/admin/categories",
    icon: FaListAlt,
    roles: ["DEV", "ADMIN"],
  },
  {
    title: "Produtos",
    path: "/admin/products",
    icon: FaBox,
    roles: ["DEV", "ADMIN"],
  },
  {
    title: "Criar Item",
    path: "/admin/create/item",
    icon: FaBox,
    roles: ["DEV", "ADMIN"],
  },
  {
    title: "Pedidos",
    path: "/admin/orders",
    icon: FaChartBar,
    roles: ["DEV", "ADMIN"],
  },
  {
    title: "Usuarios",
    path: "/admin/users",
    icon: FaUserAlt,
    roles: ["DEV", "ADMIN", "SELLER"],
  },
  {
    title: "Mensagens",
    path: "/admin/contacts",
    icon: FaEnvelope,
    roles: ["DEV", "ADMIN", "SELLER"],
  },
  { title: "Logs", path: "/admin/logs", icon: SlLogin, roles: ["DEV"] },
  {
    title: "Apliques Para Cortar",
    path: "/admin/low-stock-apliques",
    icon: RiScissorsCutFill,
    roles: ["DEV", "ADMIN"],
  },
  {
    title: "Apliques Para Comprar",
    path: "/admin/restock-apliques",
    icon: FaMoneyBillAlt,
    roles: ["DEV", "ADMIN"],
  },
];

const CALCULADORAS = [
  {
    title: "Cama Sob Medida",
    path: "/calculadora-cama-sob-medida",
    icon: FaCalculator,
    roles: ["DEV", "ADMIN", "SELLER"],
  },
  {
    title: "Colchão",
    path: "/calculadora-medida-do-colchao",
    icon: FaCalculator,
    roles: ["DEV", "ADMIN", "SELLER"],
  },
  {
    title: "Calc 60/40",
    path: "/calculadora-6040",
    icon: FaCalculator,
    roles: ["DEV", "ADMIN", "SELLER"],
  },
];

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  const filterItems = (items: typeof SIDEBAR_ITEMS) =>
    items.filter((item) => item.roles.includes(user.role as any));

  const menuItems = filterItems(SIDEBAR_ITEMS);
  const calcItems = filterItems(CALCULADORAS);

  return (
    <div className="flex min-h-screen md:pt-20 bg-gray-100">
      <aside className="w-64  bg-white pt-20 border-r border-gray-200 fixed inset-y-0 left-0 h-screen hidden md:flex flex-col z-20">
        {/* Cabeçalho do Menu (Fixo) */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-center shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            Admin<span className="text-blue-600"> Paneil</span>
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Geral
          </p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <item.icon className="text-lg shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-100">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Ferramentas
            </p>
            {calcItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-green-50 text-green-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="text-lg shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Rodapé do Menu (Perfil/Sair) - Agora ficará sempre fixo no fundo */}
        <div className="p-4 border-t border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-3 mb-4 px-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <FaSignOutAlt /> Sair
          </button>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL (DIREITA) --- */}
      <main className="flex-1 md:ml-64 overflow-x-hidden w-full flex flex-col min-h-screen">
        {/* Wrapper do conteúdo com padding e crescimento para empurrar o footer */}
        <div className="flex-1 p-6 md:p-8  ">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
