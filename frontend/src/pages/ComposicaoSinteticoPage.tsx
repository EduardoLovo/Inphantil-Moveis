import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { FaSearch, FaUndo, FaLayerGroup, FaSwatchbook } from 'react-icons/fa';
import type { VisualItem } from '../types/visual-item';
import './ComposicaoSinteticoPage.css'; // Reutiliza o CSS da outra composição

const ComposicaoSinteticoPage: React.FC = () => {
    // Estados de Dados
    const [sinteticos, setSinteticos] = useState<VisualItem[]>([]);

    // Estados de Seleção
    const [externoSelecionado, setExternoSelecionado] =
        useState<VisualItem | null>(null);
    const [internoSelecionado, setInternoSelecionado] =
        useState<VisualItem | null>(null);

    // Estados de Controle
    const [etapa, setEtapa] = useState<
        'ESCOLHA_EXTERNO' | 'ESCOLHA_INTERNO' | 'RESULTADO'
    >('ESCOLHA_EXTERNO');
    const [busca, setBusca] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 1. Busca Dados Iniciais
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Busca todos os sintéticos de uma vez
                const response = await api.get('/visual-items', {
                    params: { type: 'SINTETICO' },
                });
                setSinteticos(response.data);
            } catch (err) {
                setError('Erro ao carregar materiais sintéticos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // 2. Filtra Listas (Memoizado)
    const materiaisExternos = useMemo(() => {
        return sinteticos
            .filter((item) => item.isExternal === true && item.inStock)
            .sort((a, b) => a.code.localeCompare(b.code));
    }, [sinteticos]);

    const materiaisInternos = useMemo(() => {
        return sinteticos
            .filter((item) => {
                const matchesSearch = item.code
                    .toLowerCase()
                    .includes(busca.toLowerCase());
                return item.inStock && matchesSearch;
            })
            .sort((a, b) => a.code.localeCompare(b.code));
    }, [sinteticos, busca]);

    // 3. Handlers
    const handleSelectExterno = (item: VisualItem) => {
        setExternoSelecionado(item);
        setEtapa('ESCOLHA_INTERNO');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSelectInterno = (item: VisualItem) => {
        setInternoSelecionado(item);
        setEtapa('RESULTADO');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetar = () => {
        setExternoSelecionado(null);
        setInternoSelecionado(null);
        setEtapa('ESCOLHA_EXTERNO');
        setBusca('');
    };

    if (loading)
        return (
            <div className="comp-loading">
                <h1>Carregando materiais...</h1>
            </div>
        );
    if (error)
        return (
            <div className="comp-error">
                <h1>{error}</h1>
            </div>
        );

    return (
        <div className="comp-container">
            <h1 className="comp-title">
                <FaSwatchbook /> Simulador de Sintéticos
            </h1>

            <div className="comp-instructions">
                {etapa === 'ESCOLHA_EXTERNO' && (
                    <p>
                        Passo 1: Escolha o material <strong>Externo</strong>.
                    </p>
                )}
                {etapa === 'ESCOLHA_INTERNO' && (
                    <p>
                        Passo 2: Escolha o material <strong>Interno</strong>.
                    </p>
                )}
                {etapa === 'RESULTADO' && <p>Composição Final!</p>}
            </div>

            {/* ÁREA DE RESULTADO */}
            {etapa === 'RESULTADO' &&
                externoSelecionado &&
                internoSelecionado && (
                    <div className="comp-result-area">
                        <div className="comp-preview-box">
                            {/* 1. Fundo (Externo) */}
                            <img
                                src={externoSelecionado.imageUrl}
                                alt="Externo"
                                className="layer layer-back"
                            />

                            {/* 2. Frente (Interno) - Círculo Central */}
                            <div
                                className="layer layer-front"
                                style={{
                                    // Apenas o recorte, sem opacity ou mixBlendMode aqui
                                    clipPath: 'circle(35% at 50% 50%)',
                                    backgroundColor: 'white',
                                    zIndex: 2,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                <img
                                    src={internoSelecionado.imageUrl}
                                    alt="Interno"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        // Garanta que não tem opacidade aqui
                                    }}
                                />
                            </div>

                            {/* 3. Borda Branca Decorativa (Opcional, ajuda a destacar) */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '70%',
                                    height: '70%', // Corresponde a 35% de raio (70% diametro)
                                    borderRadius: '50%',
                                    // border: '1px solid black',
                                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)',
                                    zIndex: 3,
                                    pointerEvents: 'none',
                                }}
                            />
                        </div>

                        <div className="codigo-resultado">
                            <p>Externo: {externoSelecionado.code}</p>
                            <p>Interno: {internoSelecionado.code}</p>
                        </div>

                        <button onClick={resetar} className="comp-reset-btn">
                            <FaUndo /> Nova Combinação
                        </button>
                    </div>
                )}
            {/* LISTA DE EXTERNOS */}
            {etapa === 'ESCOLHA_EXTERNO' && (
                <div className="comp-grid">
                    {materiaisExternos.map((item) => (
                        <div
                            key={item.id}
                            className="comp-card"
                            onClick={() => handleSelectExterno(item)}
                        >
                            <img src={item.imageUrl} alt={item.code} />
                            <p>{item.code}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* LISTA DE INTERNOS (COM BUSCA) */}
            {etapa === 'ESCOLHA_INTERNO' && (
                <div className="comp-aplique-section">
                    <div className="comp-search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Pesquisar código..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>

                    <div className="comp-grid">
                        {materiaisInternos.map((item) => (
                            <div
                                key={item.id}
                                className="comp-card"
                                onClick={() => handleSelectInterno(item)}
                            >
                                <img src={item.imageUrl} alt={item.code} />
                                <p>{item.code}</p>
                            </div>
                        ))}
                    </div>
                    {materiaisInternos.length === 0 && (
                        <p>Nenhum material encontrado.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ComposicaoSinteticoPage;
