import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { useCartStore } from '../store/CartStore'; // 1. IMPORTE A STORE DO CARRINHO
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
    FaCalculator,
    FaLayerGroup,
} from 'react-icons/fa';
import { CiShoppingCart } from 'react-icons/ci';
import './Header.css';

const LOGO_IMAGE = '/logo.svg';

const Header = () => {
    const { isLoggedIn, user, logout } = useAuthStore();

    // 2. PEGUE A CONTAGEM DA STORE
    // O Zustand vai renderizar o componente automaticamente quando isso mudar
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

    const canAccessAdmin =
        user &&
        (user.role === 'ADMIN' ||
            user.role === 'DEV' ||
            user.role === 'SELLER');

    return (
        <>
            <header className="main-header">
                <div className="header-content">
                    {/* --- LOGO --- */}
                    <Link to="/" className="logo-section desktop-only">
                        <img
                            src={LOGO_IMAGE}
                            alt="Inphantil Logo"
                            className="header-logo"
                        />
                        <h1 className="logo-title">Inphantil</h1>
                        <span className="welcome-message">
                            Olá, {user?.name || 'Visitante'}!
                        </span>
                    </Link>

                    {/* --- NAVEGAÇÃO DESKTOP --- */}
                    <nav className="main-nav desktop-only">
                        <Link to="/">Início</Link>
                        <Link to="/pos-venda">Informações pós venda</Link>
                        <Link to="/contact">Contato</Link>
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
                                Catálogos ▼
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
                                <span className="dropdown-section-title">
                                    Catálogos
                                </span>
                                <Link
                                    to="/apliques"
                                    onClick={() => setIsCatalogOpen(false)}
                                >
                                    Apliques para Lençol
                                </Link>
                                <Link
                                    to="/tecidos-lencol"
                                    onClick={() => setIsCatalogOpen(false)}
                                >
                                    Tecidos para Lençol
                                </Link>
                                <Link
                                    to="/sinteticos/tapetes"
                                    onClick={() => setIsCatalogOpen(false)}
                                >
                                    Cores para Tapete
                                </Link>
                                <Link
                                    to="/sinteticos"
                                    onClick={() => setIsCatalogOpen(false)}
                                >
                                    Cores para Cama
                                </Link>
                                <Link
                                    to="/showroom"
                                    onClick={() => setIsCatalogOpen(false)}
                                >
                                    Quartos
                                </Link>
                                <Link
                                    to="/products"
                                    onClick={() => setIsCatalogOpen(false)}
                                >
                                    Loja
                                </Link>
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

                                {/* 3. ÍCONE DO CARRINHO COM BADGE (Desktop) */}
                                <Link
                                    to="/cart"
                                    className="cart-icon-wrapper"
                                    title="Meu Carrinho"
                                >
                                    <CiShoppingCart size={28} />
                                    {cartCount > 0 && (
                                        <span className="cart-badge">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                <Link to="/dashboard">Meu Perfil</Link>
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

                    {/* --- NAVEGAÇÃO MOBILE --- */}
                    <nav className="mobile-nav-bar mobile-only">
                        <Link to="/" className="mobile-icon-link">
                            <FaHome size={24} />
                            <span>Início</span>
                        </Link>

                        {/* Botão Carrinho no Mobile (Central ou onde preferir) */}
                        <Link
                            to="/cart"
                            className="mobile-icon-link cart-icon-wrapper"
                        >
                            <CiShoppingCart size={28} />
                            {cartCount > 0 && (
                                <span className="cart-badge-mobile">
                                    {cartCount}
                                </span>
                            )}
                            <span>Cart</span>
                        </Link>

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

                        <Link
                            to={isLoggedIn ? '/dashboard' : '/login'}
                            className="mobile-icon-link"
                        >
                            <FaUser size={24} />
                            <span>Perfil</span>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* --- MENU GAVETA MOBILE --- */}
            <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="drawer-content">
                    <h3>Catálogos</h3>
                    <Link to="/products" className="drawer-link">
                        <FaListUl /> Todos Produtos
                    </Link>
                    <Link to="/sinteticos" className="drawer-link">
                        <FaSwatchbook /> Cores
                    </Link>
                    <Link to="/apliques" className="drawer-link">
                        <FaPuzzlePiece /> Apliques
                    </Link>
                    <Link to="/tecidos-lencol" className="drawer-link">
                        <FaCut /> Tecidos
                    </Link>
                    <Link to="/pos-venda" className="drawer-link">
                        <FaCut /> Informações pós venda
                    </Link>

                    <hr />
                    <h3>Ferramentas</h3>
                    <Link to="/composicao-sintetico" className="drawer-link">
                        <FaLayerGroup /> Simulador
                    </Link>
                    <Link to="/calculadora-colchao" className="drawer-link">
                        <FaCalculator /> Calculadora
                    </Link>

                    {/* Link Carrinho no Menu também */}
                    <Link to="/cart" className="drawer-link">
                        <CiShoppingCart size={20} /> Carrinho ({cartCount})
                    </Link>

                    {isLoggedIn && canAccessAdmin && (
                        <>
                            <hr />
                            <Link
                                to="/admin"
                                className="drawer-link admin-link"
                            >
                                <FaCog /> Admin
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
                                <FaSignOutAlt /> Sair
                            </button>
                        </>
                    )}
                </div>
            </div>

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
