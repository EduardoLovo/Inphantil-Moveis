import React, { useEffect, useState, type FormEvent } from 'react';
import { useApliqueStore } from '../store/ApliqueStore';
import './ApliquesPage.css'; // CSS atual
import { useAuthStore } from '../store/AuthStore';
import type { VisualItem } from '../types/visual-item';
import { FaCube, FaEdit, FaSortNumericUp, FaTimes } from 'react-icons/fa';

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
}> = ({ item, onClose, onSave }) => {
    const [code, setCode] = useState(item.code || '');
    const [quantity, setQuantity] = useState<number | null>(
        item.quantity || null
    );
    const [imagem, setImagem] = useState(item.imageUrl || '');
    const [inStock, setInStock] = useState(item.inStock);
    const [sequence, setSequence] = useState<number | null>(
        item.sequence || null
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
        } finally {
            setLoading(false);
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
                                        : Number(e.target.value)
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
                                        : Number(e.target.value)
                                )
                            }
                            className="form-input"
                        />
                    </div>
                    <div className="form-actions">
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
    const { apllyIcons, isLoading, error, fetchApliques, updateAplique } =
        useApliqueStore();
    const user = useAuthStore((state) => state.user);

    // Estados para os dois modais
    const [editingItem, setEditingItem] = useState<VisualItem | null>(null);
    const [viewingItem, setViewingItem] = useState<VisualItem | null>(null);

    // Permissões Específicas
    // Quem pode editar? Apenas ADMIN e DEV
    const canEdit = user && (user.role === 'ADMIN' || user.role === 'DEV');

    // Quem vê informações de estoque coloridas? ADMIN, DEV e SELLER
    const isStaff =
        user &&
        (user.role === 'ADMIN' ||
            user.role === 'DEV' ||
            user.role === 'SELLER');

    useEffect(() => {
        if (apllyIcons.length === 0) {
            fetchApliques();
        }
    }, [fetchApliques, apllyIcons.length]);

    // Lógica de Clique Centralizada
    const handleCardClick = (item: VisualItem) => {
        if (canEdit) {
            // Se for ADMIN/DEV -> Abre Edição
            setEditingItem(item);
        } else {
            // Se for SELLER, USER ou Público -> Abre Visualização (Imagem Grande)
            setViewingItem(item);
        }
    };

    const handleSave = async (data: any) => {
        await updateAplique(data);
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

            <div className="aplly-grid">
                {apllyIcons.map((item) => (
                    <div
                        key={item.id}
                        className={getCardClassName(item.inStock)}
                        onClick={() => handleCardClick(item)} // Todos podem clicar agora
                        style={{ cursor: 'pointer' }} // Cursor pointer para todos
                    >
                        {/* Mostra ícone de edição apenas para quem pode editar */}
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
                                {item.inStock ? '' : ''}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal de Edição (Apenas Admin/Dev) */}
            {editingItem && (
                <EditModal
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onSave={handleSave}
                />
            )}

            {/* Modal de Visualização (Todos os outros) */}
            {viewingItem && (
                <ViewModal
                    item={viewingItem}
                    onClose={() => setViewingItem(null)}
                />
            )}

            {apllyIcons.length === 0 && (
                <p>Nenhum aplique cadastrado no momento.</p>
            )}
        </div>
    );
};

export default ApliquesPage;
