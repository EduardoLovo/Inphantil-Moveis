import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import './Header.css'; // 1. NOVO ARQUIVO CSS
import { useEffect, useRef, useState } from 'react';

// Você deve adicionar a imagem da sua logo (ex: no public/logo.png)
const LOGO_IMAGE =
    'https://res.cloudinary.com/dtghitaah/image/upload/v1763574971/logo_vetor_xzh0vd.png';

const Header = () => {
    const { isLoggedIn, user, logout } = useAuthStore();
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
    };

    // 3. Lógica para fechar o dropdown quando o usuário clica fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Se o clique não estiver dentro do container do dropdown, feche-o
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsCatalogOpen(false);
            }
        }
        // Adiciona e remove o listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleCatalog = (e: React.MouseEvent) => {
        // 4. PREVINE a navegação padrão do Link e apenas alterna o estado
        e.preventDefault();
        setIsCatalogOpen((prev) => !prev);
    };

    const canAccessAdmin =
        user &&
        (user.role === 'ADMIN' ||
            user.role === 'DEV' ||
            user.role === 'SELLER');

    return (
        // Usa a classe para o header fixo
        <header className="main-header">
            <div className="header-content">
                {/* 2. Logo e Título (Colar a Imagem) */}
                <Link to="./" className="logo-section">
                    <img
                        src={LOGO_IMAGE}
                        alt="Inphantil Logo"
                        className="header-logo"
                    />
                    <h1 className="logo-title">Inphantil Móveis</h1>
                </Link>

                {/* 3. Navegação Dinâmica */}
                <nav className="main-nav">
                    <Link to="/">Início</Link>
                    <div
                        className={`nav-dropdown ${
                            isCatalogOpen ? 'is-open' : ''
                        }`} // Adiciona classe 'is-open'
                        ref={dropdownRef} // Atribui a referência
                    >
                        <Link
                            to="/products"
                            className="dropdown-toggle"
                            onClick={toggleCatalog} // Alterna no clique
                        >
                            Catálogo ▼
                        </Link>

                        <div className="dropdown-menu">
                            {/* Ao selecionar um item, fecha o dropdown */}
                            <span className="dropdown-section-title">
                                Composições
                            </span>
                            <Link
                                to="/apliques"
                                onClick={() => setIsCatalogOpen(false)}
                            >
                                Apliques
                            </Link>

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
                                to="/products?category=acessorios"
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
                            <Link
                                to="/products?category=protetores"
                                onClick={() => setIsCatalogOpen(false)}
                            >
                                Pantone
                            </Link>
                        </div>
                    </div>

                    {isLoggedIn ? (
                        <>
                            {/* LINK "ADM": Aparece SÓ se o usuário tiver as roles específicas */}
                            {canAccessAdmin && <Link to="/admin">Adm</Link>}
                            <span className="welcome-message">
                                Olá, {user?.name || 'Visitante'}!
                            </span>
                            <Link to="/dashboard">Meu perfil</Link>
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
            </div>
        </header>
    );
};

export default Header;
