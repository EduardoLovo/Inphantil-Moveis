import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();


    useEffect(() => {
        // Sempre que a rota (pathname) mudar, rola para o topo
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; // Este componente não renderiza nada visual
};

export default ScrollToTop;
