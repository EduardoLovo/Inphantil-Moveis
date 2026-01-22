import React, { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useApliqueStore } from '../store/ApliqueStore';
import './ApliquesPage.css';
import { useAuthStore } from '../store/AuthStore';
import type { VisualItem } from '../types/visual-item';
import {
    FaCube,
    FaEdit,
    FaSearch,
    FaSortNumericUp,
    FaTimes,
    FaTrash,
} from 'react-icons/fa';

// =========================================================
// 1. MODAL DE VISUALIZAÇÃO (Novo)
// =========================================================
const ViewModal: React.FC<{ item: VisualItem; onClose: () => void }> = ({
    item,
    onClose,
}) => {
    // Fecha ao clicar no fundo escuro
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-view-card">
                {' '}
                {/* Usa o estilo que criamos para Sintéticos */}
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                <img
                    src={item.imageUrl}
                    alt={item.code}
                    className="modal-view-image"
                />
                <div className="modal-view-info">
                    <h2>{item.code}</h2>
                    {item.name && <p className="item-name">{item.name}</p>}
                    {item.description && (
                        <p className="item-description">{item.description}</p>
                    )}

                    {/* Status visível apenas aqui se desejar */}
                    {!item.inStock && (
                        <span className="info-badge out-badge">
                            Indisponível
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// =========================================================
// 2. MODAL DE EDIÇÃO (Existente - Mantido igual)
// =========================================================
const EditModal: React.FC<{
    item: VisualItem;
    onClose: () => void;
    onSave: (data: any) => void;
    onDelete: (id: number) => Promise<void>;
}> = ({ item, onClose, onSave, onDelete }) => {
    const [code, setCode] = useState(item.code || '');
    const [quantity, setQuantity] = useState<number | null>(
        item.quantity || null,
    );
    const [imagem, setImagem] = useState(item.imageUrl || '');
    const [inStock, setInStock] = useState(item.inStock);
    const [sequence, setSequence] = useState<number | null>(
        item.sequence || null,
    );
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({
                id: item.id,
                imageUrl: imagem,
                code,
                quantity,
                inStock,
                sequence,
            });
            onClose();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar as alterações.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = async () => {
        if (
            window.confirm(
                `Tem certeza que deseja EXCLUIR o aplique "${item.code}"? Esta ação não pode ser desfeita.`,
            )
        ) {
            setLoading(true);
            try {
                await onDelete(item.id);
                onClose(); // Fecha o modal após deletar
            } catch (error) {
                console.error('Erro ao excluir:', error);
                alert('Erro ao excluir o aplique.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>
                    <FaEdit className="header-icon" /> Editar Aplique:{' '}
                    {item.code}
                </h2>
                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                        <label>Código:</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Imagem (URL):</label>
                        <input
                            type="text"
                            value={imagem}
                            onChange={(e) => setImagem(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <FaCube className="input-icon" /> Quantidade:
                        </label>
                        <input
                            type="number"
                            value={quantity === null ? '' : quantity}
                            onChange={(e) =>
                                setQuantity(
                                    e.target.value === ''
                                        ? null
                                        : Number(e.target.value),
                                )
                            }
                            className="form-input"
                        />
                    </div>
                    <div className="form-group checkbox-group">
                        <label>Em Estoque:</label>
                        <input
                            type="checkbox"
                            checked={inStock}
                            onChange={(e) => setInStock(e.target.checked)}
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <FaSortNumericUp className="input-icon" />{' '}
                            Sequência:
                        </label>
                        <input
                            type="number"
                            value={sequence === null ? '' : sequence}
                            onChange={(e) =>
                                setSequence(
                                    e.target.value === ''
                                        ? null
                                        : Number(e.target.value),
                                )
                            }
                            className="form-input"
                        />
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleDeleteClick}
                            disabled={loading}
                            style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            <FaTrash /> Excluir
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading}>
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// =========================================================
// 3. COMPONENTE PRINCIPAL
// =========================================================
const ApliquesPage: React.FC = () => {
    const {
        apllyIcons,
        isLoading,
        error,
        fetchApliques,
        updateAplique,
        deleteAplique,
    } = useApliqueStore();
    const user = useAuthStore((state) => state.user);

    const [editingItem, setEditingItem] = useState<VisualItem | null>(null);
    const [viewingItem, setViewingItem] = useState<VisualItem | null>(null);
    const [busca, setBusca] = useState('');

    const canEdit = user && (user.role === 'ADMIN' || user.role === 'DEV');
    const isStaff =
        user &&
        (user.role === 'ADMIN' ||
            user.role === 'DEV' ||
            user.role === 'SELLER');

    useEffect(() => {
        fetchApliques();
    }, [fetchApliques]);

    // LÓGICA DE FILTRAGEM CORRIGIDA
    const apliquesFiltrados = useMemo(() => {
        const termo = busca.toLowerCase().trim();

        const filtrados = apllyIcons.filter((item) => {
            // Verificação de segurança (null check) para evitar erros de undefined
            const codigo = item.code?.toLowerCase() || '';
            const nome = item.name?.toLowerCase() || '';

            return codigo.includes(termo) || nome.includes(termo);
        });

        // Ordenação por código
        return [...filtrados].sort((a, b) =>
            (a.code || '').localeCompare(b.code || ''),
        );
    }, [apllyIcons, busca]);

    const handleCardClick = (item: VisualItem) => {
        if (canEdit) {
            setEditingItem(item);
        } else {
            setViewingItem(item);
        }
    };

    const handleSave = async (data: any) => {
        await updateAplique(data);
    };

    const handleDelete = async (id: number) => {
        await deleteAplique(id);
    };

    const getCardClassName = (inStock: boolean): string => {
        let className = 'aplly-card';
        if (!isStaff) return className;
        return (
            className + (inStock ? ' in-stock-staff' : ' out-of-stock-staff')
        );
    };

    if (isLoading)
        return (
            <div className="aplly-page-container">
                <h1>Carregando Apliques...</h1>
            </div>
        );
    if (error)
        return (
            <div className="aplly-page-container">
                <h1>Erro: {error}</h1>
            </div>
        );

    return (
        <div className="aplly-page-container">
            <h1>Catálogo de Apliques</h1>
            <p className="page-description">
                {isStaff
                    ? 'Visualização de Gestão: Clique para editar (Admin) ou visualizar (Seller).'
                    : 'Clique na imagem para ampliar.'}
            </p>

            {/* INPUT DE PESQUISA */}
            <div className="simulador-search-container">
                <FaSearch className="simulador-search-icon" />
                <input
                    type="text"
                    placeholder="Pesquisar código ou nome..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="aplly-grid">
                {/* AQUI ESTÁ O USO DA LISTA FILTRADA */}
                {apliquesFiltrados.map((item) => (
                    <div
                        key={item.id}
                        className={getCardClassName(item.inStock)}
                        onClick={() => handleCardClick(item)}
                        style={{ cursor: 'pointer' }}
                    >
                        {canEdit && <FaEdit className="edit-icon" />}
                        <img
                            src={item.imageUrl}
                            alt={item.code}
                            className="aplly-image"
                        />
                        <h3 className="aplly-title">{item.code}</h3>
                        {isStaff && (
                            <span
                                className={`stock-tag ${
                                    item.inStock
                                        ? 'tag-in-stock'
                                        : 'tag-out-of-stock'
                                }`}
                            >
                                {item.inStock ? 'Em Estoque' : 'Esgotado'}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* FEEDBACK CASO NÃO ENCONTRE NADA */}
            {apliquesFiltrados.length === 0 && (
                <p className="no-results">
                    Nenhum aplique encontrado para "{busca}".
                </p>
            )}

            {/* MODAIS */}
            {editingItem && (
                <EditModal
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onSave={handleSave}
                    onDelete={handleDelete} // ⬅️ Passando a função
                />
            )}

            {viewingItem && (
                <ViewModal
                    item={viewingItem}
                    onClose={() => setViewingItem(null)}
                />
            )}
        </div>
    );
};

export default ApliquesPage;
