import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaCamera,
  // FaChevronDown,
  FaInstagram,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";
import { motion, type Variants } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useProductStore } from "../store/ProductStore";
import { api } from "../services/api";
import home from "../assets/home.png";
const LOGO_IMAGE = "/logo.svg";

// Tipos
interface Environment {
  id: number;
  title: string;
  cover: string;
  images: { id: number; url: string }[];
}

// --- 1. COMPONENTE MODAL DE GALERIA (LIGHTBOX) ---
const GalleryModal: React.FC<{
  images: string[];
  title: string;
  onClose: () => void;
}> = ({ images, title, onClose }) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl p-6 relative shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
            onClick={onClose}
          >
            <FaTimes />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 border-b pb-2">
            {title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-lg shadow-sm cursor-zoom-in h-48 sm:h-60"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedImage(img);
                }}
              >
                <img
                  src={img}
                  alt={`Detalhe ${idx}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
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

// --- 2. COMPONENTE MODAL DE ZOOM (FOTO ÚNICA) ---
const ImageZoomModal: React.FC<{
  image: string;
  onClose: () => void;
}> = ({ image, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 bg-white/10 hover:bg-white/30 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-200 z-50"
        onClick={onClose}
      >
        <FaTimes />
      </button>

      <div
        className="relative max-w-full max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image}
          alt="Zoom"
          className="max-w-[95vw] max-h-[95vh] object-contain rounded-md shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        />
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
const HomePage = () => {
  const [ambientes, setAmbientes] = useState<Environment[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<{
    images: string[];
    title: string;
  } | null>(null);

  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    const fetchAmbientes = async () => {
      try {
        const response = await api.get("/environments");
        setAmbientes(response.data);
      } catch (error) {
        console.error("Erro ao carregar ambientes:", error);
      }
    };
    fetchAmbientes();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // const handleScrollDown = () => {
  //   window.scrollTo({
  //     top: window.innerHeight,
  //     behavior: "smooth",
  //   });
  // };

  // Variantes de Animação
  const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const slideInRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const featuredVariants = useMemo(() => {
    const featured: any[] = [];
    products.forEach((product) => {
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant) => {
          if (variant.isFeatured) {
            featured.push({ product, variant });
          }
        });
      }
    });
    return featured;
  }, [products]);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="relative bg-[#fafafa] min-h-screen">
        <main className="pb-10">
          {/* --- HERO SECTION --- */}
          <motion.section
            className="relative w-full  overflow-hidden flex items-center justify-center bg-gray-300 shadow-lg"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {/* Imagem de Fundo (Ajuste de posição para mobile/desktop) */}
            <motion.img
              src={home}
              alt="Camas Montessorianas"
              className="w-full md:h-[550px] h-[300px] object-cover object-center md:object-[0_0px]"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
            />

            {/* Overlay Escuro/Texto */}
            <motion.div
              className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 pt-2 md:pt-48 bg-black/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h2 className="text-[#ffffbc] text-3xl md:text-5xl font-bold mb-4 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] ">
                Bem-vindo(a) ao Mundo das Camas Montessorianas!
              </h2>
              <p className="text-[#ffffbc] text-base md:text-xl max-w-2xl drop-shadow-[0_0_8px_rgba(0,0,0,0.9)] mb-6">
                O melhor lugar para decorar o quartinho do seu bebê com carinho
                e segurança.
              </p>

              <img
                src={LOGO_IMAGE}
                alt="Inphantil Logo"
                className="w-24 md:w-32 h-auto drop-shadow-lg"
              />

              {/* Seta Animada */}
              {/* <motion.div
                className="absolute bottom-10 md:bottom-10 cursor-pointer drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                onClick={handleScrollDown}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  y: [0, 10, 0],
                }}
                transition={{
                  delay: 2,
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FaChevronDown className="text-[#ffffbc] text-4xl" />
              </motion.div> */}
            </motion.div>
          </motion.section>

          {/* --- PRODUTOS EM DESTAQUE --- */}
          <motion.section
            className="info-section p-8 max-w-7xl mx-auto w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInLeft}
          >
            <h2 className="text-3xl font-bold text-[#313b2f] mb-2 text-center">
              Nossos Destaques
            </h2>
            <p className="text-gray-500 mb-8 text-center">
              Veja os modelos e cores mais amados pelos nossos clientes.
            </p>

            {featuredVariants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-left">
                {featuredVariants.map(({ product, variant }) => {
                  // Tenta pegar a foto da variação; se não tiver, usa a foto base do produto
                  let displayImage = product.mainImage;
                  if (variant.images && variant.images.length > 0) {
                    displayImage = variant.images[0].url;
                  } else if ((variant as any).imageUrl) {
                    displayImage = (variant as any).imageUrl;
                  }

                  return (
                    <Link
                      key={`${product.id}-${variant.id}`}
                      // A MÁGICA: O Link já joga os parâmetros de cor e tamanho na URL da página de detalhes
                      to={`/products/${product.id}?color=${encodeURIComponent(variant.color)}&size=${encodeURIComponent(variant.size)}`}
                      className="block group h-full"
                    >
                      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
                        <div className="mb-4 overflow-hidden rounded-lg h-48 bg-gray-50">
                          {displayImage ? (
                            <img
                              src={displayImage}
                              alt={`${product.name} - ${variant.color}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              Sem Imagem
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-[#313b2f] mb-1 line-clamp-2">
                            {product.name}
                          </h3>

                          {/* Mini Tag com a cor e tamanho do destaque */}
                          <div className="mb-3 flex flex-wrap gap-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                              <span className="font-bold">Cor:</span>{" "}
                              {variant.color}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                              <span className="font-bold">Tam:</span>{" "}
                              {variant.size}
                            </span>
                          </div>

                          <p className="text-xl font-bold text-[#ffd639] drop-shadow-sm">
                            {formatPrice(variant.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="italic text-gray-500 my-10 text-center">
                Carregando destaques...
              </p>
            )}

            <div className="flex justify-center mt-6">
              <Link
                to="/loja"
                className="inline-flex items-center justify-center px-8 py-3 bg-[#313b2f] text-white font-bold rounded-full hover:bg-[#ffd639] hover:text-[#313b2f] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                Ver Catálogo Completo
              </Link>
            </div>
          </motion.section>

          <hr className="border-gray-200 max-w-5xl mx-auto" />

          {/* --- SEÇÃO WHATSAPP --- */}
          <motion.section
            className="max-w-7xl mx-auto py-16 px-6 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInRight}
          >
            <h2 className="text-[#313b2f] text-3xl font-bold mb-6 ">
              Whatsapp
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 mb-4">
                <strong>
                  Pedido personalizado no whats, telefone (61) 98238-8828
                </strong>
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Temos uma variedade incrível de cores para camas, tapetes e
                protetores. Além disso, fazemos medidas personalizadas para
                atender exatamente o que você precisa!
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Entre em contato e uma de nossas vendedoras terá prazer em te
                atender.
              </p>

              <a
                href="https://wa.me/5561982388828"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-3 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#20bd5a] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <FaWhatsapp className="text-xl" /> Whatsapp
              </a>
            </div>
          </motion.section>

          <hr className="border-gray-200 max-w-5xl mx-auto" />

          {/* --- SEÇÃO INSPIRAÇÃO (CARROSSEL) --- */}
          <motion.section
            className="max-w-7xl mx-auto py-16 px-6 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideInLeft}
          >
            <div className="mb-10">
              <h2 className="text-[#313b2f] text-3xl font-bold mb-4 ">
                Inspire-se
              </h2>
              <p className="text-[#313b2f] text-lg">
                Veja ambientes reais decorados com nossos produtos.
              </p>
            </div>

            <div className="w-full relative">
              {ambientes.length === 0 ? (
                <p className="py-10 text-gray-500">Carregando ambientes...</p>
              ) : (
                // Importante: Estilo inline para cor do tema do Swiper (não tem classe Tailwind direta)
                <div
                  style={
                    {
                      "--swiper-theme-color": "#ffd639",
                      "--swiper-navigation-size": "25px",
                    } as React.CSSProperties
                  }
                >
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    breakpoints={{
                      640: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 },
                    }}
                    className="pb-12" // Espaço para a paginação
                  >
                    {ambientes.map((ambiente) => (
                      <SwiperSlide key={ambiente.id} className="pb-2">
                        <div
                          className="cursor-pointer group hover:-translate-y-2 transition-transform duration-300"
                          onClick={() =>
                            setSelectedGallery({
                              images: ambiente.images.map((img) => img.url),
                              title: ambiente.title,
                            })
                          }
                        >
                          <div className="relative rounded-xl overflow-hidden h-[300px] shadow-md">
                            <img
                              src={ambiente.cover}
                              alt={ambiente.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
                              <FaCamera /> Ver + {ambiente.images.length} fotos
                            </div>
                          </div>
                          <h3 className="mt-4 text-lg font-semibold text-gray-800 group-hover:text-[#d66f56] transition-colors">
                            {ambiente.title}
                          </h3>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>

            <Link
              to="/showroom"
              className="inline-block mt-10 px-8 py-3 bg-[#313b2f] text-[#cbcfd1] font-bold rounded-full hover:bg-gray-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              Ver Todos Ambientes
            </Link>
          </motion.section>

          <hr className="border-gray-200 max-w-5xl mx-auto" />

          {/* --- SEÇÃO INSTAGRAM --- */}
          <motion.section
            className="max-w-7xl mx-auto py-16 px-6 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInRight}
          >
            <h2 className="text-[#313b2f] text-3xl font-bold mb-4 ">
              Instagram
            </h2>
            <p className="text-[#313b2f] text-lg flex items-center justify-center gap-2">
              Siga-nos no Instagram para mais inspirações!
              <a
                href="https://instagram.com/inphantil"
                target="_blank"
                className="font-bold text-[#E1306C] hover:underline flex items-center gap-1"
              >
                @inphantil <FaInstagram />
              </a>
            </p>
          </motion.section>
        </main>

        {/* --- MODAL DE GALERIA RENDERIZADO --- */}
        {selectedGallery && (
          <GalleryModal
            images={selectedGallery.images}
            title={selectedGallery.title}
            onClose={() => setSelectedGallery(null)}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
