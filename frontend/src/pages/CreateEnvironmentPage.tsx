import React, { useState, type FormEvent } from 'react';
import { api } from '../services/api';
import { FaPlus, FaTrash, FaImage, FaHeading, FaStar } from 'react-icons/fa';
import './CreateApliquePage.css'; // Reutilizando o CSS padrão de formulários
import './CreateEnvironmentPage.css'; // <--- ADICIONE ESTA LINHA
import axios from 'axios';

// Interface do Payload para o Backend (baseado no Schema Environment)
interface CreateEnvironmentPayload {
    title: string;
    cover: string;
    images: string[]; // O backend deve receber isso e criar os EnvironmentImage
}

const CreateEnvironmentPage: React.FC = () => {
    // --- Estados ---
    const [title, setTitle] = useState('');
    const [coverUrl, setCoverUrl] = useState('');

    // Estado para a Galeria
    const [currentGalleryUrl, setCurrentGalleryUrl] = useState('');
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    // Estados de UI
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{
        text: string;
        type: 'success' | 'error';
    } | null>(null);

    // --- Handlers de Imagem ---

    // Adicionar imagem à lista da galeria
    const handleAddGalleryImage = () => {
        const url = currentGalleryUrl.trim();
        if (url && !galleryImages.includes(url)) {
            setGalleryImages([...galleryImages, url]);
            setCurrentGalleryUrl('');
        }
    };

    // Remover imagem da lista
    const handleRemoveGalleryImage = (index: number) => {
        setGalleryImages(galleryImages.filter((_, i) => i !== index));
    };

    // --- Submissão ---
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Validação simples
        if (!title.trim() || !coverUrl.trim()) {
            setMessage({
                text: 'Título e Imagem de Capa são obrigatórios.',
                type: 'error',
            });
            setLoading(false);
            return;
        }

        const payload: CreateEnvironmentPayload = {
            title: title.trim(),
            cover: coverUrl.trim(),
            images: galleryImages,
        };

        try {
            // Rota sugerida: POST /environments
            await api.post('/environments', payload);

            setMessage({
                text: `Ambiente "${payload.title}" criado com sucesso!`,
                type: 'success',
            });

            // Limpar formulário
            setTitle('');
            setCoverUrl('');
            setGalleryImages([]);
            setCurrentGalleryUrl('');
        } catch (error) {
            console.error(error);
            let errorMessage = 'Erro ao criar ambiente.';
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
            <div className="calculator-card" style={{ maxWidth: '800px' }}>
                <h1>
                    <FaImage className="header-icon" /> Novo Ambiente (Showroom)
                </h1>
                <p className="page-description">
                    Crie um ambiente inspiracional com uma capa e uma galeria de
                    fotos.
                </p>

                {message && (
                    <div className={`message-box message-${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="calculator-form">
                    {/* 1. TÍTULO */}
                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>
                                <FaHeading /> Título do Ambiente:
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Quarto Safari Baby"
                                required
                                disabled={loading}
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* 2. CAPA (COVER) */}
                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>
                                <FaStar /> URL da Capa (Principal):
                            </label>
                            <input
                                type="url"
                                value={coverUrl}
                                onChange={(e) => setCoverUrl(e.target.value)}
                                placeholder="https://..."
                                required
                                disabled={loading}
                                className="form-input"
                            />
                            {coverUrl && (
                                <div
                                    className="preview-mini"
                                    style={{ marginTop: '10px' }}
                                >
                                    <img
                                        src={coverUrl}
                                        alt="Capa Preview"
                                        style={{
                                            maxHeight: '150px',
                                            borderRadius: '8px',
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="admin-divider" />

                    {/* 3. GALERIA (IMAGES) */}
                    <h3>Galeria de Fotos Internas</h3>
                    <div
                        className="form-row"
                        style={{ alignItems: 'flex-end' }}
                    >
                        <div className="form-group flex-3">
                            <label>URL da Imagem:</label>
                            <input
                                type="url"
                                value={currentGalleryUrl}
                                onChange={(e) =>
                                    setCurrentGalleryUrl(e.target.value)
                                }
                                placeholder="https://..."
                                disabled={loading}
                                className="form-input"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddGalleryImage();
                                    }
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <button
                                type="button"
                                onClick={handleAddGalleryImage}
                                className="calculate-button secondary-button"
                                disabled={!currentGalleryUrl || loading}
                                style={{ backgroundColor: '#6c757d' }}
                            >
                                <FaPlus /> Adicionar
                            </button>
                        </div>
                    </div>

                    {/* Lista Visual da Galeria */}
                    {galleryImages.length > 0 && (
                        <div className="images-grid-preview">
                            {galleryImages.map((img, index) => (
                                <div key={index} className="image-card-preview">
                                    <img src={img} alt={`Galeria ${index}`} />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveGalleryImage(index)
                                        }
                                        className="remove-btn-overlay"
                                        title="Remover"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Botão Salvar */}
                    <div className="form-action" style={{ marginTop: '2rem' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="calculate-button"
                        >
                            {loading ? 'Salvando...' : 'Criar Ambiente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEnvironmentPage;
