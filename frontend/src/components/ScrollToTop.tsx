import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Usa document.documentElement para garantir compatibilidade com estilos de html/body
        // O behavior: 'instant' é crucial para ignorar o 'scroll-behavior: smooth' do CSS
        document.documentElement.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
