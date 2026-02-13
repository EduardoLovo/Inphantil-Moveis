import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { useCartStore } from "../store/CartStore";
import {
  FaBars,
  FaHome,
  FaUser,
  FaTimes,
  FaSignOutAlt,
  FaListUl,
  FaCog,
  FaSwatchbook,
  FaPuzzlePiece,
  FaCut,
  FaLayerGroup,
} from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { GrContact } from "react-icons/gr";

const LOGO_IMAGE = "/logo.svg";

const Header = () => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const cartCount = useCartStore((state) => state.getCount());

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCatalogOpen(false);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCatalogOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleCatalog = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCatalogOpen((prev) => !prev);
  };

  const canAccessAdmin =
    user &&
    (user.role === "ADMIN" || user.role === "DEV" || user.role === "SELLER");

  return (
    <>
      {/* --- HEADER DESKTOP (TOPO) --- */}
      {/* Alterações: fixed, bg-black/80, backdrop-blur, border-white/10 */}
      <header className="hidden md:flex bg-black/70 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-40 w-full h-20 border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={LOGO_IMAGE}
              alt="Inphantil Logo"
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            {/* Texto Amarelo Claro (#ffffbc) */}
            <h1 className="text-2xl font-bold text-[#ffffbc] tracking-tight ">
              Inphantil
            </h1>
          </Link>

          {/* NAVEGAÇÃO DESKTOP */}
          <nav className="flex items-center space-x-8">
            {/* Links agora são cinza claro (gray-200) e hover branco/amarelo */}
            <Link
              to="/"
              className="text-gray-200 hover:text-[#ffffbc] font-medium transition-colors"
            >
              Início
            </Link>
            <Link
              to="/pos-compra"
              className="text-gray-200 hover:text-[#ffffbc] font-medium transition-colors"
            >
              Pós-compra
            </Link>
            <Link
              to="/contact"
              className="text-gray-200 hover:text-[#ffffbc] font-medium transition-colors"
            >
              Contato
            </Link>

            {/* DROPDOWN CATÁLOGOS */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleCatalog}
                className="flex items-center gap-1 p-1 w-full text-gray-200 hover:text-[#ffffbc] font-medium transition-colors focus:outline-none"
              >
                Catálogos{" "}
                <span
                  className={`text-xs transition-transform duration-200 ${isCatalogOpen ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>

              {/* MENU DROPDOWN (Fundo Branco para legibilidade do menu) */}
              {isCatalogOpen && (
                <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 pb-2 mb-2 border-b border-gray-50">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Produtos
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <Link
                      to="/products"
                      className="px-6 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3"
                    >
                      <FaListUl className="text-gray-400" /> Todos Produtos
                    </Link>
                    <Link
                      to="/showroom"
                      className="px-6 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3"
                    >
                      <FaSwatchbook className="text-gray-400" /> Ambientes
                    </Link>
                    <Link
                      to="/sinteticos"
                      className="px-6 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3"
                    >
                      <FaSwatchbook className="text-gray-400" /> Cores Para Cama
                    </Link>
                    <Link
                      to="/sinteticos/tapetes"
                      className="px-6 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3"
                    >
                      <FaSwatchbook className="text-gray-400" /> Cores Para
                      Tapetes
                    </Link>
                    <Link
                      to="/apliques"
                      className="px-6 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3"
                    >
                      <FaPuzzlePiece className="text-gray-400" /> Apliques
                    </Link>
                    <Link
                      to="/tecidos-lencol"
                      className="px-6 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3"
                    >
                      <FaCut className="text-gray-400" /> Tecidos Para Lençol
                    </Link>
                    <Link
                      to="/lencois"
                      className="px-6 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3"
                    >
                      <FaCut className="text-gray-400" /> Lençois Pronta-entrega
                    </Link>
                  </div>

                  <div className="px-4 py-2 mt-2 border-t border-b border-gray-50 bg-gray-50/50">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Ferramentas
                    </span>
                  </div>
                  <div className="flex flex-col mt-2">
                    <Link
                      to="/composicao-sintetico"
                      className="px-6 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-3"
                    >
                      <FaLayerGroup className="text-gray-400" /> Simular Cama
                    </Link>
                    <Link
                      to="/composicao-lencol"
                      className="px-6 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-3"
                    >
                      <FaLayerGroup className="text-gray-400" /> Simular Lençol
                    </Link>
                    {isLoggedIn && canAccessAdmin && (
                      <div>
                        <Link
                          to="/composicao/protetores"
                          className="px-6 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-3"
                        >
                          <FaLayerGroup className="text-gray-400" /> Simular
                          Protetor
                        </Link>
                        <Link
                          to="/cotacao-frete"
                          className="px-6 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-3"
                        >
                          🚚 Cotação de Frete
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CARRINHO DESKTOP */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-200 hover:text-[#ffffbc] transition-colors group"
              title="Meu Carrinho"
            >
              <CiShoppingCart size={28} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white/20">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* PERFIL / LOGIN */}
            <div className="border-l pl-6 border-white/20 flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  {canAccessAdmin && (
                    <Link
                      to="/admin"
                      className="text-sm font-semibold text-purple-300 hover:text-purple-100 bg-purple-900/50 px-3 py-1.5 rounded-full transition-colors border border-purple-500/30"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-gray-200 hover:text-white"
                  >
                    Meu Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-400 hover:text-red-300 font-medium"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-200 hover:text-white"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-[#ffffbc] text-gray-900 text-sm font-bold rounded-lg hover:bg-white transition-colors shadow-sm hover:shadow-md"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* --- NAVEGAÇÃO MOBILE (BOTTOM BAR) --- */}
      {/* Mantém fundo branco no mobile para legibilidade na parte inferior */}
      <nav className="md:hidden fixed  bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center h-16 pb-safe">
        <Link
          to="/"
          className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 active:text-blue-700 gap-1"
        >
          <FaHome size={20} />
          <span className="text-[10px] font-medium">Início</span>
        </Link>

        <Link
          to="/cart"
          className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 active:text-blue-700 gap-1 relative"
        >
          <div className="relative">
            <CiShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Carrinho</span>
        </Link>

        <button
          className={`flex flex-col items-center justify-center w-full h-full gap-1 outline-none ${
            isMobileMenuOpen ? "text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          <span className="text-[10px] font-medium">Menu</span>
        </button>

        <Link
          to={isLoggedIn ? "/dashboard" : "/login"}
          className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 active:text-blue-700 gap-1"
        >
          <FaUser size={20} />
          <span className="text-[10px] font-medium">Perfil</span>
        </Link>
      </nav>

      {/* --- DRAWER MOBILE --- */}
      <div
        className={`fixed inset-0 z-50 md:hidden pointer-events-none ${isMobileMenuOpen ? "pointer-events-auto" : ""}`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`absolute top-0 left-0 bottom-16 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <span className="font-bold text-lg text-gray-800">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
            {isLoggedIn ? (
              <div className="bg-blue-50 p-4 rounded-xl mb-6">
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Olá, {user?.name}
                </p>
                <Link
                  to="/dashboard"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Ir para meu perfil
                </Link>
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded-xl mb-6 flex gap-3">
                <Link
                  to="/login"
                  className="flex-1 bg-white text-center py-2 rounded-lg text-sm font-bold text-gray-700 shadow-sm"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="flex-1 bg-blue-600 text-center py-2 rounded-lg text-sm font-bold text-white shadow-sm"
                >
                  Cadastrar
                </Link>
              </div>
            )}

            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-2">
              Navegação
            </p>
            <Link
              to="/pos-compra"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              <BsFillInfoCircleFill /> Informações Pós-compra
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              <GrContact /> Contato
            </Link>

            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">
              Catálogos
            </p>
            <Link
              to="/products"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              <FaListUl /> Todos Produtos
            </Link>
            <Link
              to="/showroom"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              <FaSwatchbook /> Ambientes
            </Link>
            <Link
              to="/sinteticos"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              <FaSwatchbook /> Cores Para Cama
            </Link>
            <Link
              to="/sinteticos/tapetes"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              <FaSwatchbook /> Cores Para Tapetes
            </Link>
            <Link
              to="/apliques"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              <FaPuzzlePiece /> Apliques
            </Link>
            <Link
              to="/tecidos-lencol"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              <FaCut /> Tecidos Para Lençol
            </Link>
            <Link
              to="/lencois"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              <FaCut /> Lençois Pronta-entrega
            </Link>

            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">
              Ferramentas
            </p>
            <Link
              to="/composicao-sintetico"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              <FaLayerGroup /> Simulador Cama
            </Link>
            <Link
              to="/composicao-lencol"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              <FaLayerGroup /> Simular Lençol
            </Link>
            {isLoggedIn && canAccessAdmin && (
              <div>
                <Link
                  to="/composicao/protetores"
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <FaLayerGroup /> Simular Protetor
                </Link>
                <Link
                  to="/cotacao-frete"
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  🚚 Cotação de Frete
                </Link>
              </div>
            )}

            {isLoggedIn && canAccessAdmin && (
              <>
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">
                  Administração
                </p>
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors font-medium"
                >
                  <FaCog /> Painel Admin
                </Link>
              </>
            )}
          </div>

          {isLoggedIn && (
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
              >
                <FaSignOutAlt /> Sair da conta
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
