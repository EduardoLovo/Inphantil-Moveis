import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import './Header.css'; // 1. NOVO ARQUIVO CSS

// Você deve adicionar a imagem da sua logo (ex: no public/logo.png)
const LOGO_IMAGE =
    'https://res.cloudinary.com/dtghitaah/image/upload/v1763574971/logo_vetor_xzh0vd.png';

const Header = () => {
    const { isLoggedIn, user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
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
                <div className="logo-section">
                    <img
                        src={LOGO_IMAGE}
                        alt="Inphantil Logo"
                        className="header-logo"
                    />
                    <h1 className="logo-title">Inphantil</h1>
                </div>

                {/* 3. Navegação Dinâmica */}
                <nav className="main-nav">
                    <Link to="/">Início</Link>
                    <Link to="/products">Catálogo</Link>

                    {isLoggedIn ? (
                        <>
                            {/* LINK "ADM": Aparece SÓ se o usuário tiver as roles específicas */}
                            {canAccessAdmin && (
                                <Link
                                    to="/admin"
                                    style={{ fontWeight: 'bold', color: 'red' }}
                                >
                                    Adm
                                </Link>
                            )}
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
