import { Link } from 'react-router-dom';
import './HomePage.css'; // 1. Importe o CSS
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useAuthStore } from '../store/AuthStore';
import { motion, type Variants } from 'framer-motion';

const HomePage = () => {
    const { isLoggedIn, user, logout } = useAuthStore();
    const handleLogout = () => {
        logout();
    };

    // 2. Configuração da Animação (Variantes)
    // Slide da Esquerda
    const slideInLeft: Variants = {
        hidden: { opacity: 0, x: -100 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    };

    // Slide da Direita (se quiser alternar)
    const slideInRight: Variants = {
        hidden: { opacity: 0, x: 100 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    };

    // Fade In Simples (para a imagem principal)
    const fadeIn: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 1 },
        },
    };

    return (
        <div className="home-page">
            {/* 3. CONTEÚDO PRINCIPAL (HERO SECTION) */}
            <main className="main-content">
                <motion.section
                    className="hero-section"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <div className="header-spacer"></div>

                    <motion.img
                        src="https://res.cloudinary.com/dtghitaah/image/upload/v1763578452/PHOTO-2021-10-07-19-27-57_o8idi8.jpg"
                        alt="Camas Montessorianas"
                        className="hero-image"
                        // Pequeno efeito de zoom na imagem ao carregar
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5 }}
                    />
                    <motion.div
                        className="hero-text-overlay"
                        // Texto sobe um pouquinho
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <h2>Bem-vindo(a) ao Mundo das Camas Montessorianas!</h2>
                        <p>
                            O melhor lugar para decorar o quartinho do seu bebê
                            com carinho e segurança.
                        </p>
                    </motion.div>
                </motion.section>

                {/* Futuro Conteúdo Abaixo da Imagem */}

                <motion.section
                    className="info-section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={slideInLeft}
                >
                    <h2>Nossos Produtos</h2>
                    <p>
                        Veja nossos produtos mais vendidos e encontre o item
                        perfeito para o seu lar.
                    </p>
                    <Link to="/products" className="cta-button">
                        Ver Catálogo Completo
                    </Link>
                </motion.section>
                <hr />
                <motion.section
                    className="info-section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={slideInRight}
                >
                    <h2>Whatsapp</h2>
                    <p>Pedido personalizado no whats, telefone 999999999</p>
                    <button className="cta-button">
                        <FaWhatsapp className="social-icon" />
                        <a
                            href="https://wa.me/5544999999999"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Whatsapp
                        </a>
                    </button>
                </motion.section>
                <hr />
                <motion.section
                    className="info-section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={slideInLeft}
                >
                    <h2>Instagram</h2>
                    <p>Siga-nos no Instagram para mais inspirações!</p>
                    seçao de feed
                </motion.section>
                <hr />
                <motion.section
                    className="info-section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={slideInRight}
                >
                    <h2>Fotos</h2>
                </motion.section>
            </main>
        </div>
    );
};

export default HomePage;
