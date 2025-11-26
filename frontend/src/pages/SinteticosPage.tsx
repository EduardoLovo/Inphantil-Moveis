import React, { useEffect, useState, type FormEvent } from 'react';
import { useSinteticoStore } from '../store/SinteticoStore';
import { useAuthStore } from '../store/AuthStore';
import { FaEdit, FaTimes } from 'react-icons/fa';
import type { VisualItem } from '../types/visual-item';
import './SinteticosPage.css';

const FILTER_OPTIONS = [
    'TODOS',
    'AMARELO',
    'AZUL',
    'BEGE',
    'BRANCO',
    'CINZA',
    'LARANJA',
    'LILAS',
    'MOSTARDA',
    'ROSA',
    'TIFFANY',
    'VERDE',
    'VERMELHO',
    'EXTERNO',
];

// =========================================================
// 1. MODAL DE VISUALIZAÇÃO (Para Clientes/Sellers)
// =========================================================
const ViewModal: React.FC<{ item: VisualItem; onClose: () => void }> = ({
    item,
    onClose,
}) => {
    // Fecha ao clicar no overlay
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-view-card">
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>

                <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="modal-view-image"
                />

                <div className="modal-view-info">
                    <h2>{item.code}</h2>
                    {item.name && <p className="item-name">{item.name}</p>}

                    <div className="modal-badges">
                        {item.color && (
                            <span className="info-badge color-badge">
                                {item.color}
                            </span>
                        )}
                        {item.isExternal && (
                            <span className="info-badge external-badge">
                                Externo
                            </span>
                        )}
                        {!item.inStock && (
                            <span className="info-badge out-badge">
                                Indisponível
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// =========================================================
// 2. MODAL DE EDIÇÃO (Para Admin/Dev)
// =========================================================
const EditSinteticoModal: React.FC<{
    item: VisualItem;
    onClose: () => void;
    onSave: (data: any) => void;
}> = ({ item, onClose, onSave }) => {
    const [code, setCode] = useState(item.code);
    const [imageUrl, setImageUrl] = useState(item.imageUrl);
    const [color, setColor] = useState(item.color || '');
    const [inStock, setInStock] = useState(item.inStock);
    const [isExternal, setIsExternal] = useState(item.isExternal || false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({
                id: item.id,
                code,
                imageUrl,
                color: color || null,
                inStock,
                isExternal,
            });
            onClose();
        } catch (error) {
            alert('Erro ao salvar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>
                    <FaEdit /> Editar Sintético
                </h2>
                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                        <label>Código:</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Imagem URL:</label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Cor:</label>
                        <select
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="form-select"
                        >
                            <option value="">Sem cor</option>
                            {FILTER_OPTIONS.slice(1, -1).map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-row checkboxes-row">
                        <div className="form-group checkbox-group">
                            <label>Em Estoque:</label>
                            <input
                                type="checkbox"
                                checked={inStock}
                                onChange={(e) => setInStock(e.target.checked)}
                            />
                        </div>
                        <div className="form-group checkbox-group">
                            <label>Externo:</label>
                            <input
                                type="checkbox"
                                checked={isExternal}
                                onChange={(e) =>
                                    setIsExternal(e.target.checked)
                                }
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="calculate-button"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// =========================================================
// 3. COMPONENTE DA PÁGINA
// =========================================================
const SinteticosPage: React.FC = () => {
    const { sinteticos, isLoading, error, fetchSinteticos, updateSintetico } =
        useSinteticoStore();
    const user = useAuthStore((state) => state.user);
    const [selectedFilter, setSelectedFilter] = useState('TODOS');

    // Estados para controlar qual modal está aberto
    const [editingItem, setEditingItem] = useState<VisualItem | null>(null);
    const [viewingItem, setViewingItem] = useState<VisualItem | null>(null);

    // Permissões
    const canEdit = user && (user.role === 'ADMIN' || user.role === 'DEV');
    const isStaff =
        user &&
        (user.role === 'ADMIN' ||
            user.role === 'DEV' ||
            user.role === 'SELLER');

    useEffect(() => {
        if (sinteticos.length === 0) fetchSinteticos();
    }, [fetchSinteticos, sinteticos.length]);

    // Lógica de Clique no Card
    const handleCardClick = (item: VisualItem) => {
        if (canEdit) {
            setEditingItem(item); // Abre edição para Admin/Dev
        } else {
            setViewingItem(item); // Abre visualização para Seller/User/Public
        }
    };

    // Filtros
    const filteredItems = sinteticos.filter((item) => {
        if (selectedFilter === 'TODOS') return true;
        if (selectedFilter === 'EXTERNO') return item.isExternal;
        return item.color === selectedFilter;
    });

    const getCardClassName = (inStock: boolean): string => {
        let className = 'sintetico-card';
        if (!isStaff) return className;
        return (
            className + (inStock ? ' in-stock-staff' : ' out-of-stock-staff')
        );
    };

    if (isLoading)
        return (
            <div className="sintetico-loading">
                <h1>Carregando...</h1>
            </div>
        );
    if (error)
        return (
            <div className="sintetico-error">
                <h1>Erro: {error}</h1>
            </div>
        );

    return (
        <div className="sintetico-page-container">
            <h1>Catálogo de Cores</h1>

            <div className="filter-bar">
                {FILTER_OPTIONS.map((filter) => (
                    <button
                        key={filter}
                        className={`filter-button ${
                            selectedFilter === filter ? 'active' : ''
                        }`}
                        onClick={() => setSelectedFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="instruction-text">
                <p>***MUITO IMPORTANTE***</p>
                <p>O tom das cores pode alterar de aparelho para aparelho.</p>
            </div>

            <div className="sintetico-grid">
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className={getCardClassName(item.inStock)}
                        onClick={() => handleCardClick(item)} // Clique Centralizado
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="image-wrapper">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="sintetico-image"
                            />
                        </div>
                        <h3 className="sintetico-code">{item.code}</h3>
                        {/* Tag de estoque apenas para staff na visualização em grade */}
                        {isStaff && (
                            <span
                                className={`stock-tag ${
                                    item.inStock ? 'tag-in' : 'tag-out'
                                }`}
                            >
                                {item.inStock ? 'Em Estoque' : 'Sem Estoque'}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Renderização Condicional dos Modais */}
            {editingItem && (
                <EditSinteticoModal
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onSave={updateSintetico}
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

export default SinteticosPage;
