import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import {
  FaBed,
  FaCalculator,
  FaRulerVertical,
  FaRulerHorizontal,
} from "react-icons/fa";

// 1. Interface para os dados calculados
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
    null,
  );
  const [larguraDigitada, setLarguraDigita] = useState<string>("");
  const [comprimentoDigitado, setComprimentoDigitado] = useState<string>("");
  const [alturaDigitada, setAlturaDigitada] = useState<string>("");
  const [acessorio, setAcessorio] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Função para formatar os valores (de cm para m, com vírgula)
  const formatarMedida = (valor: string): string => {
    const rawValue = valor.replace(/\D/g, "");
    if (rawValue === "") return "";
    const numericValue = (parseInt(rawValue, 10) / 100).toFixed(2);
    return numericValue.replace(".", ",");
  };

  const formatarSaida = (medida: number): string => {
    return medida.toFixed(2).replace(".", ",");
  };

  const calcular = (evento: FormEvent) => {
    evento.preventDefault();
    setError(null);
    setCalculos(null);

    const largura = parseFloat(larguraDigitada.replace(",", "."));
    const comprimento = parseFloat(comprimentoDigitado.replace(",", "."));
    const altura = parseFloat(alturaDigitada.replace(",", "."));

    if (
      isNaN(largura) ||
      isNaN(comprimento) ||
      isNaN(altura) ||
      largura <= 0 ||
      comprimento <= 0 ||
      altura <= 0
    ) {
      setError(
        "Erro: Digite medidas válidas (largura, comprimento e altura do colchão).",
      );
      return;
    }

    // --- LÓGICA DE CÁLCULO ---
    const larguraInterno = largura + 0.04;
    const comprimentoInterno = comprimento + 0.02;

    const larguraExterno = larguraInterno + 0.16;
    const comprimentoExterno = comprimentoInterno + 0.16;

    const diferenca = altura - 0.1;
    const alturaExterno = diferenca + 0.23;
    const alturaInterno = diferenca + 0.21;

    const larguraLencol = largura + (altura + 0.13) * 2;
    const comprimentoLencol = comprimento + (altura + 0.13) * 2;

    const larguraVirol = largura + 0.4;
    const comprimentoVirol = comprimento + 0.7;

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

    if (acessorio === "lençol") {
      novosCalculos.larguraLencol = larguraLencol;
      novosCalculos.comprimentoLencol = comprimentoLencol;
    } else if (acessorio === "virol") {
      novosCalculos.larguraVirol = larguraVirol;
      novosCalculos.comprimentoVirol = comprimentoVirol;
    }

    setCalculos(novosCalculos);
  };

  const renderizarResultado = () => {
    if (!calculos) return null;

    const alturaQuadradoLencol = calculos.alturaOriginal + 0.12;

    return (
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h3 className="text-lg font-bold text-[#313b2f] mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
          <FaBed className="text-[#ffd639]" /> Ficha Técnica
        </h3>

        <div className="space-y-3 text-sm md:text-base">
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <span className="text-gray-600 font-medium">
              Tamanho do Colchão:
            </span>
            <strong className="text-[#313b2f]">
              {formatarSaida(calculos.larguraOriginal)} x{" "}
              {formatarSaida(calculos.comprimentoOriginal)} x{" "}
              {formatarSaida(calculos.alturaOriginal)}
            </strong>
          </div>

          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <span className="text-gray-600 font-medium">
              Medida Externa da Cama:
            </span>
            <strong className="text-[#313b2f]">
              {formatarSaida(calculos.larguraExterno)} x{" "}
              {formatarSaida(calculos.comprimentoExterno)} x{" "}
              {formatarSaida(calculos.alturaExterno)}
            </strong>
          </div>

          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <span className="text-gray-600 font-medium">
              Medida Interna da Cama:
            </span>
            <strong className="text-[#313b2f]">
              {formatarSaida(calculos.larguraInterno)} x{" "}
              {formatarSaida(calculos.comprimentoInterno)} x{" "}
              {formatarSaida(calculos.alturaInterno)}
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
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-blue-800 font-medium">
                    Corte do Tecido (Lençol):
                  </span>
                  <strong className="text-blue-900">
                    {formatarSaida(calculos.larguraLencol!)} x{" "}
                    {formatarSaida(calculos.comprimentoLencol!)}
                  </strong>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-blue-800 font-medium">
                    Corte do Quadrado (Canto):
                  </span>
                  <strong className="text-blue-900">
                    {formatarSaida(alturaQuadradoLencol)} x{" "}
                    {formatarSaida(alturaQuadradoLencol)}
                  </strong>
                </div>
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
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header do Card */}
        <div className="bg-[#313b2f] p-6 md:p-8 text-center md:text-left flex flex-col md:flex-row items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl">
            <FaRulerVertical className="text-[#ffd639] text-3xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white ">
              Calculadora - Colchão Cliente
            </h1>
            <p className="text-gray-300 text-sm">
              Defina as medidas baseadas no colchão existente.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={calcular} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Largura - CORRIGIDO: Removido 'block', mantido 'flex' */}
              <div className="space-y-2">
                <label
                  htmlFor="largura"
                  className="text-sm font-bold text-[#313b2f] flex items-center gap-2"
                >
                  <FaRulerHorizontal className="text-gray-400" /> Largura
                  Colchão
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

              {/* Input Comprimento - CORRIGIDO: Removido 'block', mantido 'flex' */}
              <div className="space-y-2">
                <label
                  htmlFor="comprimento"
                  className="text-sm font-bold text-[#313b2f] flex items-center gap-2"
                >
                  <FaRulerVertical className="text-gray-400 rotate-90" />{" "}
                  Comprimento Colchão
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

              {/* Input Altura - CORRIGIDO: Removido 'block', mantido 'flex' */}
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="altura"
                  className="text-sm font-bold text-[#313b2f] flex items-center gap-2"
                >
                  <FaRulerVertical className="text-gray-400" /> Altura Colchão
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="altura"
                    value={alturaDigitada}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setAlturaDigitada(formatarMedida(e.target.value))
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

            {/* Select Acessório - CORRIGIDO: Removido 'block' */}
            <div className="space-y-2">
              <label
                htmlFor="acessorio"
                className="text-sm font-bold text-[#313b2f]"
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

export default CalculadoraSobMedidaColchao;
