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
} from "react-icons/fa";
import { SlLogin } from "react-icons/sl";

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
    title: "Mensagens",
    path: "/admin/contacts",
    icon: FaEnvelope,
    roles: ["DEV", "ADMIN", "SELLER"],
  },

  { title: "Logs", path: "/admin/logs", icon: SlLogin, roles: ["DEV"] },
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

  // Filtra itens baseados na role do usuário
  const filterItems = (items: typeof SIDEBAR_ITEMS) =>
    items.filter((item) => item.roles.includes(user.role as any));

  const menuItems = filterItems(SIDEBAR_ITEMS);
  const calcItems = filterItems(CALCULADORAS);

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      {/* --- SIDEBAR LATERAL ESQUERDA --- */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-gray-100 flex items-center justify-center">
          <h2 className="text-xl font-bold text-gray-800">
            Admin<span className="text-blue-600">Panel</span>
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-1">
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
              <item.icon className="text-lg" />
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
                <item.icon className="text-lg" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4 px-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
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
      <main className="flex-1 md:ml-64 p-6 md:p-8 overflow-x-hidden w-full">
        {/* O Outlet renderiza a página filha (AdminPage, ProductsPage, etc.) aqui dentro */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
