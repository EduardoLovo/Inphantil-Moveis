import { useEffect } from 'react';
import { useAuthStore } from '../store/AuthStore';
import { useNavigate } from 'react-router-dom';

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

    return (
        <div
            style={{
                maxWidth: '800px',
                margin: '50px auto',
                padding: '20px',
                border: '1px solid #007bff',
                borderRadius: '8px',
            }}
        >
            <h1>Dashboard Principal</h1>
            <p>Bem-vindo(a), **{user.name}**!</p>
            <p>Seu acesso é como: **{user.role}**</p>

            <hr />

            <h2>Informações da Conta</h2>
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>Telefone: {user.fone}</p>

            <button
                onClick={logout}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                Sair (Logout)
            </button>

            <div style={{ marginTop: '20px' }}>
                <h3>Navegação Rápida</h3>
                <p>
                    A partir daqui, você pode criar links para /products,
                    /orders, /categories, etc.
                </p>
            </div>
        </div>
    );
};

export default DashboardPage;
