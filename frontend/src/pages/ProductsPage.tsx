import { useEffect } from 'react';
import { useProductStore } from '../store/ProductStore';
import { useAuthStore } from '../store/AuthStore';
import { Link } from 'react-router-dom';
import './ProductsPage.css';
import { FaCartPlus } from 'react-icons/fa';
import { useCartStore } from '../store/CartStore';
import toast, { Toaster } from 'react-hot-toast';

const ProductsPage = () => {
    // Pega os dados e o método de busca
    const { products, isLoading, error, fetchProducts } = useProductStore();
    // Pega os dados do usuário para mostrar o nome e verificar a permissão de edição
    const user = useAuthStore((state) => state.user);
    const addItem = useCartStore((state) => state.addItem); // 2. Pegue a função addItem
    // Chama a API quando o componente é montado
    useEffect(() => {
        // Busca produtos apenas se a lista estiver vazia
        if (products.length === 0) {
            fetchProducts();
        }
    }, [fetchProducts, products.length]);

    // 2. Função para adicionar e avisar
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

    if (isLoading) {
        return <h1>Carregando Catálogo...</h1>;
    }

    if (error) {
        return <h1>Erro ao carregar produtos: {error}</h1>;
    }

    // Utilitário para formatar preço em BRL
    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    // Função de verificação de permissão
    const canEdit = user && (user.role === 'ADMIN' || user.role === 'DEV');
    // Obs: A rota GET /products é pública, mas o botão de editar só aparece para Admin/Dev logados

    return (
        <div className="products-page-container">
            <Toaster />
            <h1 className="page-title">Catálogo de Produtos</h1>

            {user && (
                <p className="user-welcome-message">
                    Olá, {user.name}. Seu nível de acesso é: {user.role}
                </p>
            )}

            <div className="products-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>

                        <Link
                            to={`/products/${product.id}`}
                            className="product-image-link"
                        >
                            <img
                                src={product.mainImage}
                                alt={product.name}
                                className="product-image"
                            />
                        </Link>

                        <p className="price-stock">
                            Preço: <strong>{formatPrice(product.price)}</strong>
                        </p>
                        <p className="price-stock">Estoque: {product.stock}</p>
                        <p className="product-category">
                            {product.category?.name
                                ? `Categoria: ${product.category.name}`
                                : 'Sem Categoria'}
                        </p>
                        <button
                            className="add-cart-button"
                            onClick={() => handleAddToCart(product)}
                            disabled={
                                !product.isAvailable || product.stock <= 0
                            }
                        >
                            <FaCartPlus /> Adicionar
                        </button>

                        {canEdit && (
                            <Link
                                to={`/admin/products/edit/${product.id}`}
                                className="product-edit-link"
                            >
                                Editar Produto
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <p className="no-products-message">
                    Nenhum produto cadastrado no momento.
                </p>
            )}
        </div>
    );
};

export default ProductsPage;
