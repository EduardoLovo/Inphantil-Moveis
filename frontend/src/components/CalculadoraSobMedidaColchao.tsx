import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import './CalculadoraSobMedida.css';
import { FaBed } from 'react-icons/fa'; // Ícone para o título

// 1. Interface para os dados calculados (Melhoria de código)
interface MedidasColchaoCalculadas {
    larguraOriginal: number;
    comprimentoOriginal: number;
    alturaOriginal: number;
    larguraExterno: number;
    comprimentoExterno: number;
    alturaExterno: number;
    larguraInterno: number;
    comprimentoInterno: number;
    alturaInterno: number;
    larguraLencol?: number;
    comprimentoLencol?: number;
    larguraVirol?: number;
    comprimentoVirol?: number;
    acessorio: string;
}

const CalculadoraSobMedidaColchao: React.FC = () => {
    // 2. Tipagem dos estados
    const [calculos, setCalculos] = useState<MedidasColchaoCalculadas | null>(
        null
    );
    const [larguraDigitada, setLarguraDigita] = useState<string>('');
    const [comprimentoDigitado, setComprimentoDigitado] = useState<string>('');
    const [alturaDigitada, setAlturaDigitada] = useState<string>('');
    const [acessorio, setAcessorio] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Função para formatar os valores (de cm para m, com vírgula)
    const formatarMedida = (valor: string): string => {
        // Remove tudo que não for dígito (0-9)
        const rawValue = valor.replace(/\D/g, '');

        if (rawValue === '') return '';

        // Sempre divide por 100 para criar o efeito de centavos/decimais
        // Ex: "1" -> 0.01 -> "0,01"
        // Ex: "188" -> 1.88 -> "1,88"
        const numericValue = (parseInt(rawValue, 10) / 100).toFixed(2);
        return numericValue.replace('.', ',');
    };

    // Utilitário para formatar a saída de número (para duas casas e vírgula)
    const formatarSaida = (medida: number): string => {
        return medida.toFixed(2).replace('.', ',');
    };

    // 3. Tipagem do evento de formulário
    const calcular = (evento: FormEvent) => {
        evento.preventDefault();
        setError(null);
        setCalculos(null);

        // Converte para número usando ponto decimal
        const largura = parseFloat(larguraDigitada.replace(',', '.'));
        const comprimento = parseFloat(comprimentoDigitado.replace(',', '.'));
        const altura = parseFloat(alturaDigitada.replace(',', '.'));

        if (
            isNaN(largura) ||
            isNaN(comprimento) ||
            isNaN(altura) ||
            largura <= 0 ||
            comprimento <= 0 ||
            altura <= 0
        ) {
            setError(
                'Erro: Digite medidas válidas (largura, comprimento e altura do colchão).'
            );
            return;
        }

        // --- LÓGICA DE CÁLCULO (mantida) ---
        // Interno
        const larguraInterno = largura + 0.04;
        const comprimentoInterno = comprimento + 0.02;

        // Externo
        const larguraExterno = larguraInterno + 0.16;
        const comprimentoExterno = comprimentoInterno + 0.16;

        // Altura
        const diferenca = altura - 0.1;
        const alturaExterno = diferenca + 0.23;
        const alturaInterno = diferenca + 0.21;

        // Acessorio lençol
        const larguraLencol = largura + (altura + 0.13) * 2;
        const comprimentoLencol = comprimento + (altura + 0.13) * 2;

        // Acessorio virol
        const larguraVirol = largura + 0.4;
        const comprimentoVirol = comprimento + 0.7;

        // Armazena no estado
        let novosCalculos: MedidasColchaoCalculadas = {
            larguraOriginal: largura,
            comprimentoOriginal: comprimento,
            alturaOriginal: altura,
            larguraExterno,
            comprimentoExterno,
            alturaExterno,
            larguraInterno,
            comprimentoInterno,
            alturaInterno,
            acessorio,
        };

        if (acessorio === 'lençol') {
            novosCalculos.larguraLencol = larguraLencol;
            novosCalculos.comprimentoLencol = comprimentoLencol;
        } else if (acessorio === 'virol') {
            novosCalculos.larguraVirol = larguraVirol;
            novosCalculos.comprimentoVirol = comprimentoVirol;
        }

        setCalculos(novosCalculos);
    };

    // 4. Renderização do Resultado
    const renderizarResultado = () => {
        if (!calculos) return null;

        const alturaQuadradoLencol = calculos.alturaOriginal + 0.12;

        return (
            <div className="resultado-calculadora-card">
                <h3>Resultado da Medida</h3>

                <div className="medida-item">
                    <label>Tamanho do colchão:</label>
                    <p>
                        {formatarSaida(calculos.larguraOriginal)} x{' '}
                        {formatarSaida(calculos.comprimentoOriginal)} x{' '}
                        {formatarSaida(calculos.alturaOriginal)}
                    </p>
                </div>

                <div className="medida-item">
                    <label>Externo: </label>
                    <p>
                        {formatarSaida(calculos.larguraExterno)} x{' '}
                        {formatarSaida(calculos.comprimentoExterno)} x{' '}
                        {formatarSaida(calculos.alturaExterno)}
                    </p>
                </div>

                <div className="medida-item">
                    <label>Interno: </label>
                    <p>
                        {formatarSaida(calculos.larguraInterno)} x{' '}
                        {formatarSaida(calculos.comprimentoInterno)} x{' '}
                        {formatarSaida(calculos.alturaInterno)}
                    </p>
                </div>

                {/* Resultado dos Acessórios */}
                {calculos.acessorio === 'lençol' && (
                    <div className="medida-item accessory-result">
                        <label>Lençol (Tecido Total): </label>
                        <p>
                            {formatarSaida(calculos.larguraLencol!)} x{' '}
                            {formatarSaida(calculos.comprimentoLencol!)}
                        </p>
                        <label> Quadrado do Lençol: </label>
                        <p>
                            {formatarSaida(alturaQuadradoLencol)} x{' '}
                            {formatarSaida(alturaQuadradoLencol)}
                        </p>
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

    // 5. Estrutura de Retorno
    return (
        <div className="calculator-container">
            <div className="calculator-card">
                <h3>
                    <FaBed className="header-icon" /> Sob Medida - Colchão do
                    Cliente
                </h3>
                <div className="calculator-form-result-wrapper">
                    <form onSubmit={calcular} className="calculator-form">
                        <div className="form-group">
                            <label htmlFor="largura">Largura do Colchão:</label>
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
                                Comprimento do Colchão:
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
                            <label htmlFor="altura">Altura do Colchão:</label>
                            <input
                                type="text"
                                id="altura"
                                value={alturaDigitada}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setAlturaDigitada(
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

export default CalculadoraSobMedidaColchao;
