import React, { useEffect, useState, type FormEvent } from 'react';
import { useApliqueStore } from '../store/ApliqueStore';
import './ApliquesPage.css'; // Reutiliza o CSS padrão
import { useAuthStore } from '../store/AuthStore';
import type { VisualItem } from '../types/visual-item';
import {
    FaCube,
    FaEdit,
    FaTimes,
    FaShoppingCart,
    FaClipboardList,
} from 'react-icons/fa';

// =========================================================
// MODAIS (Reutilizados para permitir edição rápida ao chegar o material)
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
                    <p
                        className="item-description"
                        style={{ color: '#c0392b', fontWeight: 'bold' }}
                    >
                        Item Indisponível (Estoque: {item.quantity ?? 0})
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
    // Se for null, considera 0 para facilitar a edição
    const [quantity, setQuantity] = useState<number | null>(item.quantity || 0);
    const [imagem, setImagem] = useState(item.imageUrl || '');
    const [inStock, setInStock] = useState(item.inStock); // Vem como false
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
                    <FaEdit /> Reposição de Estoque: {item.code}
                </h2>
                <p
                    style={{
                        fontSize: '0.9rem',
                        color: '#666',
                        marginBottom: '1rem',
                    }}
                >
                    Ao receber novos itens, atualize a quantidade e marque "Em
                    Estoque".
                </p>
                <form onSubmit={handleSubmit} className="edit-form">
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
                            <FaCube /> Nova Quantidade:
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
                            style={{ border: '2px solid #27ae60' }} // Verde para indicar entrada
                            autoFocus
                        />
                    </div>
                    {/* Checkbox destacado para reativar o produto */}
                    <div
                        className="form-group checkbox-group"
                        style={{
                            background: '#e8f8f5',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px dashed #27ae60',
                        }}
                    >
                        <label style={{ color: '#27ae60', fontWeight: 'bold' }}>
                            Reativar Venda (Em Estoque)?
                        </label>
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
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ backgroundColor: '#27ae60' }}
                        >
                            Confirmar Entrada
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// =========================================================
// PÁGINA: NECESSIDADE DE COMPRA
// =========================================================
const RestockApliquesPage: React.FC = () => {
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

    // Lógica de Filtragem: inStock FALSE E Quantidade <= 2 (ou nula)
    const restockItems = apllyIcons.filter(
        (item) =>
            item.inStock === false &&
            (item.quantity === null ||
                item.quantity === undefined ||
                item.quantity <= 2)
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
                <h1>Carregando Lista de Compras...</h1>
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
                    color: '#8e44ad',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}
            >
                <FaClipboardList /> Lista de Reposição (Apliques)
            </h1>
            <p className="page-description">
                Itens atualmente <strong>indisponíveis</strong> no site que
                precisam ser comprados (Qtd ≤ 2).
            </p>

            <div className="aplly-grid">
                {restockItems.map((item) => (
                    <div
                        key={item.id}
                        className="aplly-card"
                        onClick={() => handleCardClick(item)}
                        style={{
                            cursor: 'pointer',
                            border: '2px dashed #95a5a6',
                            opacity: 0.8,
                            filter: 'grayscale(30%)', // Efeito visual de "desativado"
                        }}
                    >
                        {canEdit && <FaEdit className="edit-icon" />}

                        <div style={{ position: 'relative' }}>
                            <img
                                src={item.imageUrl}
                                alt={item.code}
                                className="aplly-image"
                            />
                            {/* Badge de Compra */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    background: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    padding: '10px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50px',
                                    height: '50px',
                                }}
                            >
                                <FaShoppingCart size={24} />
                            </div>

                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    right: '10px',
                                    background: '#7f8c8d',
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                }}
                            >
                                Restam: {item.quantity ?? 0}
                            </div>
                        </div>

                        <h3
                            className="aplly-title"
                            style={{ color: '#7f8c8d' }}
                        >
                            {item.code}
                        </h3>
                    </div>
                ))}
            </div>

            {restockItems.length === 0 && (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '50px',
                        color: '#27ae60',
                    }}
                >
                    <h2>Nenhuma reposição necessária!</h2>
                    <p>Não há apliques inativos com estoque baixo.</p>
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

export default RestockApliquesPage;
