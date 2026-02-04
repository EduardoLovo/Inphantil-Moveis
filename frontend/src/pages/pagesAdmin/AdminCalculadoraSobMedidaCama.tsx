import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { FaBed, FaCalculator, FaRulerCombined } from "react-icons/fa";

// 1. Interface para os dados calculados
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

const CalculadoraSobMedidaCama: React.FC = () => {
  // 3. Tipagem dos estados
  const [calculos, setCalculos] = useState<MedidasCalculadas | null>(null);
  const [larguraDigitada, setLarguraDigita] = useState<string>("");
  const [comprimentoDigitado, setComprimentoDigitado] = useState<string>("");
  const [acessorio, setAcessorio] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Função para formatar os valores (de cm para m, com vírgula)
  const formatarMedida = (valor: string): string => {
    const rawValue = valor.replace(/\D/g, "");
    if (rawValue === "") return "";
    const numericValue = (parseInt(rawValue, 10) / 100).toFixed(2);
    return numericValue.replace(".", ",");
  };

  // 4. Tipagem do evento de formulário
  const calcular = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setCalculos(null);

    const largura = parseFloat(larguraDigitada.replace(",", "."));
    const comprimento = parseFloat(comprimentoDigitado.replace(",", "."));

    if (
      isNaN(largura) ||
      isNaN(comprimento) ||
      largura <= 0 ||
      comprimento <= 0
    ) {
      setError("Erro: Digite medidas válidas e maiores que zero.");
      return;
    }

    // --- LÓGICA DE CÁLCULO ---
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

    if (acessorio === "lençol") {
      novosCalculos.larguraLencol = larguraColchao + 0.48;
      novosCalculos.comprimentoLencol = comprimentoColchao + 0.46;
    } else if (acessorio === "virol") {
      novosCalculos.larguraVirol = largura + 0.4;
      novosCalculos.comprimentoVirol = comprimento + 0.7;
    }

    setCalculos(novosCalculos);
  };

  const formatarSaida = (medida: number): string => {
    return medida.toFixed(2).replace(".", ",");
  };

  // 5. Função de Renderização do Resultado
  const renderizarResultado = () => {
    if (!calculos) return null;

    return (
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h3 className="text-lg font-bold text-[#313b2f] mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
          <FaRulerCombined className="text-[#ffd639]" /> Ficha Técnica
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <span className="text-gray-600 font-medium">Tamanho da Cama:</span>
            <strong className="text-[#313b2f]">
              {formatarSaida(calculos.larguraOriginal)} x{" "}
              {formatarSaida(calculos.comprimentoOriginal)}
            </strong>
          </div>

          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <span className="text-gray-600 font-medium">Medida Externa:</span>
            <strong className="text-[#313b2f]">
              {formatarSaida(calculos.larguraExterno)} x{" "}
              {formatarSaida(calculos.comprimentoExterno)}
            </strong>
          </div>

          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <span className="text-gray-600 font-medium">Medida Interna:</span>
            <strong className="text-[#313b2f]">
              {formatarSaida(calculos.larguraInterno)} x{" "}
              {formatarSaida(calculos.comprimentoInterno)}
            </strong>
          </div>

          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
            <span className="text-blue-800 font-bold">Medida Colchão:</span>
            <strong className="text-blue-900">
              {formatarSaida(calculos.larguraColchao)} x{" "}
              {formatarSaida(calculos.comprimentoColchao)}
            </strong>
          </div>
        </div>

        {/* Resultado dos Acessórios */}
        {calculos.acessorio && (
          <div className="mt-6 pt-4 border-t border-dashed border-gray-300">
            <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">
              Medidas do Acessório ({calculos.acessorio})
            </h4>

            {calculos.acessorio === "lençol" && (
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <span className="text-yellow-800 font-medium">
                  Corte do Lençol:
                </span>
                <strong className="text-yellow-900">
                  {formatarSaida(calculos.larguraLencol!)} x{" "}
                  {formatarSaida(calculos.comprimentoLencol!)}
                </strong>
              </div>
            )}

            {calculos.acessorio === "virol" && (
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <span className="text-yellow-800 font-medium">
                  Corte do Virol:
                </span>
                <strong className="text-yellow-900">
                  {formatarSaida(calculos.larguraVirol!)} x{" "}
                  {formatarSaida(calculos.comprimentoVirol!)}
                </strong>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header do Card */}
        <div className="bg-[#313b2f] p-6 md:p-8 text-center md:text-left flex flex-col md:flex-row items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl">
            <FaBed className="text-[#ffd639] text-3xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white ">
              Calculadora Sob Medida
            </h1>
            <p className="text-gray-300 text-sm">
              Defina as medidas da cama montessoriana.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={calcular} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Largura */}
              <div className="space-y-2">
                <label
                  htmlFor="largura"
                  className="block text-sm font-bold text-[#313b2f]"
                >
                  Largura (Cabeceira)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="largura"
                    value={larguraDigitada}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setLarguraDigita(formatarMedida(e.target.value))
                    }
                    placeholder="0,00"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-lg text-[#313b2f] placeholder-gray-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    m
                  </span>
                </div>
              </div>

              {/* Input Comprimento */}
              <div className="space-y-2">
                <label
                  htmlFor="comprimento"
                  className="block text-sm font-bold text-[#313b2f]"
                >
                  Comprimento (Lateral)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="comprimento"
                    value={comprimentoDigitado}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setComprimentoDigitado(formatarMedida(e.target.value))
                    }
                    placeholder="0,00"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-lg text-[#313b2f] placeholder-gray-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    m
                  </span>
                </div>
              </div>
            </div>

            {/* Select Acessório */}
            <div className="space-y-2">
              <label
                htmlFor="acessorio"
                className="block text-sm font-bold text-[#313b2f]"
              >
                Calcular Acessório (Opcional)
              </label>
              <select
                id="acessorio"
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setAcessorio(e.target.value)
                }
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all text-[#313b2f] cursor-pointer"
              >
                <option value="">Nenhum</option>
                <option value="lençol">Lençol</option>
                <option value="virol">Virol</option>
              </select>
            </div>

            {/* Botão Calcular */}
            <button
              type="submit"
              className="w-full py-4 bg-[#ffd639] text-[#313b2f] font-bold rounded-xl hover:bg-[#e6c235] hover:-translate-y-1 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
            >
              <FaCalculator /> Calcular Medidas
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

export default CalculadoraSobMedidaCama;
