import React, { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
    FaSave,
    FaTrash,
    FaImage,
    FaHeading,
    FaStar,
    FaArrowLeft,
    FaPlus,
    FaSpinner,
} from 'react-icons/fa';
import axios from 'axios';
import './CreateEnvironmentPage.css'; // Reutilizando o CSS da criação

// Interfaces
interface EnvironmentImage {
    id: number;
    url: string;
}

interface Environment {
    id: number;
    title: string;
    cover: string;
    images: EnvironmentImage[];
}

interface UpdateEnvironmentPayload {
    title: string;
    cover: string;
    images: string[]; // Enviaremos a lista atualizada de URLs
}

const EditEnvironmentPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // --- Estados ---
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [title, setTitle] = useState('');
    const [coverUrl, setCoverUrl] = useState('');

    // Galeria
    const [currentGalleryUrl, setCurrentGalleryUrl] = useState('');
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    const [message, setMessage] = useState<{
        text: string;
        type: 'success' | 'error';
    } | null>(null);

    // 1. Carregar Dados do Ambiente
    useEffect(() => {
        const fetchEnvironment = async () => {
            try {
                const response = await api.get(`/environments/${id}`);
                const env: Environment = response.data;

                setTitle(env.title);
                setCoverUrl(env.cover);
                // Mapeia os objetos de imagem apenas para suas URLs
                setGalleryImages(env.images.map((img) => img.url));
            } catch (error) {
                console.error('Erro ao carregar ambiente:', error);
                setMessage({
                    text: 'Erro ao carregar dados do ambiente.',
                    type: 'error',
                });
            } finally {
                setIsLoadingData(false);
            }
        };

        if (id) {
            fetchEnvironment();
        }
    }, [id]);

    // --- Handlers de Imagem ---

    const handleAddGalleryImage = () => {
        const url = currentGalleryUrl.trim();
        if (url && !galleryImages.includes(url)) {
            setGalleryImages([...galleryImages, url]);
            setCurrentGalleryUrl('');
        }
    };

    const handleRemoveGalleryImage = (index: number) => {
        setGalleryImages(galleryImages.filter((_, i) => i !== index));
    };

    // --- Submissão (Update) ---
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        if (!title.trim() || !coverUrl.trim()) {
            setMessage({
                text: 'Título e Imagem de Capa são obrigatórios.',
                type: 'error',
            });
            setIsSaving(false);
            return;
        }

        const payload: UpdateEnvironmentPayload = {
            title: title.trim(),
            cover: coverUrl.trim(),
            images: galleryImages, // O backend deve tratar a atualização (remover antigas/adicionar novas)
        };

        try {
            await api.put(`/environments/${id}`, payload);

            setMessage({
                text: `Ambiente atualizado com sucesso!`,
                type: 'success',
            });

            // Opcional: Redirecionar após sucesso
            // setTimeout(() => navigate('/showroom'), 1500);
        } catch (error) {
            console.error(error);
            let errorMessage = 'Erro ao atualizar ambiente.';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || errorMessage;
            }
            setMessage({ text: errorMessage, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="loading-container">
                <FaSpinner className="spinner" /> Carregando...
            </div>
        );
    }

    return (
        <div className="calculator-container">
            <div className="calculator-card" style={{ maxWidth: '800px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '20px',
                    }}
                >
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                        }}
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 style={{ margin: 0 }}>
                        <FaImage className="header-icon" /> Editar Ambiente
                    </h1>
                </div>

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
                                required
                                disabled={isSaving}
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
                                required
                                disabled={isSaving}
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
                    <h3>Editar Galeria de Fotos</h3>
                    <div
                        className="form-row"
                        style={{ alignItems: 'flex-end' }}
                    >
                        <div className="form-group flex-3">
                            <label>Adicionar Nova URL:</label>
                            <input
                                type="url"
                                value={currentGalleryUrl}
                                onChange={(e) =>
                                    setCurrentGalleryUrl(e.target.value)
                                }
                                placeholder="https://..."
                                disabled={isSaving}
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
                                disabled={!currentGalleryUrl || isSaving}
                                style={{ backgroundColor: '#6c757d' }}
                            >
                                <FaPlus /> Adicionar
                            </button>
                        </div>
                    </div>

                    {/* Lista Visual da Galeria */}
                    {galleryImages.length > 0 ? (
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
                    ) : (
                        <p
                            style={{
                                color: '#666',
                                fontStyle: 'italic',
                                marginTop: '10px',
                            }}
                        >
                            Nenhuma foto na galeria.
                        </p>
                    )}

                    {/* Botão Salvar */}
                    <div className="form-action" style={{ marginTop: '2rem' }}>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="calculate-button"
                        >
                            <FaSave />{' '}
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEnvironmentPage;
