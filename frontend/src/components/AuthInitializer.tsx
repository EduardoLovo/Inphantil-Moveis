import React, { useEffect } from 'react';
import { useAuthStore } from '../store/AuthStore';

// Componente wrapper que garante que o estado de autenticação seja carregado antes do App.
const AuthInitializer: React.FC<React.PropsWithChildren> = ({ children }) => {
    const initialize = useAuthStore((state) => state.initialize);
    const isInitialized = useAuthStore((state) => state.isInitialized);

    useEffect(() => {
        // Se a inicialização ainda não ocorreu, chame a função
        if (!isInitialized) {
            initialize();
        }
    }, [initialize, isInitialized]);

    // Se o processo de inicialização ainda não terminou, mostre a tela de carregamento
    if (!isInitialized) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h2>Inicializando Aplicação...</h2>
                <p>Verificando sua sessão. Por favor, aguarde.</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthInitializer;
