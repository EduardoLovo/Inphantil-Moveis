import React, { useEffect, useState, type FormEvent } from 'react';
import { useCategoryStore } from '../store/CategoryStore';
import { useAuthStore } from '../store/AuthStore';
import { Navigate } from 'react-router-dom';
import { FaTrashAlt, FaTag, FaSpinner, FaEdit } from 'react-icons/fa';
// import type { Category } from '../types/category';
// import '../components/Calculadoras.css'; // Reutiliza form-input, etc.
import './AdminCategoryPage.css'; // O novo CSS para layout de tabela

// 1. Componente para Adicionar Nova Categoria
const CategoryForm: React.FC<{ onAdd: (data: any) => Promise<void> }> = ({
    onAdd,
}) => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Chama a store para adicionar
            await onAdd({ name: name.trim(), slug: slug.trim() || undefined });
            setName('');
            setSlug('');
        } catch (err: any) {
            // Exibe erro (ex: Conflito de Slug/Nome)
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="category-form-container">
            <h3>
                <FaTag /> Adicionar Nova Categoria
            </h3>
            <form onSubmit={handleSubmit} className="category-form">
                <div className="form-row">
                    <div className="form-group flex-1">
                        <label htmlFor="name">Nome:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group flex-1">
                        <label htmlFor="slug">Slug (Opcional):</label>
                        <input
                            type="text"
                            id="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            disabled={loading}
                            className="form-input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="category-button-add"
                    >
                        {loading ? (
                            <FaSpinner className="spin" />
                        ) : (
                            'Salvar Categoria'
                        )}
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

// 2. Componente Principal (Lista e Gerencia)
const AdminCategoryPage: React.FC = () => {
    const {
        categories,
        isLoading,
        error,
        fetchCategories,
        addCategory,
        deleteCategory,
    } = useCategoryStore();
    const { user } = useAuthStore();
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Proteção de Rota (apenas ADMIN/DEV)
    const canManage = user?.role === 'ADMIN' || user?.role === 'DEV';
    if (!canManage) {
        return <Navigate to="/dashboard" replace />;
    }

    // Busca os dados
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Handler para exclusão
    const handleDelete = async (id: number) => {
        if (
            window.confirm(
                'Tem certeza que deseja excluir esta categoria? Isso pode afetar produtos vinculados.'
            )
        ) {
            setDeleteError(null);
            try {
                await deleteCategory(id);
            } catch (err: any) {
                setDeleteError(err.message);
            }
        }
    };

    if (isLoading)
        return (
            <div className="loading-container">
                <h1>Carregando Categorias...</h1>
            </div>
        );

    return (
        <div className="admin-page-container">
            <h1>Gerenciamento de Categorias</h1>
            <p className="page-description">
                Gerencie as categorias estruturais do seu catálogo.
            </p>

            <CategoryForm onAdd={addCategory} />

            <h2 style={{ marginTop: '40px' }}>Lista Atual</h2>

            {(error || deleteError) && (
                <p className="error-message" style={{ marginTop: '10px' }}>
                    Erro: {error || deleteError}
                </p>
            )}

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="table-header">ID</th>
                            <th className="table-header">Nome</th>
                            <th className="table-header">Slug</th>
                            <th className="table-header">Qtde. Produtos</th>
                            <th className="table-header">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="category-row">
                                <td className="table-cell">{category.id}</td>
                                <td className="table-cell name-cell">
                                    {category.name}
                                </td>
                                <td className="table-cell slug-cell">
                                    {category.slug}
                                </td>
                                {/* A CategoryStore.ts deve incluir a contagem de produtos (_count) */}
                                <td className="table-cell count-cell">
                                    {category._count?.products || 0}
                                </td>
                                <td className="table-cell action-cell">
                                    <button
                                        className="action-button edit-button"
                                        disabled
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="action-button delete-button"
                                        onClick={() =>
                                            handleDelete(category.id)
                                        }
                                    >
                                        <FaTrashAlt /> Excluir
                                    </button>
                                    {/* Link para uma futura rota de Edição: /admin/categories/edit/:id */}
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                    }}
                                >
                                    Nenhuma categoria encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategoryPage;
