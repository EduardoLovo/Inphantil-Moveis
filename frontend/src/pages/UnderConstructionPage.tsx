// frontend/src/pages/UnderConstructionPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './UnderConstructionPage.css';

const UnderConstructionPage: React.FC = () => {
    return (
        <div className="construction-container">
            {/* Elementos decorativos de fundo */}

            <div className="construction-content">
                <h1 className="construction-title">Estamos em Obras!</h1>

                <p className="construction-text">
                    Estamos preparando algo muito especial para o quarto dos
                    pequenos.
                    <br />
                    Esta página está sendo construída com muito carinho e em
                    breve estará disponível.
                </p>

                <Link to="/" className="back-button">
                    Voltar para o Início
                </Link>
            </div>
        </div>
    );
};

export default UnderConstructionPage;
