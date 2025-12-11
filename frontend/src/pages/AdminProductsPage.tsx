import React, { useEffect } from 'react';
import { useProductStore } from '../store/ProductStore';
import { useAuthStore } from '../store/AuthStore';
import { Navigate, Link } from 'react-router-dom';
import { FaBox, FaPlus, FaEdit, FaTrashAlt, FaImage } from 'react-icons/fa';
import './AdminCategoryPage.css'; // Reutiliza estilos da tabela de categoria
import './AdminProductsPage.css'; // Estilos específicos de produto

const AdminProductsPage: React.FC = () => {
    const { products, isLoading, error, fetchProducts, deleteProduct } =
        useProductStore();
    const { user } = useAuthStore();

    // Permissão: ADMIN e DEV (Seller pode ver/editar? Se sim, adicione aqui)
    const canManage =
        user &&
        (user.role === 'ADMIN' ||
            user.role === 'DEV' ||
            user.role === 'SELLER');

    const canDelete = user && (user.role === 'ADMIN' || user.role === 'DEV');

    if (!canManage) {
        return <Navigate to="/dashboard" replace />;
    }

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await deleteProduct(id);
            } catch (err) {
                alert('Erro ao excluir produto.');
            }
        }
    };

    const formatPrice = (val: number) =>
        val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (isLoading)
        return (
            <div className="loading-container">
                <h1>Carregando Produtos...</h1>
            </div>
        );

    return (
        <div className="admin-page-container">
            <h1>
                <FaBox /> Gerenciamento de Produtos
            </h1>
            <p className="page-description">
                Visualize, cadastre e gerencie o estoque da loja.
            </p>

            {/* Botão de Adicionar (Leva para nova página) */}
            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                <Link
                    to="/admin/products/new"
                    className="category-button-add"
                    style={{
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <FaPlus /> Novo Produto
                </Link>
            </div>

            {error && <p className="error-message">Erro: {error}</p>}

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="table-header">ID</th>
                            <th className="table-header">Imagem</th>
                            <th className="table-header">Nome</th>
                            <th className="table-header">Categoria</th>
                            <th className="table-header">Preço</th>
                            <th className="table-header">Estoque</th>
                            <th className="table-header">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="category-row">
                                <td className="table-cell">#{product.id}</td>
                                <td className="table-cell">
                                    {product.images &&
                                    product.images.length > 0 ? (
                                        <img
                                            src={product.images[0].url} // <--- ACESSE A PROPRIEDADE .url
                                            alt={product.name}
                                            className="product-thumb"
                                        />
                                    ) : (
                                        <div className="no-thumb">
                                            <FaImage />
                                        </div>
                                    )}
                                </td>
                                <td className="table-cell name-cell">
                                    <strong>{product.name}</strong>
                                    <br />
                                    <small style={{ color: '#666' }}>
                                        {product.sku}
                                    </small>
                                </td>
                                <td className="table-cell">
                                    {product.category?.name || '-'}
                                </td>
                                <td className="table-cell">
                                    {formatPrice(product.price)}
                                </td>
                                <td className="table-cell">
                                    <span
                                        className={`stock-badge ${
                                            product.stock > 0
                                                ? 'in-stock'
                                                : 'out-stock'
                                        }`}
                                    >
                                        {product.stock} un.
                                    </span>
                                </td>
                                <td className="table-cell action-cell">
                                    <Link
                                        to={`/admin/products/edit/${product.id}`}
                                        className="action-button edit-button"
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </Link>

                                    {canDelete && (
                                        <button
                                            className="action-button delete-button"
                                            onClick={() =>
                                                handleDelete(product.id)
                                            }
                                            title="Excluir"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={7} className="empty-cell">
                                    Nenhum produto encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductsPage;
