import { Link } from 'react-router-dom';
import './HomePage.css'; // 1. Importe o CSS
import { FaCamera, FaInstagram, FaTimes, FaWhatsapp } from 'react-icons/fa';
import { motion, type Variants } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';
import { useProductStore } from '../store/ProductStore'; // Importando a store de produtos

const AMBIENTES = [
    {
        id: 1,
        title: 'Quarto Azul',
        cover: 'https://res.cloudinary.com/dtghitaah/image/upload/v1765558529/WhatsApp_Image_2025-11-26_at_10.52.10_dxfnhn.jpg', // Capa
        gallery: [
            // Fotos internas
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765558529/WhatsApp_Image_2025-11-26_at_10.52.10_dxfnhn.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765558534/WhatsApp_Image_2025-11-26_at_10.51.33_qwloca.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765558525/WhatsApp_Image_2025-12-05_at_11.47.56_smwokd.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765558521/WhatsApp_Image_2025-12-05_at_11.47.57_ejji7b.jpg',
        ],
    },
    {
        id: 2,
        title: 'Quarto Rosa',
        cover: 'https://res.cloudinary.com/dtghitaah/image/upload/v1765559086/WhatsApp_Image_2025-11-25_at_08.40.20_g2omjy.jpg',
        gallery: [
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765559090/WhatsApp_Image_2025-11-25_at_08.40.12_vsbv9e.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765559073/WhatsApp_Image_2025-12-02_at_16.28.08_j8um3j.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765561261/WhatsApp_Image_2025-12-11_at_10.29.03_myvevo.jpg',
        ],
    },
    {
        id: 3,
        title: 'Quarto Cinza',
        cover: 'https://res.cloudinary.com/dtghitaah/image/upload/v1764781802/3_h1ncze.jpg',
        gallery: [
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765559818/WhatsApp_Image_2025-11-17_at_08.44.22_vxc1ff.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765893515/WhatsApp_Image_2025-12-16_at_08.24.26_qo4mwn.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765893514/WhatsApp_Image_2025-12-16_at_08.25.10_xwdjy4.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765893514/WhatsApp_Image_2025-12-02_at_13.47.57_t8owco.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1765893514/WhatsApp_Image_2025-12-02_at_13.48.26_fih9fq.jpg',
        ],
    },

    {
        id: 6,
        title: 'Natal Inphantil',
        cover: 'https://res.cloudinary.com/dtghitaah/image/upload/v1764856806/PHOTO-2021-10-07-19-27-57_mgcgxl.jpg',
        gallery: [
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764856817/PHOTO-2021-10-07-19-27-57_3_ciotxn.jpg',
            'https://res.cloudinary.com/dtghitaah/image/upload/v1764856789/PHOTO-2021-10-07-20-14-23_o3ijms.jpg',
        ],
    },
];

// 3. COMPONENTE DO MODAL DE GALERIA
const GalleryModal: React.FC<{
    images: string[];
    title: string;
    onClose: () => void;
}> = ({ images, title, onClose }) => {
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    return (
        <>
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setZoomedImage(img);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {zoomedImage && (
                <ImageZoomModal
                    image={zoomedImage}
                    onClose={() => setZoomedImage(null)}
                />
            )}
        </>
    );
};

const ImageZoomModal: React.FC<{
    image: string;
    onClose: () => void;
}> = ({ image, onClose }) => {
    return (
        <div className="zoom-modal-overlay" onClick={onClose}>
            <button className="zoom-close-btn" onClick={onClose}>
                <FaTimes />
            </button>
            <div
                className="zoom-modal-content"
                onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar na imagem
            >
                <img src={image} alt="Zoom" className="zoom-image" />
            </div>
        </div>
    );
};

const HomePage = () => {
    const [selectedGallery, setSelectedGallery] = useState<{
        images: string[];
        title: string;
    } | null>(null);

    const { products, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Formatação de preço (reutilizando lógica)
    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    // Slide da Esquerda
    const slideInLeft: Variants = {
        hidden: { opacity: 0, x: -100 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    };

    const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

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
                        src="https://res.cloudinary.com/dtghitaah/image/upload/v1764856446/PHOTO-2021-10-07-20-14-23_ltkrpr.jpg"
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
                    {/* Grid de Produtos Destacados */}
                    {featuredProducts.length > 0 ? (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '20px',
                                margin: '30px 0',
                                width: '100%',
                            }}
                        >
                            {featuredProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/products/${product.id}`}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                    }}
                                >
                                    <div
                                        className="featured-card"
                                        style={{
                                            border: '1px solid #eee',
                                            borderRadius: '12px',
                                            padding: '15px',
                                            textAlign: 'center',
                                            boxShadow:
                                                '0 4px 6px rgba(0,0,0,0.05)',
                                            background: '#fff',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                        }}
                                    >
                                        <div style={{ marginBottom: '10px' }}>
                                            <img
                                                src={product.mainImage}
                                                alt={product.name}
                                                style={{
                                                    // width: '100%',
                                                    height: '180px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3
                                                style={{
                                                    fontSize: '1.1rem',
                                                    margin: '10px 0',
                                                    color: '#444',
                                                }}
                                            >
                                                {product.name}
                                            </h3>
                                            <p
                                                style={{
                                                    fontWeight: 'bold',
                                                    color: '#d66f56', // Cor temática aproximada
                                                    fontSize: '1.2rem',
                                                }}
                                            >
                                                {formatPrice(product.price)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p style={{ fontStyle: 'italic', margin: '20px 0' }}>
                            Carregando destaques...
                        </p>
                    )}
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
                <hr />
                <motion.section
                    className="info-section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={slideInRight}
                >
                    <h2>Instagram</h2>
                    <p>
                        Siga-nos no Instagram para mais inspirações! @inphantil
                    </p>
                    seçao de feed
                    <FaInstagram />
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
