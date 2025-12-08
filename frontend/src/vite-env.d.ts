/// <reference types="vite/client" />

// Declarações para o Swiper (remove o erro de importação do CSS)
declare module 'swiper/css';
declare module 'swiper/css/navigation';
declare module 'swiper/css/pagination';

// --- Correção para o Google Analytics ---
// Isso diz ao TypeScript: "Confie em mim, a variável 'ga' existe no objeto window"
interface Window {
    ga: any;
    gtag: any;
}
