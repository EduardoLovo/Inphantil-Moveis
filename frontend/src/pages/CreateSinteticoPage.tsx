import React, { useState, type FormEvent } from 'react';
import { api } from '../services/api';
import { FaCode, FaLink, FaSwatchbook, FaPalette } from 'react-icons/fa';
import { type VisualItem } from '../types/visual-item';
import './CreateSinteticoPage.css'; // Novo CSS
import axios from 'axios';

// Deriva o tipo do campo 'type'
type VisualItemType = VisualItem['type'];

// Lista de Cores (Baseada no seu Enum do Prisma)
const COLORS = [
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
];

// Interface do Payload
interface CreateSinteticoData {
    code: string;
    imageUrl: string;
    inStock: boolean;
    color: string | null;
    isExternal: boolean;
    isTapete: boolean;
    type: VisualItemType;
}

const CreateSinteticoPage: React.FC = () => {
    // Estados
    const [code, setCode] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [color, setColor] = useState('');
    const [inStock, setInStock] = useState(true);
    const [isExternal, setIsExternal] = useState(false);
    const [isTapete, setIsTapete] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{
        text: string;
        type: 'success' | 'error';
    } | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Monta o Payload
        const payload: CreateSinteticoData = {
            code: code.trim(),
            imageUrl: imageUrl.trim(),
            color: color || null, // Envia null se estiver vazio
            inStock,
            isTapete,
            isExternal,
            type: 'SINTETICO' as VisualItemType,
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
                text: `Sintético "${payload.code}" criado com sucesso!`,
                type: 'success',
            });

            // Limpar formulário
            setCode('');
            setImageUrl('');
            setColor('');
            setInStock(true);
            setIsExternal(false);
            setIsTapete(false);
        } catch (error) {
            console.error(error);
            let errorMessage = 'Erro ao criar sintético.';
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
                    <FaSwatchbook className="header-icon" /> Adicionar Novo
                    Sintético
                </h1>
                <p className="page-description">
                    Cadastre materiais sintéticos, tapetes e acabamentos
                    externos.
                </p>

                {message && (
                    <div className={`message-box message-${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="calculator-form">
                    {/* Código e Imagem */}
                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>
                                <FaCode /> Código:
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                disabled={loading}
                                className="form-input"
                                placeholder="Ex: SINT-001"
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

                    {/* Cor e Opções */}
                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>
                                <FaPalette /> Cor Predominante:
                            </label>
                            <select
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="form-select"
                                disabled={loading}
                            >
                                <option value="">
                                    Selecione uma cor (Opcional)
                                </option>
                                {COLORS.map((c) => (
                                    <option
                                        key={c}
                                        value={c}
                                        className="color-opcao"
                                    >
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Checkboxes de Status */}
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
                            <label>Fornecedor Externo:</label>
                            <input
                                type="checkbox"
                                checked={isExternal}
                                onChange={(e) =>
                                    setIsExternal(e.target.checked)
                                }
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label>Apenas para Tapete:</label>
                            <input
                                type="checkbox"
                                checked={isTapete}
                                onChange={(e) => setIsTapete(e.target.checked)}
                            />
                        </div>
                    </div>

                    <div className="form-action">
                        <button
                            type="submit"
                            disabled={loading}
                            className="calculate-button"
                        >
                            {loading ? 'Salvando...' : 'Salvar Sintético'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSinteticoPage;
