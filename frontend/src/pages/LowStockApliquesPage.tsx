import React, { useEffect, useState, type FormEvent } from 'react';
import { useApliqueStore } from '../store/ApliqueStore';
import './ApliquesPage.css'; // Reutiliza o CSS existente
import { useAuthStore } from '../store/AuthStore';
import type { VisualItem } from '../types/visual-item';
import {
    FaCube,
    FaEdit,
    FaSortNumericUp,
    FaTimes,
    FaExclamationTriangle,
} from 'react-icons/fa';

// =========================================================
// MODAIS (Reutilizados para manter funcionalidade)
// =========================================================

const ViewModal: React.FC<{ item: VisualItem; onClose: () => void }> = ({
    item,
    onClose,
}) => {
    return (
        <div
            className="modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="modal-view-card">
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
                    <p className="item-description">
                        Quantidade Atual: <strong>{item.quantity}</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

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
                    <FaEdit /> Editar Estoque: {item.code}
                </h2>
                <form onSubmit={handleSubmit} className="edit-form">
                    {/* Campos essenciais para edição rápida de estoque */}
                    <div className="form-group">
                        <label>Código:</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="form-input"
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <FaCube /> Quantidade (Atualize aqui):
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
                            style={{ border: '2px solid #e74c3c' }} // Destaque visual
                            autoFocus
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
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading}>
                            Salvar Correção
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// =========================================================
// PÁGINA PRINCIPAL DE BAIXO ESTOQUE
// =========================================================
const LowStockApliquesPage: React.FC = () => {
    const { apllyIcons, isLoading, error, fetchApliques, updateAplique } =
        useApliqueStore();
    const user = useAuthStore((state) => state.user);

    const [editingItem, setEditingItem] = useState<VisualItem | null>(null);
    const [viewingItem, setViewingItem] = useState<VisualItem | null>(null);

    const canEdit = user && (user.role === 'ADMIN' || user.role === 'DEV');

    useEffect(() => {
        if (apllyIcons.length === 0) {
            fetchApliques();
        }
    }, [fetchApliques, apllyIcons.length]);

    // Lógica de Filtragem: Estoque <= 3 E inStock = true
    const lowStockItems = apllyIcons.filter(
        (item) =>
            item.inStock === true &&
            item.quantity !== null &&
            item.quantity !== undefined &&
            item.quantity <= 3
    );

    const handleCardClick = (item: VisualItem) => {
        if (canEdit) setEditingItem(item);
        else setViewingItem(item);
    };

    const handleSave = async (data: any) => {
        await updateAplique(data);
    };

    if (isLoading)
        return (
            <div className="aplly-page-container">
                <h1>Carregando...</h1>
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
            <h1
                style={{
                    color: '#e74c3c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}
            >
                <FaExclamationTriangle /> Apliques com Baixo Estoque
            </h1>
            <p className="page-description">
                Exibindo itens ativos com quantidade igual ou inferior a 3.
            </p>

            <div className="aplly-grid">
                {lowStockItems.map((item) => (
                    <div
                        key={item.id}
                        className="aplly-card"
                        onClick={() => handleCardClick(item)}
                        style={{
                            cursor: 'pointer',
                            border: '2px solid #e74c3c',
                        }}
                    >
                        {canEdit && <FaEdit className="edit-icon" />}

                        <div style={{ position: 'relative' }}>
                            <img
                                src={item.imageUrl}
                                alt={item.code}
                                className="aplly-image"
                            />
                            {/* Badge de quantidade */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    right: '10px',
                                    background: '#e74c3c',
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '20px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                }}
                            >
                                Qtd: {item.quantity}
                            </div>
                        </div>

                        <h3 className="aplly-title">{item.code}</h3>
                    </div>
                ))}
            </div>

            {lowStockItems.length === 0 && (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '50px',
                        color: '#27ae60',
                    }}
                >
                    <h2>Tudo certo!</h2>
                    <p>Nenhum aplique com estoque crítico (≤ 3) no momento.</p>
                </div>
            )}

            {editingItem && (
                <EditModal
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onSave={handleSave}
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

export default LowStockApliquesPage;
