import React, { useState, type FormEvent } from 'react';
import { api } from '../services/api';
import { FaCube, FaCode, FaLink, FaLayerGroup } from 'react-icons/fa';
import { type VisualItem } from '../types/visual-item';
import './CreateTecidoPage.css';
import axios from 'axios';

// Deriva o tipo do campo 'type' da interface VisualItem
type VisualItemType = VisualItem['type'];

// Interface de Dados para o Payload
interface CreateTecidoData {
    name: string;
    code: string;
    imageUrl: string;
    color: string;
    quantity: number | null;
    inStock: boolean;
    type: VisualItemType; // Tipo derivado
}

const CreateTecidoPage: React.FC = () => {
    // Estados do Formulário
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [color, setColor] = useState('');
    const [quantity, setQuantity] = useState<number | null>(null);
    const [inStock, setInStock] = useState(true);

    // Estados de UI
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{
        text: string;
        type: 'success' | 'error';
    } | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Monta o payload com o tipo fixo 'TECIDO'
        const payload: CreateTecidoData = {
            name: name.trim(),
            code: code.trim(),
            color: color.trim(),
            imageUrl: imageUrl.trim(),
            quantity: quantity !== null ? quantity : 0,
            inStock: inStock,
            // CHAVE: Define o tipo como TECIDO
            type: 'TECIDO' as VisualItemType,
        };

        if (!payload.code || !payload.imageUrl) {
            setMessage({
                text: 'Código e URL da Imagem são obrigatórios.',
                type: 'error',
            });
            setLoading(false);
            return;
        }

        try {
            await api.post('/visual-items', payload);

            setMessage({
                text: `Tecido "${payload.code}" adicionado com sucesso!`,
                type: 'success',
            });

            // Limpa o formulário
            setName('');
            setCode('');
            setImageUrl('');
            setColor('');
            setQuantity(null);
            setInStock(true);
        } catch (error) {
            console.error(error);
            let errorMessage = 'Erro ao criar tecido. Verifique o console.';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || errorMessage;
            }
            setMessage({ text: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="calculator-container">
            <div className="calculator-card">
                <h1>
                    <FaLayerGroup className="header-icon" /> Adicionar Novo
                    Tecido
                </h1>
                <p className="page-description">
                    Cadastre um novo tecido para o catálogo de demonstração
                    (Lençóis, Mantas, etc).
                </p>

                {message && (
                    <div className={`message-box message-${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="calculator-form">
                    {/* Linha 1: Código e URL */}
                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>
                                <FaCode /> Código / Nome do Tecido:
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                                className="form-input"
                                placeholder="Ex: Algodão 200 Fios Bege"
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label>
                                <FaCode /> Código / Nome do Tecido:
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                disabled={loading}
                                className="form-input"
                                placeholder="Ex: Algodão 200 Fios Bege"
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label>
                                <FaLink /> Imagem URL:
                            </label>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                required
                                disabled={loading}
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Linha 2: Descrição */}
                    <div className="form-group">
                        <label>Cor:</label>
                        <textarea
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            rows={3}
                            disabled={loading}
                            className="form-input"
                            placeholder="Ex: Tecido 100% algodão, toque macio..."
                        />
                    </div>

                    {/* Linha 3: Quantidade, Sequência e Estoque */}
                    <div className="form-row controls-row">
                        <div className="form-group flex-1">
                            <label>
                                <FaCube /> Quantidade (Metros/Unid):
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
                                min="0"
                                disabled={loading}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group checkbox-group flex-auto">
                            <label>Disponível:</label>
                            <input
                                type="checkbox"
                                checked={inStock}
                                onChange={(e) => setInStock(e.target.checked)}
                                disabled={loading}
                                className="form-checkbox"
                            />
                        </div>
                    </div>

                    <div className="form-action">
                        <button
                            type="submit"
                            disabled={loading}
                            className="calculate-button"
                        >
                            {loading ? 'Salvando...' : 'Salvar Tecido'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTecidoPage;
