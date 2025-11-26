import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import './CalculadoraSobMedida.css'; // Importa o CSS
import { FaBed, FaCalculator } from 'react-icons/fa'; // Ícone para o título (opcional)

// 1. Interface para os dados calculados (Melhor do que guardar JSX no estado)
interface MedidasCalculadas {
    larguraOriginal: number;
    comprimentoOriginal: number;
    larguraExterno: number;
    comprimentoExterno: number;
    larguraInterno: number;
    comprimentoInterno: number;
    larguraColchao: number;
    comprimentoColchao: number;
    larguraLencol?: number;
    comprimentoLencol?: number;
    larguraVirol?: number;
    comprimentoVirol?: number;
    acessorio: string;
}

// 2. Componente principal (tipado com React.FC)
const CalculadoraSobMedida: React.FC = () => {
    // 3. Tipagem dos estados
    const [calculos, setCalculos] = useState<MedidasCalculadas | null>(null);
    const [larguraDigitada, setLarguraDigita] = useState<string>('');
    const [comprimentoDigitado, setComprimentoDigitado] = useState<string>('');
    const [acessorio, setAcessorio] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Função para formatar os valores (de cm para m, com vírgula)
    const formatarMedida = (valor: string): string => {
        let rawValue = valor.replace(/\D/g, '');
        if (rawValue === '') return '';

        // Se tiver mais de 2 dígitos, formatamos com duas casas decimais
        if (rawValue.length > 2) {
            let numericValue = (parseInt(rawValue, 10) / 100).toFixed(2);
            return numericValue.replace('.', ',');
        }

        // Se tiver 1 ou 2 dígitos (ex: 50cm), apenas exibe o valor
        return rawValue;
    };

    // 4. Tipagem do evento de formulário
    const calcular = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setCalculos(null);

        // Converte para número usando ponto decimal
        const largura = parseFloat(larguraDigitada.replace(',', '.'));
        const comprimento = parseFloat(comprimentoDigitado.replace(',', '.'));

        if (
            isNaN(largura) ||
            isNaN(comprimento) ||
            largura <= 0 ||
            comprimento <= 0
        ) {
            setError('Erro: Digite medidas válidas e maiores que zero.');
            return;
        }

        // --- LÓGICA DE CÁLCULO (mantida) ---
        const larguraExterno = largura + 0.03;
        const comprimentoExterno = comprimento + 0.03;
        const larguraInterno = larguraExterno - 0.16;
        const comprimentoInterno = comprimentoExterno - 0.16;
        const larguraColchao = larguraInterno - 0.04;
        const comprimentoColchao = comprimentoInterno - 0.02;

        let novosCalculos: MedidasCalculadas = {
            larguraOriginal: largura,
            comprimentoOriginal: comprimento,
            larguraExterno,
            comprimentoExterno,
            larguraInterno,
            comprimentoInterno,
            larguraColchao,
            comprimentoColchao,
            acessorio,
        };

        if (acessorio === 'lençol') {
            novosCalculos.larguraLencol = larguraColchao + 0.48;
            novosCalculos.comprimentoLencol = comprimentoColchao + 0.46;
        } else if (acessorio === 'virol') {
            novosCalculos.larguraVirol = largura + 0.4;
            novosCalculos.comprimentoVirol = comprimento + 0.7;
        }

        setCalculos(novosCalculos);
    };

    // Utilitário para formatar a saída de número (para duas casas e vírgula)
    const formatarSaida = (medida: number): string => {
        return medida.toFixed(2).replace('.', ',');
    };

    // 5. Função de Renderização do Resultado (Separação de responsabilidade)
    const renderizarResultado = () => {
        if (!calculos) return null;

        return (
            <div className="resultado-calculadora-card">
                <h3>Resultado da Medida</h3>

                <div className="medida-item">
                    <label>Tamanho da cama:</label>
                    <p>
                        {formatarSaida(calculos.larguraOriginal)} x{' '}
                        {formatarSaida(calculos.comprimentoOriginal)}
                    </p>
                </div>

                <div className="medida-item">
                    <label>Externo: </label>
                    <p>
                        {formatarSaida(calculos.larguraExterno)} x{' '}
                        {formatarSaida(calculos.comprimentoExterno)}
                    </p>
                </div>

                <div className="medida-item">
                    <label>Interno: </label>
                    <p>
                        {formatarSaida(calculos.larguraInterno)} x{' '}
                        {formatarSaida(calculos.comprimentoInterno)}
                    </p>
                </div>

                <div className="medida-item">
                    <label>Colchão: </label>
                    <p>
                        {formatarSaida(calculos.larguraColchao)} x{' '}
                        {formatarSaida(calculos.comprimentoColchao)}
                    </p>
                </div>

                {/* Resultado dos Acessórios */}
                {calculos.acessorio === 'lençol' && (
                    <div className="medida-item accessory-result">
                        <label>Lençol: </label>
                        <p>
                            {formatarSaida(calculos.larguraLencol!)} x{' '}
                            {formatarSaida(calculos.comprimentoLencol!)}
                        </p>
                        <label> Quadrado: </label>
                        <p>Padrão</p>
                    </div>
                )}

                {calculos.acessorio === 'virol' && (
                    <div className="medida-item accessory-result">
                        <label>Virol:</label>
                        <p>
                            {formatarSaida(calculos.larguraVirol!)} x{' '}
                            {formatarSaida(calculos.comprimentoVirol!)}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    // 6. Estrutura de Retorno
    return (
        <div className="calculator-container">
            <div className="calculator-card">
                <h3>
                    <FaBed className="header-icon" /> Sob Medida - Cama
                    Montessoriana
                </h3>
                <div className="calculator-form-result-wrapper">
                    <form onSubmit={calcular} className="calculator-form">
                        <div className="form-group">
                            <label htmlFor="largura">
                                Largura (Cabeceira):
                            </label>
                            <input
                                type="text"
                                id="largura"
                                value={larguraDigitada}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setLarguraDigita(
                                        formatarMedida(e.target.value)
                                    )
                                }
                                placeholder="0,00 m"
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="comprimento">
                                Comprimento (Lateral):
                            </label>
                            <input
                                type="text"
                                id="comprimento"
                                value={comprimentoDigitado}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setComprimentoDigitado(
                                        formatarMedida(e.target.value)
                                    )
                                }
                                placeholder="0,00 m"
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="acessorio">Acessório:</label>
                            <select
                                id="acessorio"
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    setAcessorio(e.target.value)
                                }
                                className="form-select"
                            >
                                <option value="">Nenhum</option>
                                <option value="lençol">Lençol</option>
                                <option value="virol">Virol</option>
                            </select>
                        </div>
                        <div className="form-action">
                            <button type="submit" className="calculate-button">
                                Calcular Medidas
                            </button>
                        </div>
                    </form>

                    {error && (
                        <section className="error-message-box">{error}</section>
                    )}
                    {renderizarResultado()}
                </div>
            </div>
        </div>
    );
};

export default CalculadoraSobMedida;
