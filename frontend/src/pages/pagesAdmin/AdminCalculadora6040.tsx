import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { FaMoneyBillWave, FaCalculator, FaArrowRight } from "react-icons/fa";

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
  const [valorEntrada, setValorEntrada] = useState<string>("");
  const [valorTotal, setValorTotal] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Função para formatar os valores enquanto o usuário digita (mantendo a lógica de ,00)
  const formatarMedida = (valor: string): string => {
    let rawValue = valor.replace(/[^\d,]/g, "").replace(",", "");
    if (rawValue === "") return "";
    let numericValue = (parseInt(rawValue, 10) / 100).toFixed(2);
    return numericValue.replace(".", ",");
  };

  const calcular = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setCalculos(null);

    const ve = parseFloat(valorEntrada.replace(",", "."));
    const vt = parseFloat(valorTotal.replace(",", "."));

    if (isNaN(ve) || isNaN(vt) || ve <= 0 || vt <= 0) {
      setError("Por favor, digite valores válidos e maiores que zero.");
      return;
    }

    if (ve >= vt) {
      setError("O valor da entrada deve ser menor que o valor total.");
      return;
    }

    // CÁLCULO: Dedução de 6% sobre a entrada (ve)
    const ve6 = ve * 0.06;
    const result = vt - ve - ve6;

    setCalculos({
      valorEntrada: ve,
      valorTotal: vt,
      descontoEntrada: ve6,
      valorAPrazo: result,
    });
  };

  const formatarMoeda = (valor: number): string => {
    return `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // 4. Renderização do Resultado
  const renderizarResultado = () => {
    if (!calculos) return null;

    return (
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h3 className="text-lg font-bold text-[#313b2f] mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
          <FaArrowRight className="text-[#ffd639]" /> Resultado da Simulação
        </h3>

        <div className="space-y-3 text-sm md:text-base">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Valor Total (100%):</span>
            <span className="font-bold text-gray-800">
              {formatarMoeda(calculos.valorTotal)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Valor da Entrada (Pago):</span>
            <span className="font-bold text-blue-600">
              {formatarMoeda(calculos.valorEntrada)}
            </span>
          </div>

          <div className="flex justify-between items-center text-red-500 bg-red-50 p-2 rounded-lg">
            <span>Dedução da Entrada (6%):</span>
            <span className="font-bold">
              - {formatarMoeda(calculos.descontoEntrada)}
            </span>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-3 mt-2">
            <div className="flex justify-between items-center text-lg md:text-xl">
              <span className="font-bold text-[#313b2f]">Resta a Pagar:</span>
              <span className="font-bold text-green-600">
                {formatarMoeda(calculos.valorAPrazo)}
              </span>
            </div>
            <p className="text-xs text-gray-400 text-right mt-1">
              Valor a ser parcelado ou pago na entrega.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header do Card */}
        <div className="bg-[#313b2f] p-6 md:p-8 text-center md:text-left flex flex-col md:flex-row items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl">
            <FaMoneyBillWave className="text-[#ffd639] text-3xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white ">
              Calculadora 60/40
            </h1>
            <p className="text-gray-300 text-sm">
              Simule o saldo restante após a entrada com dedução.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={calcular} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Valor Entrada */}
              <div className="space-y-2">
                <label
                  htmlFor="ve"
                  className="block text-sm font-bold text-[#313b2f]"
                >
                  Valor da Entrada (R$)
                </label>
                <input
                  type="text"
                  id="ve"
                  value={valorEntrada}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setValorEntrada(formatarMedida(e.target.value))
                  }
                  placeholder="0,00"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-lg text-[#313b2f] placeholder-gray-400"
                />
              </div>

              {/* Input Valor Total */}
              <div className="space-y-2">
                <label
                  htmlFor="vt"
                  className="block text-sm font-bold text-[#313b2f]"
                >
                  Valor Total (sem frete)
                </label>
                <input
                  type="text"
                  id="vt"
                  value={valorTotal}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setValorTotal(formatarMedida(e.target.value))
                  }
                  placeholder="0,00"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-lg text-[#313b2f] placeholder-gray-400"
                />
              </div>
            </div>

            {/* Botão Calcular */}
            <button
              type="submit"
              className="w-full py-4 bg-[#ffd639] text-[#313b2f] font-bold rounded-xl hover:bg-[#e6c235] hover:-translate-y-1 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
            >
              <FaCalculator /> Simular Pagamento
            </button>
          </form>

          {/* Mensagem de Erro */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg animate-pulse">
              <p className="font-bold">Atenção:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Resultado */}
          {renderizarResultado()}
        </div>
      </div>
    </div>
  );
};

export default CalculadoraPagamento6040;
