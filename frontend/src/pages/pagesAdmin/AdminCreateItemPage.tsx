import React from "react";
import { useAuthStore } from "../../store/AuthStore";
import { Link, Navigate } from "react-router-dom";
import {
  FaBox,
  FaListAlt,
  FaChartBar,
  FaImage,
  FaPlusCircle,
} from "react-icons/fa";

// Define as rotas administrativas e as permissões necessárias
interface AdminCard {
  title: string;
  description: string;
  IconComponent: React.ElementType;
  link: string;
  requiredRoles: ("DEV" | "ADMIN" | "SELLER")[];
}

const CREATE_ITEMS_MENU: AdminCard[] = [
  {
    title: "Criar Novo Aplique",
    description:
      "Cadastre novos desenhos, formas e cores de apliques para personalização.",
    IconComponent: FaBox,
    link: "/admin/apliques/new",
    requiredRoles: ["DEV", "ADMIN"],
  },
  {
    title: "Criar Novo Tecido",
    description:
      "Adicione novas opções de tecidos e estampas ao catálogo de produção.",
    IconComponent: FaListAlt,
    link: "/admin/tecidos/new",
    requiredRoles: ["DEV", "ADMIN"],
  },
  {
    title: "Criar Novo Sintético",
    description:
      "Gerencie as cores e materiais sintéticos disponíveis para os móveis.",
    IconComponent: FaChartBar,
    link: "/admin/sinteticos/new",
    requiredRoles: ["DEV", "ADMIN"],
  },
  {
    title: "Criar Novo Ambiente",
    description:
      "Adicione fotos inspiradoras de ambientes (Showroom) ao catálogo visual.",
    IconComponent: FaImage,
    link: "/admin/ambientes/new",
    requiredRoles: ["DEV", "ADMIN"],
  },
  {
    title: "Criar Novo Lençol",
    description:
      "Adicione novos lençóis ao catálogo, com opções de cores, tamanhos e estampas.",
    IconComponent: FaImage,
    link: "/admin/lencol/new",
    requiredRoles: ["DEV", "ADMIN"],
  },
];

const AdminCreateItemPage = () => {
  const { user } = useAuthStore();
  const currentUserRole = user?.role;

  // Garante que o usuário logado possui a role MÍNIMA para acessar esta página
  const canAccessPage =
    currentUserRole &&
    (currentUserRole === "ADMIN" ||
      currentUserRole === "DEV" ||
      currentUserRole === "SELLER");

  // Se o usuário não tiver a permissão correta, redireciona para o Dashboard
  if (!canAccessPage) {
    return <Navigate to="/dashboard" replace />;
  }

  // LÓGICA DE FILTRAGEM: Filtra os cards que o usuário tem permissão de ver
  const accessibleCards = CREATE_ITEMS_MENU.filter((card) =>
    card.requiredRoles.includes(currentUserRole),
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#313b2f]">
            <FaPlusCircle className="text-[#ffd639]" /> Cadastro de Itens
          </h1>
          <p className="text-gray-500 mt-2 ml-1">
            Bem-vindo(a),{" "}
            <span className="font-bold text-[#313b2f]">{user.name}</span>.
            Selecione o que deseja criar.
          </p>
        </div>
      </header>

      {/* Grid de Cards */}
      <div>
        <h2 className="text-xl font-bold text-[#313b2f] mb-6 border-l-4 border-[#ffd639] pl-3">
          Ferramentas de Criação
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {accessibleCards.map((card) => (
            <Link
              to={card.link}
              key={card.title}
              className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Ícone com fundo colorido */}
              <div className="w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center mb-5 group-hover:bg-[#ffd639] transition-colors duration-300">
                <card.IconComponent className="text-2xl text-[#ffd639] group-hover:text-[#313b2f] transition-colors duration-300" />
              </div>

              <h3 className="text-lg font-bold text-[#313b2f] mb-2 group-hover:text-[#ffd639] transition-colors">
                {card.title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                {card.description}
              </p>

              {/* Seta indicativa no hover */}
              <div className="mt-auto pt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-bold text-[#313b2f] uppercase tracking-wide">
                  Acessar &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {accessibleCards.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">
            Nenhuma ferramenta disponível para o seu perfil.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminCreateItemPage;
