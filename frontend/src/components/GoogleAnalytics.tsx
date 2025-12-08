import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const GoogleAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // 1. Inicializa o GA apenas uma vez (se o ID existir)
        const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;

        if (gaId) {
            // Verifica se já foi inicializado para evitar warnings no console
            if (!(window as any).ga) {
                ReactGA.initialize(gaId);
            }

            // 2. Envia o "pageview" para a rota atual
            // O hitType "pageview" registra que uma página foi visitada
            ReactGA.send({
                hitType: 'pageview',
                page: location.pathname + location.search,
                title: document.title,
            });
        }
    }, [location]); // Executa toda vez que a rota mudar

    return null; // Este componente não renderiza nada visualmente
};

export default GoogleAnalytics;
