import React, { useEffect, useState, type FormEvent } from 'react';
import { useApliqueStore } from '../store/ApliqueStore';
import './ApliquesPage.css'; // Vamos criar um CSS simples
import { useAuthStore } from '../store/AuthStore';
import type { VisualItem } from '../types/visual-item';
import { FaCube, FaEdit, FaSortNumericUp } from 'react-icons/fa';

// Componente para o Modal (Pode ser um componente separado, mas aqui incluímos para simplicidade)
const EditModal: React.FC<{
    item: VisualItem;
    onClose: () => void;
    onSave: (data: any) => void;
}> = ({ item, onClose, onSave }) => {
    // 1. INICIALIZAÇÃO CORRETA: Usa o valor do item, caindo para null se não houver.
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
            // 2. Cria o payload, que será filtrado na store
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
            // Mostrar mensagem de erro na UI
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
                    {/* Campo Código */}
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

                    {/* Campo Imagem URL */}
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

                    {/* Campo Quantidade */}
                    <div className="form-group">
                        <label>
                            <FaCube className="input-icon" /> Quantidade:
                        </label>
                        <input
                            type="number"
                            // CORREÇÃO: Exibir string vazia para null
                            value={quantity === null ? '' : quantity}
                            onChange={(e) => {
                                const value = e.target.value;
                                setQuantity(
                                    value === '' ? null : Number(value)
                                );
                            }}
                            className="form-input"
                        />
                    </div>

                    {/* Checkbox Em Estoque */}
                    <div className="form-group checkbox-group">
                        <label>Em Estoque:</label>
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={inStock}
                            onChange={(e) => setInStock(e.target.checked)}
                        />
                    </div>

                    {/* Campo Sequência */}
                    <div className="form-group">
                        <label>
                            <FaSortNumericUp className="input-icon" />{' '}
                            Sequência:
                        </label>
                        <input
                            type="number"
                            value={sequence === null ? '' : sequence}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSequence(
                                    value === '' ? null : Number(value)
                                );
                            }}
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
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ApliquesPage: React.FC = () => {
    const { apllyIcons, isLoading, error, fetchApliques, updateAplique } =
        useApliqueStore();
    const user = useAuthStore((state) => state.user);

    const [editingItem, setEditingItem] = useState<VisualItem | null>(null);

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

    if (isLoading) {
        return (
            <div className="aplly-page-container">
                <h1>Carregando Apliques...</h1>
            </div>
        );
    }

    // 3. Função para determinar as classes CSS
    const getCardClassName = (inStock: boolean): string => {
        let className = 'aplly-card';
        if (!isStaff) return className; // Se não for da equipe, usa apenas 'aplly-card'

        // Adiciona classe de cor para membros da equipe
        className += inStock ? ' in-stock-staff' : ' out-of-stock-staff';
        return className;
    };

    if (error) {
        return (
            <div className="aplly-page-container">
                <h1>Erro ao carregar apliques: {error}</h1>
            </div>
        );
    }

    const handleEditClick = (item: VisualItem) => {
        if (isStaff) {
            setEditingItem(item);
        }
    };

    const handleSave = async (data: any) => {
        await updateAplique(data);
        // O estado da store será atualizado, não precisa fazer mais nada aqui
    };

    return (
        <div className="aplly-page-container">
            <h1>Catálogo de Apliques</h1>
            <p className="page-description">
                {isStaff
                    ? 'Visualização de Gestão: Todos os itens com status de estoque destacado.'
                    : 'Visualização Pública: Apenas itens em estoque.'}
            </p>

            <div className="aplly-grid">
                {apllyIcons.map((item) => (
                    // 4. Aplicar classe condicional
                    <div
                        key={item.id}
                        className={getCardClassName(item.inStock)}
                        onClick={() => handleEditClick(item)}
                        style={{ cursor: isStaff ? 'pointer' : 'default' }}
                    >
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="aplly-image"
                        />
                        <h3 className="aplly-title">{item.code}</h3>

                        {/* 5. Tag de Status (Visível apenas para Staff) */}
                        {isStaff && (
                            <span
                                className={`stock-tag ${
                                    item.inStock
                                        ? 'tag-in-stock'
                                        : 'tag-out-of-stock'
                                }`}
                            ></span>
                        )}
                    </div>
                ))}
            </div>

            {/* 2. Renderiza o Modal se houver um item em edição */}
            {editingItem && (
                <EditModal
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onSave={handleSave}
                />
            )}

            {apllyIcons.length === 0 && (
                <p>Nenhum aplique cadastrado no momento.</p>
            )}
        </div>
    );
};

export default ApliquesPage;
