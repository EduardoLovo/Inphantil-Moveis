import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../store/ProductStore';
import { useCartStore } from '../store/CartStore';
import { type Product } from '../types/products';
import { FaCartPlus, FaArrowLeft } from 'react-icons/fa';
import './ProductDetailsPage.css';
import { CiShoppingCart } from 'react-icons/ci';
import toast, { Toaster } from 'react-hot-toast';

const ProductDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { getProductById, products, fetchProducts } = useProductStore();
    const addItem = useCartStore((state) => state.addItem);

    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');

    useEffect(() => {
        const loadProduct = async () => {
            if (!id) return;
            setLoading(true);
            // Busca o produto pelo ID (do cache ou da API)
            const data = await getProductById(Number(id));
            setProduct(data);

            // Define a imagem inicial
            if (data?.mainImage) {
                setSelectedImage(data.mainImage);
            } else if (data?.images && data.images.length > 0) {
                setSelectedImage(data.images[0].url);
            }
            setLoading(false);
        };
        loadProduct();
    }, [id, getProductById]);

    // Efeito para garantir que temos a lista de produtos carregada para os relacionados
    useEffect(() => {
        if (products.length === 0) {
            fetchProducts();
        }
    }, [products.length, fetchProducts]);

    // Filtra produtos da mesma categoria, excluindo o produto atual
    const relatedProducts = product
        ? products
              .filter(
                  (p) =>
                      p.categoryId === product.categoryId && p.id !== product.id
              )
              .slice(0, 4) // Limita a 4 sugestões
        : [];

    // Função para subir a tela ao clicar em um relacionado
    const handleRelatedClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading)
        return <div className="loading-details">Carregando detalhes...</div>;
    if (!product)
        return (
            <div className="error-details">
                Produto não encontrado. <Link to="/products">Voltar</Link>
            </div>
        );

    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const handleAddToCart = (product: any) => {
        addItem(product);
        toast.success(`${product.name} adicionado ao carrinho!`, {
            position: 'bottom-right',
            style: {
                background: '#838383ff',
                color: '#fff',
            },
        });
    };

    return (
        <div className="product-details-container">
            <Toaster />

            <Link to="/products" className="back-link">
                <FaArrowLeft /> Voltar para o catálogo
            </Link>

            <div className="product-details-content">
                {/* Galeria de Imagens */}
                <div className="product-gallery">
                    <div className="main-image-container">
                        <img
                            src={
                                selectedImage ||
                                'https://via.placeholder.com/400'
                            }
                            alt={product.name}
                            className="main-image"
                        />
                    </div>
                    {/* Exibe miniaturas se houver mais de uma imagem ou se houver mainImage + lista */}
                    <div className="thumbnails">
                        {product.mainImage && (
                            <img
                                src={product.mainImage}
                                alt="Principal"
                                className={`thumbnail ${
                                    selectedImage === product.mainImage
                                        ? 'active'
                                        : ''
                                }`}
                                onClick={() =>
                                    setSelectedImage(product.mainImage!)
                                }
                            />
                        )}
                        {product.images?.map((img) => (
                            <img
                                key={img.id}
                                src={img.url}
                                alt={img.alt || product.name}
                                className={`thumbnail ${
                                    selectedImage === img.url ? 'active' : ''
                                }`}
                                onClick={() => setSelectedImage(img.url)}
                            />
                        ))}
                    </div>
                </div>

                {/* Informações do Produto */}
                <div className="product-info-column">
                    <h1 className="product-title-detail">{product.name}</h1>
                    <span className="product-category-tag">
                        {product.category?.name || 'Geral'}
                    </span>

                    <div className="product-price-detail">
                        {formatPrice(product.price)}
                    </div>

                    <div className="product-description-box">
                        <h3>Sobre o produto</h3>
                        <p>
                            {product.description ||
                                'Sem descrição disponível para este item.'}
                        </p>
                    </div>

                    <div className="product-specs-list">
                        {product.size && (
                            <div className="spec-item">
                                <strong>Tamanho:</strong> {product.size}
                            </div>
                        )}
                        {product.color && (
                            <div className="spec-item">
                                <strong>Cor:</strong> {product.color}
                            </div>
                        )}
                        <div className="spec-item">
                            <strong>Estoque: </strong>
                            <span
                                className={
                                    product.stock > 0 ? 'stock-ok' : 'stock-out'
                                }
                            >
                                {product.stock > 0
                                    ? `${product.stock} disponíveis`
                                    : 'Esgotado'}
                            </span>
                        </div>
                    </div>

                    <button
                        className="add-to-cart-btn-large"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.isAvailable || product.stock <= 0}
                    >
                        <FaCartPlus />{' '}
                        {product.stock > 0
                            ? 'Adicionar ao Carrinho'
                            : 'Indisponível'}
                    </button>

                    <Link to="/cart" title="Meu Carrinho">
                        <button className="add-to-cart-btn-large">
                            <CiShoppingCart size={28} /> Ver Carrinho
                        </button>
                    </Link>
                </div>
            </div>
            <div>
                {/* SEÇÃO NOVA: Produtos Relacionados */}
                {relatedProducts.length > 0 && (
                    <div className="related-products-section">
                        <h2 className="related-title">Produtos Relacionados</h2>
                        <div className="related-grid">
                            {relatedProducts.map((related) => (
                                <div key={related.id} className="related-card">
                                    <Link
                                        to={`/products/${related.id}`}
                                        className="related-image-link"
                                        onClick={handleRelatedClick}
                                    >
                                        <img
                                            src={
                                                related.mainImage ||
                                                'https://via.placeholder.com/200'
                                            }
                                            alt={related.name}
                                            className="related-image"
                                        />
                                    </Link>
                                    <div className="related-info">
                                        <Link
                                            to={`/products/${related.id}`}
                                            className="related-name"
                                            onClick={handleRelatedClick}
                                        >
                                            {related.name}
                                        </Link>
                                        <p className="related-price">
                                            {formatPrice(related.price)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsPage;
