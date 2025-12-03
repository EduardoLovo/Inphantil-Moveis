import { Link } from 'react-router-dom';
import './HomePage.css'; // 1. Importe o CSS
import { FaCamera, FaInstagram, FaTimes, FaWhatsapp } from 'react-icons/fa';
import { motion, type Variants } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useState } from 'react';

const AMBIENTES = [
    {
        id: 1,
        title: 'Quarto Selva Mágica',
        cover: 'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg', // Capa
        gallery: [
            // Fotos internas
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
        ],
    },
    {
        id: 2,
        title: 'Cantinho da Leitura',
        cover: 'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
        gallery: [
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
        ],
    },
    {
        id: 3,
        title: 'Sonho de Princesa',
        cover: 'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
        gallery: [
            'https://res.cloudinary.com/dtghitaah/image/upload/v1763572690/cld-sample-3.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1763572688/cld-sample.jpg',
        ],
    },
    {
        id: 4,
        title: 'Sonho de Princesa',
        cover: 'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
        gallery: [
            'https://res.cloudinary.com/dtghitaah/image/upload/v1763572690/cld-sample-3.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1763572688/cld-sample.jpg',
        ],
    },
    {
        id: 5,
        title: 'Sonho de Princesa',
        cover: 'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
        gallery: [
            'https://res.cloudinary.com/dtghitaah/image/upload/v1763572690/cld-sample-3.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1763572688/cld-sample.jpg',
        ],
    },
    {
        id: 6,
        title: 'Sonho de Princesa',
        cover: 'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
        gallery: [
            'https://res.cloudinary.com/dtghitaah/image/upload/v1763572690/cld-sample-3.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1763572688/cld-sample.jpg',
        ],
    },
];

// 3. COMPONENTE DO MODAL DE GALERIA
const GalleryModal: React.FC<{
    images: string[];
    title: string;
    onClose: () => void;
}> = ({ images, title, onClose }) => {
    return (
        <div className="gallery-modal-overlay" onClick={onClose}>
            <div
                className="gallery-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="gallery-close-btn" onClick={onClose}>
                    <FaTimes />
                </button>
                <h2>{title}</h2>
                <div className="gallery-grid">
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Detalhe ${idx}`}
                            className="gallery-item-img"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const HomePage = () => {
    const [selectedGallery, setSelectedGallery] = useState<{
        images: string[];
        title: string;
    } | null>(null);

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
                    <p>
                        <strong>
                            Pedido personalizado no whats, telefone (61)
                            98238-8828
                        </strong>
                    </p>
                    <p>
                        {' '}
                        Temos uma variedade incrível de cores para camas,
                        tapetes e protetores. Além disso, fazemos medidas
                        personalizadas para atender exatamente o que você
                        precisa!
                    </p>
                    <p>
                        Entre em contato e uma de nossas vendedoras terá prazer
                        em te atender.
                    </p>
                    <button className="cta-button">
                        <FaWhatsapp className="social-icon" />
                        <a
                            href="https://wa.me/5561982388828"
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
                    <FaInstagram />
                </motion.section>
                <hr />

                <motion.section
                    className="info-section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={slideInRight}
                >
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2>Inspire-se</h2>
                        <p>
                            Veja ambientes reais decorados com nossos produtos.
                        </p>
                    </div>

                    {/* 4. CARROSSEL SWIPER */}
                    <div className="carousel-container">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 5000 }}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            className="photos-swiper"
                        >
                            {AMBIENTES.map((ambiente) => (
                                <SwiperSlide key={ambiente.id}>
                                    <div
                                        className="swiper-card"
                                        onClick={() =>
                                            setSelectedGallery({
                                                images: ambiente.gallery,
                                                title: ambiente.title,
                                            })
                                        }
                                    >
                                        <div className="swiper-img-wrapper">
                                            <img
                                                src={ambiente.cover}
                                                alt={ambiente.title}
                                            />
                                            <div className="swiper-overlay">
                                                <FaCamera /> Ver +
                                                {ambiente.gallery.length} fotos
                                            </div>
                                        </div>
                                        <h3>{ambiente.title}</h3>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <Link
                        to="/products"
                        className="cta-button"
                        style={{ marginTop: '40px' }}
                    >
                        Ver Catálogo Completo
                    </Link>
                </motion.section>
            </main>
            {/* 5. RENDERIZAÇÃO DO MODAL SE HOUVER SELEÇÃO */}
            {selectedGallery && (
                <GalleryModal
                    images={selectedGallery.images}
                    title={selectedGallery.title}
                    onClose={() => setSelectedGallery(null)}
                />
            )}
        </div>
    );
};

export default HomePage;
