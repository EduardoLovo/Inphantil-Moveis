import { useEffect } from 'react';
import { useProductStore } from '../store/ProductStore';
import { useAuthStore } from '../store/AuthStore';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
    // Pega os dados e o método de busca
    const { products, isLoading, error, fetchProducts } = useProductStore();
    // Pega os dados do usuário para mostrar o nome e verificar a permissão de edição
    const user = useAuthStore((state) => state.user);

    // Chama a API quando o componente é montado
    useEffect(() => {
        // Busca produtos apenas se a lista estiver vazia
        if (products.length === 0) {
            fetchProducts();
        }
    }, [fetchProducts, products.length]);

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
        <div style={{ maxWidth: '1200px', margin: '50px auto' }}>
            <h1>Catálogo de Produtos</h1>

            {user && (
                <p>
                    Olá, {user.name}. Seu nível de acesso é: {user.role}
                </p>
            )}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '20px',
                    marginTop: '30px',
                }}
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        style={{
                            border: '1px solid #ddd',
                            padding: '15px',
                            borderRadius: '8px',
                            boxShadow: '2px 2px 5px rgba(0,0,0,0.05)',
                        }}
                    >
                        <h3>{product.name}</h3>
                        <p>
                            Preço: <strong>{formatPrice(product.price)}</strong>
                        </p>
                        <p>Estoque: {product.stock}</p>
                        <p style={{ fontSize: '0.9em', color: '#666' }}>
                            {product.category?.name
                                ? `Categoria: ${product.category.name}`
                                : 'Sem Categoria'}
                        </p>

                        {/* Botão de Edição Visível Apenas para quem pode editar */}
                        {canEdit && (
                            <Link
                                to={`/products/edit/${product.id}`}
                                style={{
                                    display: 'block',
                                    marginTop: '10px',
                                    color: '#007bff',
                                }}
                            >
                                Editar Produto
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <p>Nenhum produto cadastrado no momento.</p>
            )}
        </div>
    );
};

export default ProductsPage;
