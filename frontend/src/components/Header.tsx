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
    FaLayerGroup,
} from 'react-icons/fa';
import { CiShoppingCart } from 'react-icons/ci';
import './Header.css';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { GrContact } from 'react-icons/gr';

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
                        {/* <span className="welcome-message">
                            Olá, {user?.name || 'Visitante'}!
                        </span> */}
                    </Link>

                    {/* --- NAVEGAÇÃO DESKTOP --- */}
                    <nav className="main-nav desktop-only">
                        <Link to="/">Início</Link>
                        <Link to="/pos-compra">Informações pós compra</Link>
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
                                <h3>Catálogos</h3>
                                <Link to="/products">
                                    <FaListUl /> Todos Produtos
                                </Link>
                                <Link to="/sinteticos">
                                    <FaSwatchbook /> Cores Para Cama
                                </Link>
                                <Link to="/sinteticos/tapetes">
                                    <FaSwatchbook /> Cores Para Tapetes
                                </Link>
                                <Link to="/apliques">
                                    <FaPuzzlePiece /> Apliques
                                </Link>
                                <Link to="/tecidos-lencol">
                                    <FaCut /> Tecidos Para Lençol
                                </Link>
                                <Link to="/pos-compra">
                                    <BsFillInfoCircleFill /> Informações pós
                                    compra
                                </Link>

                                <hr />
                                <h3>Ferramentas</h3>
                                <Link to="/composicao-sintetico">
                                    <FaLayerGroup /> Simulador Composições Camas
                                </Link>
                                {isLoggedIn && canAccessAdmin && (
                                    <Link to="/composicao/protetores">
                                        <FaLayerGroup /> Simulador Composições
                                        Protetores
                                    </Link>
                                )}
                                <Link to="/composicao-lencol">
                                    <FaLayerGroup /> Simulador Composições
                                    Lençois
                                </Link>

                                <hr />
                                <h3>Perfil</h3>
                                <Link to="/cart">
                                    <CiShoppingCart size={20} /> Carrinho (
                                    {cartCount})
                                </Link>

                                {isLoggedIn && canAccessAdmin ? (
                                    <>
                                        <Link
                                            to="/admin"
                                            className="admin-link"
                                        >
                                            <FaCog /> Admin
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        to={
                                            isLoggedIn ? '/dashboard' : '/login'
                                        }
                                        className="drawer-link"
                                    >
                                        <FaUser size={24} />
                                        <span>Perfil</span>
                                    </Link>
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
                    <Link to="/pos-compra" className="drawer-link">
                        <BsFillInfoCircleFill /> Informações pós compra
                    </Link>
                    <Link to="/pos-venda" className="drawer-link">
                        <GrContact /> Contato
                    </Link>
                    <h3>Catálogos</h3>
                    <Link to="/products" className="drawer-link">
                        <FaListUl /> Todos Produtos
                    </Link>
                    <Link to="/sinteticos" className="drawer-link">
                        <FaSwatchbook /> Cores Para Cama
                    </Link>
                    <Link to="/sinteticos" className="drawer-link">
                        <FaSwatchbook /> Cores Para Tapetes
                    </Link>
                    <Link to="/apliques" className="drawer-link">
                        <FaPuzzlePiece /> Apliques
                    </Link>
                    <Link to="/tecidos-lencol" className="drawer-link">
                        <FaCut /> Tecidos Para Lençol
                    </Link>

                    <hr />
                    <h3>Ferramentas</h3>
                    <Link to="/composicao-sintetico" className="drawer-link">
                        <FaLayerGroup /> Simulador Composições Camas
                    </Link>
                    {isLoggedIn && canAccessAdmin && (
                        <Link
                            to="/composicao/protetores"
                            className="drawer-link"
                        >
                            <FaLayerGroup /> Simulador Composições Protetores
                        </Link>
                    )}
                    <Link to="/composicao-lencol" className="drawer-link">
                        <FaLayerGroup /> Simulador Composições Lençois
                    </Link>

                    <hr />
                    <h3>Perfil</h3>
                    <Link to="/cart" className="drawer-link">
                        <CiShoppingCart size={20} /> Carrinho ({cartCount})
                    </Link>

                    {isLoggedIn && canAccessAdmin ? (
                        <>
                            <Link
                                to="/admin"
                                className="drawer-link admin-link"
                            >
                                <FaCog /> Admin
                            </Link>
                        </>
                    ) : (
                        <Link
                            to={isLoggedIn ? '/dashboard' : '/login'}
                            className="drawer-link"
                        >
                            <FaUser size={24} />
                            <span>Perfil</span>
                        </Link>
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
