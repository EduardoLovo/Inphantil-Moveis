import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import './CalculadoraSobMedida.css'; // O CSS compartilhado
import { FaMoneyBillWave } from 'react-icons/fa'; // Ícone para finanças

// 1. Interface para os dados calculados
interface CalculatedPayment {
    valorEntrada: number;
    valorTotal: number;
    descontoEntrada: number;
    valorAPrazo: number;
}

const CalculadoraPagamento6040: React.FC = () => {
    // 2. Tipagem dos estados
    const [calculos, setCalculos] = useState<CalculatedPayment | null>(null);
    const [valorEntrada, setValorEntrada] = useState<string>('');
    const [valorTotal, setValorTotal] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Função para formatar os valores enquanto o usuário digita (mantendo a lógica de ,00)
    const formatarMedida = (valor: string): string => {
        // Remove tudo que não for número e a vírgula
        let rawValue = valor.replace(/[^\d,]/g, '').replace(',', '');
        if (rawValue === '') return '';

        // Converte para número e formata com vírgula para visualização
        let numericValue = (parseInt(rawValue, 10) / 100).toFixed(2);
        return numericValue.replace('.', ',');
    };

    // 3. Tipagem do evento de formulário
    const calcular = (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        setCalculos(null);

        // Converte para número usando ponto decimal (formato JS)
        const ve = parseFloat(valorEntrada.replace(',', '.'));
        const vt = parseFloat(valorTotal.replace(',', '.'));

        if (isNaN(ve) || isNaN(vt) || ve <= 0 || vt <= 0) {
            setError(
                'Erro: Por favor, digite valores válidos e maiores que zero.'
            );
            return;
        }

        if (ve >= vt) {
            setError(
                'Erro: O valor da entrada deve ser menor que o valor total.'
            );
            return;
        }

        // CÁLCULO: Dedução de 6% sobre a entrada (ve)
        const ve6 = ve * 0.06; // ve * (6 / 100)
        const result = vt - ve - ve6;

        // Armazena no estado
        setCalculos({
            valorEntrada: ve,
            valorTotal: vt,
            descontoEntrada: ve6,
            valorAPrazo: result,
        });
    };

    // Utilitário para formatar a saída de número (para R$ e vírgula)
    const formatarMoeda = (valor: number): string => {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    };

    // 4. Renderização do Resultado
    const renderizarResultado = () => {
        if (!calculos) return null;

        return (
            <div className="resultado-calculadora-card">
                <h3>Resultado da Simulação</h3>

                <div className="medida-item">
                    <label>Valor da entrada (60%): </label>
                    <p>{formatarMoeda(calculos.valorEntrada)}</p>
                </div>

                <div className="medida-item">
                    <label>Valor total (100%): </label>
                    <p>{formatarMoeda(calculos.valorTotal)}</p>
                </div>

                <div className="medida-item accessory-result">
                    <label>Dedução da Entrada (6%): </label>
                    <p>- {formatarMoeda(calculos.descontoEntrada)}</p>
                </div>

                <div className="medida-item final-result">
                    <label>Valor que resta a pagar a prazo:</label>
                    <p>{formatarMoeda(calculos.valorAPrazo)}</p>
                </div>
            </div>
        );
    };

    // 5. Estrutura de Retorno
    return (
        <div className="calculator-container">
            <div className="calculator-card">
                <h3>
                    <FaMoneyBillWave className="header-icon" /> Calculadora
                    Pagamento 60/40
                </h3>

                <div className="calculator-form-result-wrapper">
                    <form onSubmit={calcular} className="calculator-form">
                        <div className="form-group">
                            <label htmlFor="ve">Valor da entrada (R$)</label>
                            <input
                                type="text"
                                id="ve"
                                value={valorEntrada}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setValorEntrada(
                                        formatarMedida(e.target.value)
                                    )
                                }
                                placeholder="0,00"
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="vt">
                                Valor total (sem frete) (R$)
                            </label>
                            <input
                                type="text"
                                id="vt"
                                value={valorTotal}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setValorTotal(
                                        formatarMedida(e.target.value)
                                    )
                                }
                                placeholder="0,00"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-action">
                            <button type="submit" className="calculate-button">
                                Simular Pagamento
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

export default CalculadoraPagamento6040;
