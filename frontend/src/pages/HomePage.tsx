import { Link } from 'react-router-dom';
import './HomePage.css'; // 1. Importe o CSS

const HomePage = () => {
    return (
        <div className="home-page">
            {/* 3. CONTEÚDO PRINCIPAL (HERO SECTION) */}
            <main className="main-content">
                <section className="hero-section">
                    {/* O header-spacer é para empurrar o conteúdo abaixo do header fixo */}
                    <div className="header-spacer"></div>

                    <img
                        src="https://res.cloudinary.com/dtghitaah/image/upload/v1763578452/PHOTO-2021-10-07-19-27-57_o8idi8.jpg"
                        alt="Camas Montessorianas"
                        className="hero-image"
                    />
                    <div className="hero-text-overlay">
                        <h2>Bem-vindo(a) ao Mundo das Camas Montessorianas!</h2>
                        <p>
                            O melhor lugar para decorar o quartinho do seu bebê
                            com carinho e segurança.
                        </p>
                    </div>
                </section>

                {/* Futuro Conteúdo Abaixo da Imagem */}
                <section className="info-section">
                    <h2>Nossos Produtos</h2>
                    <p>
                        Veja nossos produtos mais vendidos e encontre o item
                        perfeito para o seu lar.
                    </p>
                    <Link to="/products" className="cta-button">
                        Ver Catálogo Completo
                    </Link>
                </section>
            </main>
        </div>
    );
};

export default HomePage;
