import React, { useEffect } from 'react';
import { useTecidoStore } from '../store/TecidoStore';
import { useAuthStore } from '../store/AuthStore';
import './TecidosPage.css'; // Novo arquivo CSS

const TecidosPage: React.FC = () => {
    const { tecidos, isLoading, error, fetchTecidos } = useTecidoStore();
    const user = useAuthStore((state) => state.user);

    // Lógica para controle de estoque (visível apenas para Staff)
    const isStaff =
        user &&
        (user.role === 'ADMIN' ||
            user.role === 'DEV' ||
            user.role === 'SELLER');

    useEffect(() => {
        // Busca os tecidos na montagem
        if (tecidos.length === 0) {
            fetchTecidos();
        }
    }, [fetchTecidos, tecidos.length]);

    // Função para determinar as classes CSS (para estoque visual da equipe)
    const getCardClassName = (inStock: boolean): string => {
        let className = 'tecido-card';
        if (!isStaff) return className;

        className += inStock ? ' in-stock-staff' : ' out-of-stock-staff';
        return className;
    };

    if (isLoading) {
        return (
            <div className="tecido-page-container">
                <h1>Carregando Tecidos...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tecido-page-container">
                <h1>Erro ao carregar tecidos: {error}</h1>
            </div>
        );
    }

    return (
        <div className="tecido-page-container">
            <h1>Catálogo de Tecidos</h1>
            <p className="page-description">
                {isStaff
                    ? 'Visualização de Gestão: Todos os itens com status de estoque destacado.'
                    : 'Visualização Pública: Apenas tecidos em estoque.'}
            </p>

            <div className="tecido-grid">
                {tecidos.map((item) => (
                    <div
                        key={item.id}
                        className={getCardClassName(item.inStock)}
                    >
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="tecido-image"
                        />
                        <h3 className="tecido-title">{item.name}</h3>
                        <p className="tecido-description">{item.description}</p>
                    </div>
                ))}
            </div>

            {tecidos.length === 0 && (
                <p>Nenhum tecido cadastrado no momento.</p>
            )}
        </div>
    );
};

export default TecidosPage;
