import React, { useState, type FormEvent } from 'react';
import { api } from '../services/api';
import {
    FaPlus,
    FaCube,
    FaSortNumericUp,
    FaCode,
    FaLink,
} from 'react-icons/fa';
// IMPORTANTE: Importa a interface VisualItem
import { type VisualItem } from '../types/visual-item';
// import '../components/Calculadoras.css';
import './CreateApliquePage.css';
import axios from 'axios';

// 1. CORREÇÃO: Deriva o tipo da propriedade 'type' da interface VisualItem
// Isso resolve o problema de não ter exportado o enum separadamente.
type VisualItemType = VisualItem['type'];

// 2. Interface de Dados para o Payload (usa o tipo derivado)
interface CreateApliqueData {
    code: string;
    name: string;
    imageUrl: string;
    quantity: number | null;
    sequence: number | null;
    inStock: boolean;
    type: VisualItemType; // Usa o tipo correto
}

// --- Componente CreateApliquePage (Página de Criação) ---

const CreateApliquePage: React.FC = () => {
    // 2. Estados do Formulário
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [quantity, setQuantity] = useState<number | null>(null);
    const [sequence, setSequence] = useState<number | null>(null);
    const [inStock, setInStock] = useState(true); // Padrão: Em estoque

    // Estados de UI
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{
        text: string;
        type: 'success' | 'error';
    } | null>(null);

    // 3. Manipulador de Submissão
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Limpeza de dados antes de enviar
        const payload: CreateApliqueData = {
            code: code.trim(),
            name: name.trim(),
            imageUrl: imageUrl.trim(),
            quantity: quantity !== null ? quantity : 0,
            sequence: sequence !== null ? sequence : 0,
            inStock: inStock,
            // CORREÇÃO: Usa a asserção de tipo com o tipo derivado
            type: 'APLIQUE' as VisualItemType,
        };

        // Verificação básica de campos obrigatórios
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
                text: `Aplique "${payload.code}" criado com sucesso!`,
                type: 'success',
            });

            // Limpa o formulário
            setCode('');
            setName('');
            setImageUrl('');
            setQuantity(null);
            setSequence(null);
            setInStock(true);
        } catch (error) {
            console.error(error);
            let errorMessage = 'Erro ao criar aplique. Verifique o console.';
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
                    <FaPlus className="header-icon" /> Adicionar Novo Aplique
                </h1>
                <p className="page-description">
                    Preencha os detalhes para cadastrar um novo item decorativo
                    de Aplique.
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
                                <FaCode /> Código Único:
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                disabled={loading}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label>Nome(descrição):</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                                className="form-input"
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

                    {/* Linha 3: Quantidade, Sequência e Estoque */}
                    <div className="form-row controls-row">
                        <div className="form-group flex-1">
                            <label>
                                <FaCube /> Quantidade (Estoque):
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

                        <div className="form-group flex-1">
                            <label>
                                <FaSortNumericUp /> Sequência (Exibição):
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
                                disabled={loading}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group checkbox-group flex-auto">
                            <label>Em Estoque:</label>
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
                            {loading ? 'Cadastrando...' : 'Cadastrar Aplique'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateApliquePage;
