import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';

const InternalAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Envia o caminho atual para o backend
        // Usamos um timeout pequeno para não travar a renderização inicial
        const register = async () => {
            try {
                await api.post('/analytics/visit', {
                    path: location.pathname + location.search,
                });
            } catch (error) {
                // Falha silenciosa para não atrapalhar o usuário
                console.error('Erro ao registrar analytics interno', error);
            }
        };

        register();
    }, [location]); // Executa a cada mudança de rota

    return null;
};

export default InternalAnalytics;
