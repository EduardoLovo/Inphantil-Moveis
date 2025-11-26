import { useEffect } from 'react';
import { useAuthStore } from '../store/AuthStore';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaInfoCircle,
    FaSignOutAlt,
    FaUserCircle,
} from 'react-icons/fa';
import './DashboardPage.css';

const DashboardPage = () => {
    // Pega o estado e o método de logout
    const { user, isLoggedIn, logout } = useAuthStore();
    const navigate = useNavigate();

    // Efeito para redirecionar se não estiver logado
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    // Se o estado ainda não carregou o usuário (pode acontecer no primeiro carregamento)
    if (!user || !isLoggedIn) {
        return <h1>Carregando...</h1>;
    }

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="dashboard-container">
            <div className="profile-card">
                <h1 className="profile-card-title">
                    <FaUserCircle className="profile-icon" /> Meu Perfil
                </h1>

                <p className="welcome-message">
                    Bem-vindo(a),{' '}
                    <span className="user-name-highlight">{user.name}</span>!
                </p>
                {/* <p className="role-message">
                    Seu acesso é como:{' '}
                    <strong className="role-highlight">{user.role}</strong>
                </p> */}

                <hr className="profile-divider" />

                <h2 className="info-section-title">
                    <FaInfoCircle className="info-icon" /> Informações da Conta
                </h2>

                <div className="info-detail-group">
                    {/* <div className="info-detail">
                        <label>ID:</label>
                        <p>{user.id}</p>
                    </div> */}
                    <div className="info-detail">
                        <label>Email:</label>
                        <p>{user.email}</p>
                    </div>
                    <div className="info-detail">
                        <label>Telefone:</label>
                        <p>{user.fone}</p>
                    </div>
                </div>

                <div className="quick-nav-section">
                    <h3 className="quick-nav-title">Navegação Rápida</h3>
                    <div className="quick-nav-links">
                        <Link to="/products" className="nav-link">
                            <FaHome /> Catálogo
                        </Link>
                        {user.role !== 'USER' && (
                            <Link to="/admin" className="nav-link admin-link">
                                Acesso Admin
                            </Link>
                        )}
                    </div>
                </div>

                <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt /> Sair (Logout)
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;
