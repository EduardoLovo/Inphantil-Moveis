import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importe useLocation
import { useAuthStore } from '../store/AuthStore';
import {
    FaBed,
    FaBars,
    FaHome,
    FaUser,
    FaTimes,
    FaSignOutAlt,
    FaListUl,
    FaCog,
} from 'react-icons/fa';
import './Header.css';

const LOGO_IMAGE =
    'https://res.cloudinary.com/dtghitaah/image/upload/v1763574971/logo_vetor_xzh0vd.png';
const Header = () => {
    const { isLoggedIn, user, logout } = useAuthStore();
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // NOVO: Estado do Menu Mobile

    const dropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation(); // Para fechar o menu ao mudar de rota

    // Fecha o menu mobile ao mudar de rota
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsCatalogOpen(false);
    }, [location]);

    // Lógica de clique fora (Desktop Dropdown)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsCatalogOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
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

    // Verifica permissão de admin
    const canAccessAdmin =
        user &&
        (user.role === 'ADMIN' ||
            user.role === 'DEV' ||
            user.role === 'SELLER');

    return (
        <>
            <header className="main-header">
                <div className="header-content">
                    {/* --- LOGO (Apenas Desktop) --- */}
                    <Link to="/" className="logo-section desktop-only">
                        <img
                            src={LOGO_IMAGE}
                            alt="Inphantil Logo"
                            className="header-logo"
                        />{' '}
                        <h1 className="logo-title">Inphantil</h1>
                    </Link>

                    {/* --- NAVEGAÇÃO DESKTOP (Escondida no Mobile) --- */}
                    <nav className="main-nav desktop-only">
                        <Link to="/">Início</Link>

                        <div
                            className={`nav-dropdown ${
                                isCatalogOpen ? 'is-open' : ''
                            }`}
                            ref={dropdownRef}
                        >
                            <Link
                                to="/products"
                                className="dropdown-toggle"
                                onClick={toggleCatalog}
                            >
                                Catálogo ▼
                            </Link>
                            <div className="dropdown-menu">
                                <span className="dropdown-section-title">
                                    Composições
                                </span>
                                <Link
                                    to="/composicao-lencol"
                                    onClick={() => setIsCatalogOpen(false)}
                                >
                                    Lençois
                                </Link>
                                <Link
                                    to="/composicao-sintetico"
                                    onClick={() => setIsCatalogOpen(false)}
                                >
                                    Camas
                                </Link>
                                {canAccessAdmin && (
                                    <Link
                                        to="/composicao-protetores"
                                        onClick={() => setIsCatalogOpen(false)}
                                    >
                                        Protetores
                                    </Link>
                                )}
                                <span className="dropdown-section-title">
                                    Catálogos
                                </span>
                                <Link
                                    to="/apliques"
                                    onClick={() => setIsCatalogOpen(false)}
                                >
                                    Apliques
                                </Link>
                                <Link
                                    to="/"
                                    onClick={() => setIsCatalogOpen(false)}
                                >
                                    Apliques para Cabana
                                </Link>
                                <Link
                                    to="/sinteticos"
                                    onClick={() => setIsCatalogOpen(false)}
                                >
                                    Cores para camas
                                </Link>
                                <Link
                                    to="/products?category=protetores"
                                    onClick={() => setIsCatalogOpen(false)}
                                >
                                    Cores para tapete
                                </Link>
                                <Link
                                    to="/tecidos-lencol"
                                    onClick={() => setIsCatalogOpen(false)}
                                >
                                    Tecidos para Lençol
                                </Link>
                                <Link
                                    to="/products?category=protetores"
                                    onClick={() => setIsCatalogOpen(false)}
                                >
                                    Lençois Pronta-Entrega
                                </Link>
                                <span className="dropdown-section-title"></span>
                            </div>
                        </div>

                        {isLoggedIn ? (
                            <>
                                {canAccessAdmin && (
                                    <Link
                                        to="/admin"
                                        className="admin-link-desktop"
                                    >
                                        Adm
                                    </Link>
                                )}
                                <span className="welcome-message">
                                    Olá, {user?.name || 'Visitante'}!
                                </span>
                                <Link to="/dashboard">Dashboard</Link>
                                <button
                                    onClick={handleLogout}
                                    className="logout-button"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/register">Cadastre-se</Link>
                            </>
                        )}
                    </nav>

                    {/* --- NAVEGAÇÃO MOBILE (3 ÍCONES) --- */}
                    <nav className="mobile-nav-bar mobile-only">
                        {/* 1. CASA (Início) */}
                        <Link to="/" className="mobile-icon-link">
                            <FaHome size={24} />
                            <span>Início</span>
                        </Link>

                        {/* 2. HAMBURGUER (Abre o Menu) */}
                        <button
                            className={`mobile-icon-btn ${
                                isMobileMenuOpen ? 'active' : ''
                            }`}
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        >
                            {isMobileMenuOpen ? (
                                <FaTimes size={24} />
                            ) : (
                                <FaBars size={24} />
                            )}
                            <span>Menu</span>
                        </button>

                        {/* 3. USUÁRIO (Dashboard ou Login) */}
                        <Link
                            to={isLoggedIn ? '/dashboard' : '/login'}
                            className="mobile-icon-link"
                        >
                            <FaUser size={24} />
                            <span>{isLoggedIn ? 'Perfil' : 'Entrar'}</span>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* --- MENU GAVETA (DRAWER) MOBILE --- */}
            {/* Renderiza fora do header para facilitar o z-index */}
            <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="drawer-content">
                    <h3>Navegação</h3>
                    <Link to="/products" className="drawer-link">
                        <FaListUl /> Catálogo Completo
                    </Link>
                    <Link to="/sinteticos" className="drawer-link">
                        🎨 Sintéticos & Cores
                    </Link>
                    <Link to="/apliques" className="drawer-link">
                        🧩 Apliques
                    </Link>
                    <Link to="/tecidos-lencol" className="drawer-link">
                        🧵 Tecidos
                    </Link>
                    <Link to="/composicao-sintetico" className="drawer-link">
                        ✨ Simulador
                    </Link>
                    <Link to="/composicao-lencol" className="drawer-link">
                        ✨ Simulador
                    </Link>
                    <Link to="/simulador-sintetico" className="drawer-link">
                        ✨ Simulador
                    </Link>
                    <Link to="/simulador-sintetico" className="drawer-link">
                        ✨ Simulador
                    </Link>
                    <Link to="/simulador-sintetico" className="drawer-link">
                        ✨ Simulador
                    </Link>
                    <Link to="/simulador-sintetico" className="drawer-link">
                        ✨ Simulador
                    </Link>
                    <Link to="/simulador-sintetico" className="drawer-link">
                        ✨ Simulador
                    </Link>
                    <Link to="/simulador-sintetico" className="drawer-link">
                        ✨ Simulador
                    </Link>

                    {isLoggedIn && canAccessAdmin && (
                        <>
                            <hr />
                            <h3>Administração</h3>
                            <Link
                                to="/admin"
                                className="drawer-link admin-link"
                            >
                                <FaCog /> Painel Admin
                            </Link>
                        </>
                    )}

                    {isLoggedIn && (
                        <>
                            <hr />
                            <button
                                onClick={handleLogout}
                                className="drawer-link logout-link"
                            >
                                <FaSignOutAlt /> Sair da Conta
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Overlay escuro para fechar ao clicar fora */}
            {isMobileMenuOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
};

export default Header;
