import { useAuthStore } from '../store/AuthStore';
import { Navigate, Outlet } from 'react-router-dom';

// Este componente verifica se o usuário está logado
const AuthGuard = () => {
    const { isLoggedIn } = useAuthStore();

    if (!isLoggedIn) {
        // Se não estiver logado, redireciona para a página de login
        return <Navigate to="/login" replace />;
    }

    // Se estiver logado, renderiza as rotas filhas
    return <Outlet />;
};

export default AuthGuard;
