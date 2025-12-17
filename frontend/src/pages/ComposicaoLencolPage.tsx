import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { FaSearch, FaUndo, FaMagic } from 'react-icons/fa';
import type { VisualItem } from '../types/visual-item';
import './ComposicaoLencolPage.css';

const ComposicaoPage: React.FC = () => {
    // Estados de Dados
    const [apliques, setApliques] = useState<VisualItem[]>([]);
    const [tecidos, setTecidos] = useState<VisualItem[]>([]);

    // Estados de Seleção
    const [tecidoSelecionado, setTecidoSelecionado] = useState<string | null>(
        null
    );
    const [apliqueSelecionado, setApliqueSelecionado] = useState<string | null>(
        null
    );

    // Estados de Controle
    const [etapa, setEtapa] = useState<
        'ESCOLHA_TECIDO' | 'ESCOLHA_APLIQUE' | 'RESULTADO'
    >('ESCOLHA_TECIDO');
    const [busca, setBusca] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 1. Busca Dados Iniciais (Paralelo)
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Busca ambos ao mesmo tempo para ser mais rápido
                const [resTecidos, resApliques] = await Promise.all([
                    api.get('/visual-items', { params: { type: 'TECIDO' } }),
                    api.get('/visual-items', { params: { type: 'APLIQUE' } }),
                ]);

                setTecidos(resTecidos.data);
                setApliques(resApliques.data);
            } catch (err) {
                setError('Erro ao carregar catálogo. Verifique sua conexão.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // 2. Filtra e Ordena Apliques (Memoizado para performance)
    const apliquesFiltrados = useMemo(() => {
        const filtrados = apliques.filter(
            (item) =>
                item.code.toLowerCase().includes(busca.toLowerCase()) ||
                item.name.toLowerCase().includes(busca.toLowerCase())
        );
        // Ordena por código
        return filtrados.sort((a, b) => a.code.localeCompare(b.code));
    }, [apliques, busca]);

    // Ordena tecidos por nome/cor
    const tecidosOrdenados = useMemo(() => {
        return [...tecidos].sort((a, b) => a.name.localeCompare(b.name));
    }, [tecidos]);

    // 3. Handlers de Seleção
    const handleSelectTecido = (url: string) => {
        setTecidoSelecionado(url);
        setEtapa('ESCOLHA_APLIQUE');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSelectAplique = (url: string) => {
        setApliqueSelecionado(url);
        setEtapa('RESULTADO');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetar = () => {
        setTecidoSelecionado(null);
        setApliqueSelecionado(null);
        setEtapa('ESCOLHA_TECIDO');
        setBusca('');
    };

    // 4. Renderização Condicional
    if (loading)
        return (
            <div className="comp-loading">
                <h1>Carregando simulador...</h1>
            </div>
        );
    if (error)
        return (
            <div className="comp-error">
                <h1>{error}</h1>
            </div>
        );

    return (
        <div className="simulador-container">
            <h1 className="simulador-title">
                <FaMagic /> Simulador de Composições
            </h1>

            <div className="simulador-instructions">
                {etapa === 'ESCOLHA_TECIDO' && (
                    <p>
                        Passo 1: Escolha o <strong>Tecido</strong> de fundo.
                    </p>
                )}
                {etapa === 'ESCOLHA_APLIQUE' && (
                    <p>
                        Passo 2: Escolha o <strong>Aplique</strong> para
                        combinar.
                    </p>
                )}
                {etapa === 'RESULTADO' && (
                    <p>Resultado Final! Que tal essa combinação?</p>
                )}
                <small className="simulador-disclaimer">
                    Cores podem variar conforme a tela do dispositivo.
                </small>
            </div>

            {/* ÁREA DE RESULTADO */}
            {etapa === 'RESULTADO' &&
                tecidoSelecionado &&
                apliqueSelecionado && (
                    <div className="simulador-result-wrapper">
                        <div className="simulador-images-row">
                            {/* Imagem do Tecido */}
                            <img
                                src={tecidoSelecionado}
                                alt="Fundo"
                                className="simulador-result-img"
                                title="Tecido Selecionado"
                            />
                            {/* Imagem do Aplique */}
                            <img
                                src={apliqueSelecionado}
                                alt="Aplique"
                                className="simulador-result-img"
                                title="Aplique Selecionado"
                            />
                        </div>

                        <button
                            onClick={resetar}
                            className="simulador-btn-reset"
                        >
                            <FaUndo /> Criar Nova Composição
                        </button>
                    </div>
                )}

            {/* LISTA DE TECIDOS */}
            {etapa === 'ESCOLHA_TECIDO' && (
                <div className="simulador-grid-list">
                    {tecidosOrdenados.map((item) => (
                        <div
                            key={item.id}
                            className="simulador-item-card"
                            onClick={() => handleSelectTecido(item.imageUrl)}
                        >
                            <img src={item.imageUrl} alt={item.name} />
                            <p>{item.name}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* LISTA DE APLIQUES (COM BUSCA) */}
            {etapa === 'ESCOLHA_APLIQUE' && (
                <div className="simulador-aplique-section">
                    <div className="simulador-search-container">
                        <FaSearch className="simulador-search-icon" />
                        <input
                            type="text"
                            placeholder="Pesquisar código do aplique..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>

                    <div className="simulador-grid-list">
                        {apliquesFiltrados.map((item) => (
                            <div
                                key={item.id}
                                className="simulador-item-card"
                                onClick={() =>
                                    handleSelectAplique(item.imageUrl)
                                }
                            >
                                <img src={item.imageUrl} alt={item.code} />
                                <p>{item.code}</p>
                            </div>
                        ))}
                    </div>

                    {apliquesFiltrados.length === 0 && (
                        <p className="simulador-empty-msg">
                            Nenhum aplique encontrado.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ComposicaoPage;
