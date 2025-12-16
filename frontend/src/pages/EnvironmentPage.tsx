import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaMapMarkerAlt, FaImages, FaSpinner, FaTimes } from 'react-icons/fa';
import './EnvironmentPage.css';
import { useAuthStore } from '../store/AuthStore';
import { useNavigate } from 'react-router-dom';

// Interfaces baseadas no seu Schema
interface EnvironmentImage {
    id: number;
    url: string;
}

interface Environment {
    id: number;
    title: string;
    cover: string;
    images: EnvironmentImage[]; // Relação com as fotos
}

const EnvironmentPage: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'DEV';
    const [environments, setEnvironments] = useState<Environment[]>([]);
    const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);
    const [loading, setLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Buscar ambientes ao carregar
    useEffect(() => {
        const fetchEnvironments = async () => {
            try {
                // Ajuste a rota se necessário (ex: /showroom ou /environments)
                const response = await api.get('/environments');
                setEnvironments(response.data);

                // Seleciona o primeiro automaticamente se houver dados
                if (response.data.length > 0) {
                    setSelectedEnv(response.data[0]);
                }
            } catch (error) {
                console.error('Erro ao buscar ambientes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnvironments();
    }, []);

    if (loading) {
        return (
            <div className="env-loading">
                <FaSpinner className="spinner" /> Carregando Showroom...
            </div>
        );
    }

    return (
        <div className="env-page-container">
            {/* --- SIDEBAR FLUTUANTE (Menu) --- */}
            <aside className="env-sidebar">
                <div className="env-sidebar-header">
                    <h2>Ambientes</h2>
                    <p>Escolha uma inspiração</p>
                </div>

                <ul className="env-list">
                    {environments.map((env) => (
                        <li
                            key={env.id}
                            className={`env-item ${
                                selectedEnv?.id === env.id ? 'active' : ''
                            }`}
                            onClick={() => setSelectedEnv(env)}
                        >
                            <div className="env-item-thumb">
                                <img src={env.cover} alt={env.title} />
                            </div>
                            <div className="env-item-info">
                                <span className="env-name">{env.title}</span>
                                <span className="env-count">
                                    <FaImages />{' '}
                                    {env.images ? env.images.length : 0} fotos
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* --- ÁREA PRINCIPAL (Conteúdo) --- */}
            <main className="env-content">
                {selectedEnv ? (
                    <div className="env-display fade-in">
                        {/* Cabeçalho do Ambiente */}
                        <div
                            className="env-hero"
                            style={{
                                backgroundImage: `url(${selectedEnv.cover})`,
                            }}
                        >
                            <div className="env-hero-overlay">
                                <h1>{selectedEnv.title}</h1>
                                {isAdmin && (
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/admin/ambientes/edit/${selectedEnv.id}`
                                            )
                                        }
                                        className="admin-edit-btn"
                                    >
                                        Editar Ambiente
                                    </button>
                                )}
                                <p>
                                    <FaMapMarkerAlt /> Visualizando Galeria
                                    Completa
                                </p>
                            </div>
                        </div>

                        {/* Galeria de Fotos */}
                        <div className="env-gallery-section">
                            <h3>Galeria de Detalhes</h3>

                            {selectedEnv.images &&
                            selectedEnv.images.length > 0 ? (
                                <div className="env-grid">
                                    {selectedEnv.images.map((img) => (
                                        <div
                                            key={img.id}
                                            className="env-photo-card"
                                            onClick={() =>
                                                setPreviewImage(img.url)
                                            }
                                        >
                                            <img
                                                src={img.url}
                                                alt={`Detalhe de ${selectedEnv.title}`}
                                                loading="lazy"
                                            />
                                            <div className="card-hover-overlay">
                                                <span>Ver Ampliado</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-photos">
                                    Nenhuma foto adicional neste ambiente.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="env-empty-state">
                        <p>Selecione um ambiente ao lado para ver as fotos.</p>
                    </div>
                )}
            </main>

            {/* --- MODAL (LIGHTBOX) --- */}
            {previewImage && (
                <div
                    className="env-modal-overlay"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="env-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="env-modal-close"
                            onClick={() => setPreviewImage(null)}
                        >
                            <FaTimes />
                        </button>
                        <img src={previewImage} alt="Visualização Ampliada" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnvironmentPage;
