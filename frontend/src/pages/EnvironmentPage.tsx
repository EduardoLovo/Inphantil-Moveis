import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaMapMarkerAlt, FaImages, FaSpinner, FaTimes } from 'react-icons/fa';
import './EnvironmentPage.css';
import { useAuthStore } from '../store/AuthStore';
import { useNavigate } from 'react-router-dom';

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

const EnvironmentPage: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'DEV';

    const [environments, setEnvironments] = useState<Environment[]>([]);
    const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);
    const [loading, setLoading] = useState(true);

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = useState(false);

    useEffect(() => {
        const fetchEnvironments = async () => {
            try {
                const response = await api.get('/environments');
                setEnvironments(response.data);
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

    const closePreview = () => {
        setPreviewImage(null);
        setIsZoomed(false);
        setPosition({ x: 0, y: 0 });
        setHasMoved(false);
    };

    // Handler de CLIQUE NA IMAGEM
    const handleImageClick = (e: React.MouseEvent) => {
        // 1. Impede que o clique passe para o fundo (que fecharia o modal)
        e.stopPropagation();

        // 2. Se o usuário estava arrastando, não fazemos toggle de zoom
        if (hasMoved) {
            setHasMoved(false); // Reseta flag e sai
            return;
        }

        // 3. Se foi um clique limpo, alterna o zoom
        if (isZoomed) {
            setIsZoomed(false);
            setPosition({ x: 0, y: 0 }); // Reseta posição ao tirar zoom
        } else {
            setIsZoomed(true);
        }
    };

    // Início do Arrasto
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isZoomed) return; // Só arrasta se tiver zoom
        e.preventDefault(); // Evita comportamento nativo de "arrastar fantasma" da imagem

        setIsDragging(true);
        setHasMoved(false); // Reseta flag de movimento
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    // Durante o Arrasto
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !isZoomed) return;

        e.preventDefault();
        setHasMoved(true); // Marca que o usuário moveu o mouse (não é só um clique)

        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    // Fim do Arrasto
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    if (loading) {
        return (
            <div className="env-loading">
                <FaSpinner className="spinner" /> Carregando Showroom...
            </div>
        );
    }

    return (
        <div className="env-page-container">
            {/* --- SIDEBAR --- */}
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

            {/* --- ÁREA PRINCIPAL --- */}
            <main className="env-content">
                {selectedEnv ? (
                    <div className="env-display fade-in">
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

                        <div className="env-gallery-section">
                            <h3>Galeria</h3>
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
                                                alt={`Detalhe`}
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
                                    Nenhuma foto adicional.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="env-empty-state">
                        <p>Selecione um ambiente ao lado.</p>
                    </div>
                )}
            </main>

            {/* --- MODAL (LIGHTBOX) --- */}
            {/* --- MODAL REFEITO --- */}
            {previewImage && (
                <div
                    className="env-modal-overlay"
                    onClick={closePreview} // CLICOU NO FUNDO -> FECHA
                    // Permite arrastar mesmo se o mouse sair da área da imagem um pouco
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <div className="env-modal-content">
                        {/* Botão X também fecha */}
                        <button
                            className="env-modal-close"
                            onClick={(e) => {
                                e.stopPropagation(); // Garante que não dispare duplo click
                                closePreview();
                            }}
                        >
                            <FaTimes />
                        </button>

                        <div className="img-container">
                            <img
                                src={previewImage}
                                alt="Visualização"
                                className={`modal-img ${
                                    isZoomed ? 'zoomed' : ''
                                }`}
                                // Eventos de Mouse
                                onMouseDown={handleMouseDown}
                                // onClick captura o final do clique na imagem
                                onClick={handleImageClick}
                                style={{
                                    transform: isZoomed
                                        ? `translate(${position.x}px, ${position.y}px) scale(2.5)`
                                        : `translate(0, 0) scale(1)`,
                                    transition: isDragging
                                        ? 'none'
                                        : 'transform 0.3s ease-out',
                                    cursor: isZoomed
                                        ? isDragging
                                            ? 'grabbing'
                                            : 'grab'
                                        : 'zoom-in',
                                }}
                                draggable="false" // Importante
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnvironmentPage;
