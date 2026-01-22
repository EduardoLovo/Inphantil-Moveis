import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';

const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken);

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Salva o token e busca o usuário
            setToken(token).then(() => {
                // Redireciona para o dashboard após salvar
                navigate('/dashboard');
            });
        } else {
            // Se não tiver token, volta para o login
            navigate('/login');
        }
    }, [searchParams, navigate, setToken]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '1rem',
            }}
        >
            <div className="loading-spinner"></div>{' '}
            {/* Use seu spinner se tiver */}
            <h3>Autenticando com Google...</h3>
        </div>
    );
};

export default AuthCallbackPage;
