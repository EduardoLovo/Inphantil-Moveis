import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaPalette, FaCheckCircle } from "react-icons/fa";

// Importação dos Componentes SVG (Certifique-se de que os caminhos estão corretos)
import { NuvemSVG } from "../components/ProtetoresDePadereSVG/NuvemSVG";
import { MontanhaSVG } from "../components/ProtetoresDePadereSVG/MontanhaSVG";
import { OndaSVG } from "../components/ProtetoresDePadereSVG/OndaSVG";
import { PicoSVG } from "../components/ProtetoresDePadereSVG/PicoSVG";
import { EncaixeSVG } from "../components/ProtetoresDePadereSVG/EncaixeSVG";
import { CamaSVG } from "../components/ProtetoresDePadereSVG/CamaSVG";
import { TapeteSVG } from "../components/ProtetoresDePadereSVG/TapeteSVG";
import { MontanhaUmaParedeSVG } from "../components/ProtetoresDePadereSVG/MontanhaUmaParedeSVG";
import { NuvemUmaParedeSVG } from "../components/ProtetoresDePadereSVG/NuvemUmaParedeSVG";
import { OndaUmaParedeSVG } from "../components/ProtetoresDePadereSVG/OndaUmaParede";
import { useCartStore } from "../store/CartStore";
import { useProductStore } from "../store/ProductStore";

// =========================================================
// CONFIGURAÇÕES E DADOS DA PÁGINA
// =========================================================

const TABELA_TAMANHOS = [
  { id: "berco", nome: "Berço", preco: 100 },
  { id: "junior", nome: "Junior", preco: 200 },
  { id: "solteiro", nome: "Solteiro", preco: 300 },
  { id: "solteirao", nome: "Solteirão", preco: 400 },
  { id: "viuva", nome: "Viúva", preco: 500 },
  { id: "casal", nome: "Casal", preco: 600 },
  { id: "queen", nome: "Queen", preco: 700 },
  { id: "king", nome: "King", preco: 800 },
];

const DESENHO_OPTIONS = [
  { value: "nuvem", label: "Nuvem (Lado direito)" },
  { value: "nuvem-lado-esquerdo", label: "Nuvem (Lado esquerdo)" },
  { value: "nuvem-uma-parede", label: "Nuvem Uma Parede" },
  { value: "montanha", label: "Montanha (Lado direito)" },
  { value: "montanha-lado-esquerdo", label: "Montanha (Lado esquerdo)" },
  { value: "montanha-uma-parede", label: "Montanha Uma Parede" },
  { value: "onda", label: "Onda (Lado direito)" },
  { value: "onda-lado-esquerdo", label: "Onda (Lado esquerdo)" },
  { value: "onda-uma-parede", label: "Onda Uma Parede" },
  { value: "pico", label: "Pico (Lado direito)" },
  { value: "pico-lado-esquerdo", label: "Pico (Lado esquerdo)" },
  { value: "encaixe", label: "Encaixe" },
  { value: "cama", label: "Cama" },
  { value: "cama-lado-esquerdo", label: "Cama (Lado esquerdo)" },
  { value: "tapete", label: "Tapete" },
];

const listaDeCores = [
  { codigo: "am1", hex: "#ffd653" },
  { codigo: "am14", hex: "#f4e0ad" },
  { codigo: "am19", hex: "#eedc9c" },
  { codigo: "am21", hex: "#e6d3a6" },
  { codigo: "am24", hex: "#e7e0d1" },
  { codigo: "az1", hex: "#3b3d4b" },
  { codigo: "az3", hex: "#586c8a" },
  { codigo: "az5", hex: "#415997" },
  { codigo: "az6", hex: "#718db1" },
  { codigo: "az10", hex: "#9ebdd0" },
  { codigo: "az11", hex: "#c4ced6" },
  { codigo: "b3", hex: "#a49d90" },
  { codigo: "b6", hex: "#c4bcad" },
  { codigo: "b8", hex: "#dad6cb" },
  { codigo: "b10", hex: "#e1d7c6" },
  { codigo: "b19", hex: "#baaa95" },
  { codigo: "bc1", hex: "#ffffff" },
  { codigo: "bc6", hex: "#e9e9e7" },
  { codigo: "cz1", hex: "#505557" },
  { codigo: "cz3", hex: "#999a98" },
  { codigo: "cz6", hex: "#b4b7ba" },
  { codigo: "cz25n", hex: "#bfc6c9" },
  { codigo: "cz26n", hex: "#cbcbcb" },
  { codigo: "l2", hex: "#795999" },
  { codigo: "l3", hex: "#bca0cc" },
  { codigo: "l5", hex: "#c4aed0" },
  { codigo: "l11", hex: "#d4c7d9" },
  { codigo: "lj2", hex: "#d26a3e" },
  { codigo: "lj3", hex: "#f6ad99" },
  { codigo: "lj7", hex: "#ebc594" },
  { codigo: "lj11", hex: "#de948f" },
  { codigo: "lj21", hex: "#f8bf9a" },
  { codigo: "m3", hex: "#bc9d6e" },
  { codigo: "r1", hex: "#ce567e" },
  { codigo: "r12", hex: "#e0c7d2" },
  { codigo: "r16", hex: "#d4a299" },
  { codigo: "r17", hex: "#cda7a0" },
  { codigo: "r22", hex: "#efc5be" },
  { codigo: "r24", hex: "#e7b7cf" },
  { codigo: "r25", hex: "#ce9694" },
  { codigo: "r32", hex: "#decdbf" },
  { codigo: "r33", hex: "#ead2c6" },
  { codigo: "rb1", hex: "#e1b8b9" },
  { codigo: "rb2", hex: "#e9c8ca" },
  { codigo: "rb4", hex: "#eed7d9" },
  { codigo: "t1", hex: "#94dbe0" },
  { codigo: "t2", hex: "#00adad" },
  { codigo: "t12", hex: "#BDD6D9" },
  { codigo: "vd1", hex: "#817d6a" },
  { codigo: "vd6n", hex: "#808a73" },
  { codigo: "vd7n", hex: "#829e86" },
  { codigo: "vd16", hex: "#a7ceb9" },
  { codigo: "vd21", hex: "#a3bca6" },
  { codigo: "vd22", hex: "#a3ac9b" },
  { codigo: "vd23", hex: "#a8decc" },
  { codigo: "vd25", hex: "#bfcab4" },
  { codigo: "vd36", hex: "#a8d0bd" },
  { codigo: "vd39", hex: "#bdd5bc" },
  { codigo: "vm1", hex: "#7a393e" },
  { codigo: "vm3", hex: "#863339" },
  { codigo: "vm5", hex: "#cc333d" },
];

const mapDesenhoCores: Record<string, string[]> = {
  nuvem: ["cor1", "cor2"],
  "nuvem-lado-esquerdo": ["cor1", "cor2"],
  "nuvem-uma-parede": ["cor1", "cor2"],
  montanha: ["cor1", "cor2", "cor3"],
  "montanha-lado-esquerdo": ["cor1", "cor2", "cor3"],
  "montanha-uma-parede": ["cor1", "cor2", "cor3"],
  onda: ["cor1", "cor2"],
  "onda-lado-esquerdo": ["cor1", "cor2"],
  "onda-uma-parede": ["cor1", "cor2"],
  pico: ["cor1", "cor2", "cor3"],
  "pico-lado-esquerdo": ["cor1", "cor2", "cor3"],
  encaixe: ["cor1", "cor2"],
  cama: ["cor1", "cor2"],
  "cama-lado-esquerdo": ["cor1", "cor2"],
  tapete: Array.from({ length: 17 }, (_, i) => `cor${i + 1}`),
};

// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================

const ProtetorDeParedeProductPage = () => {
  const addItem = useCartStore((state) => state.addItem);
  const products = useProductStore((state) => state.products);
  const [tipoDoDesenho, setTipoDoDesenho] = useState("");
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState("");
  const [kitLed, setKitLed] = useState(false);

  const [selectedColor, setSelectedColor] = useState("#ccc");
  const [svgColors, setSvgColors] = useState<Record<string, string>>({});

  const tamanhoAtual = TABELA_TAMANHOS.find((t) => t.id === tamanhoSelecionado);
  const isPaintingMode = selectedColor !== "#ccc";

  // Reseta as cores se o usuário trocar o modelo de desenho
  const handleMudarDesenho = (novoDesenho: string) => {
    setTipoDoDesenho(novoDesenho);
    setSvgColors({});
  };

  const handleSVGClick = (e: React.MouseEvent<SVGElement>) => {
    const target = e.target as SVGElement;
    const id = target.id || target.parentElement?.id;

    if (id && id.startsWith("cor")) {
      setSvgColors((prev) => ({
        ...prev,
        [id]: selectedColor,
      }));
    }
  };

  const getColorName = (colorId: string) => {
    const hex = svgColors[colorId] || "#ccc";
    const corEncontrada = listaDeCores.find((c) => c.hex === hex);
    return corEncontrada ? corEncontrada.codigo.toUpperCase() : "";
  };

  // =========================================================
  // LÓGICA DO CARRINHO
  // =========================================================
  const handleAdicionarAoCarrinho = async () => {
    if (!tipoDoDesenho)
      return toast.error("Passo 1: Selecione um modelo de desenho.");
    if (!tamanhoSelecionado || !tamanhoAtual)
      return toast.error("Passo 2: Selecione um tamanho.");

    const partesNecessarias = mapDesenhoCores[tipoDoDesenho] || [];
    const coresEscolhidas: Record<string, string> = {};
    let faltouCor = false;

    partesNecessarias.forEach((id) => {
      const nomeCor = getColorName(id);
      if (!nomeCor) faltouCor = true;
      coresEscolhidas[id] = nomeCor;
    });

    if (faltouCor)
      return toast.error(
        "Passo 3: Pinte todas as partes do desenho antes de comprar.",
      );

    // ID FIXO do Produto Base no Banco (Sem variantes)
    const ID_VARIANTE_PROTETOR = 19160;

    // 👉 2. PROCURA O PRODUTO E A VARIANTE
    // Acha o produto "pai" que contém essa variante
    const produtoOriginal = products.find((p) =>
      p.variants?.some((v) => v.id === ID_VARIANTE_PROTETOR),
    );

    if (!produtoOriginal) {
      return toast.error("Erro: Produto base não encontrado no sistema.");
    }

    const varianteObrigatoria =
      produtoOriginal.variants && produtoOriginal.variants.length > 0
        ? produtoOriginal.variants[0]
        : undefined;

    const detalhesPersonalizacao = {
      modelo: tipoDoDesenho,
      tamanho: tamanhoAtual.nome, // Manda o nome (ex: "Solteirão") para o ERP Seven
      kitLed: kitLed ? "Sim" : "Não",
      cores: coresEscolhidas,
    };
    const precoFinal = tamanhoAtual.preco + (kitLed ? 50 : 0);
    const itemParaCarrinho = {
      ...produtoOriginal, // Copia a foto, ID, categoria, etc.
      price: precoFinal, // Sobrescreve o preço com o valor calculado do tamanho + LED
      selectedVariant: varianteObrigatoria,
      customData: detalhesPersonalizacao, // Salva as escolhas pro seu ERP/Backend
      // Cria um ID único virtual para o carrinho não misturar se o cliente comprar 2 protetores diferentes
      cartItemId: `custom_${ID_VARIANTE_PROTETOR}_${Date.now()}`,
    };

    try {
      addItem(itemParaCarrinho);
      console.log("Enviando para o carrinho:", itemParaCarrinho);
      // 🚨 AQUI VOCÊ CHAMA SUA FUNÇÃO REAL DO CARRINHO (ex: addItem(itemParaCarrinho))

      toast.success("Protetor adicionado ao carrinho com sucesso! 🎉", {
        duration: 4000,
      });
    } catch (error) {
      toast.error("Erro ao adicionar ao carrinho.");
    }
  };

  // =========================================================
  // RENDERIZAÇÃO DO SVG
  // =========================================================
  const renderDesenho = () => {
    const commonProps = { onClick: handleSVGClick, colors: svgColors };

    switch (tipoDoDesenho) {
      case "nuvem":
        return <NuvemSVG {...commonProps} lado="direito" />;
      case "nuvem-lado-esquerdo":
        return <NuvemSVG {...commonProps} lado="esquerdo" />;
      case "nuvem-uma-parede":
        return <NuvemUmaParedeSVG {...commonProps} lado="esquerdo" />;
      case "montanha":
        return <MontanhaSVG {...commonProps} lado="direito" />;
      case "montanha-lado-esquerdo":
        return <MontanhaSVG {...commonProps} lado="esquerdo" />;
      case "montanha-uma-parede":
        return <MontanhaUmaParedeSVG {...commonProps} lado="esquerdo" />;
      case "onda":
        return <OndaSVG {...commonProps} lado="direito" />;
      case "onda-lado-esquerdo":
        return <OndaSVG {...commonProps} lado="esquerdo" />;
      case "onda-uma-parede":
        return <OndaUmaParedeSVG {...commonProps} lado="esquerdo" />;
      case "pico":
        return <PicoSVG {...commonProps} lado="direito" />;
      case "pico-lado-esquerdo":
        return <PicoSVG {...commonProps} lado="esquerdo" />;
      case "encaixe":
        return <EncaixeSVG {...commonProps} lado="direito" />;
      case "cama":
        return <CamaSVG {...commonProps} lado="direito" />;
      case "cama-lado-esquerdo":
        return <CamaSVG {...commonProps} lado="esquerdo" />;
      case "tapete":
        return <TapeteSVG {...commonProps} lado="direito" />;
      default:
        return (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-xl">
            <FaPalette className="text-4xl mb-3 text-gray-300" />
            <p>Selecione um modelo no Passo 1 para começar</p>
          </div>
        );
    }
  };

  const renderNomesCores = () => {
    if (!tipoDoDesenho) return null;
    const ids = mapDesenhoCores[tipoDoDesenho] || [];
    return (
      <p className="pb-4 font-bold text-lg text-center w-full text-gray-700">
        Cores selecionadas:{" "}
        {ids.map((id) => getColorName(id) || "---").join(" | ")}
      </p>
    );
  };

  // =========================================================
  // LAYOUT DA PÁGINA
  // =========================================================
  return (
    <div className="text-black max-w-7xl mx-auto px-4 py-10 md:p-28">
      <Toaster />

      <header className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#313b2f]">
          Monte o seu Protetor de Parede
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Siga os passos abaixo para personalizar o protetor perfeito para o
          quarto do seu bebê.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LADO DIREITO/TOPO: Controles (Passo 1 e 2) */}
        <div className="w-full lg:w-5/12 flex flex-col gap-8 order-1 lg:order-2">
          {/* PASSO 1: MODELO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl mb-4 text-[#313b2f] flex items-center gap-2">
              <span className="bg-[#ffd639] text-[#313b2f] w-8 h-8 rounded-full flex items-center justify-center text-sm">
                1
              </span>
              Escolha o Modelo
            </h3>
            <select
              className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ffd639]"
              value={tipoDoDesenho}
              onChange={(e) => handleMudarDesenho(e.target.value)}
            >
              <option value="">Selecione um modelo da lista...</option>
              {DESENHO_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* PASSO 2: TAMANHO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl mb-4 text-[#313b2f] flex items-center gap-2">
              <span className="bg-[#ffd639] text-[#313b2f] w-8 h-8 rounded-full flex items-center justify-center text-sm">
                2
              </span>
              Escolha o Tamanho
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
              {TABELA_TAMANHOS.map((tam) => (
                <button
                  key={tam.id}
                  onClick={() => setTamanhoSelecionado(tam.id)}
                  className={`py-3 px-2 border rounded-xl font-bold text-sm transition-all ${
                    tamanhoSelecionado === tam.id
                      ? "bg-[#313b2f] text-white border-[#313b2f] shadow-md scale-105"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#313b2f] hover:bg-gray-50"
                  }`}
                >
                  {tam.nome}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LADO ESQUERDO: Pintura (Passo 3) */}
        <div className="w-full lg:w-7/12 order-2 lg:order-1">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 h-full">
            <h3 className="font-bold text-xl mb-6 text-[#313b2f] flex items-center gap-2">
              <span className="bg-[#ffd639] text-[#313b2f] w-8 h-8 rounded-full flex items-center justify-center text-sm">
                3
              </span>
              Escolha uma cor e pinte o desenho
            </h3>

            {/* Paleta de Cores */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-8 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
              {listaDeCores.map((cor) => (
                <button
                  key={cor.codigo}
                  type="button"
                  onClick={() => setSelectedColor(cor.hex)}
                  className={`
                    w-[50px] md:w-[60px] py-2 rounded-lg cursor-pointer transition-all duration-300 border-none
                    text-[#0c0c0c] text-[10px] md:text-xs font-bold
                    ${
                      selectedColor === cor.hex
                        ? "text-[#fcfcfc] shadow-[0_0_10px_rgba(50,50,50,0.84)] ring-2 ring-blue-500 scale-95"
                        : "shadow-sm hover:shadow-md hover:scale-105"
                    }
                  `}
                  style={{ backgroundColor: cor.hex }}
                  title={cor.codigo}
                >
                  {cor.codigo.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Área do Desenho SVG */}
            <div
              className={`w-full flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-200 ${isPaintingMode ? "cursor-pointer" : ""}`}
            >
              <div className="w-full max-w-2xl mb-4">{renderDesenho()}</div>
              {renderNomesCores()}
            </div>
          </div>
        </div>
      </div>

      {/* PARTE INFERIOR: LED e Fechamento (Passo 4 e Botão) */}
      <div className="mt-8 flex flex-col lg:flex-row gap-10">
        {/* PASSO 4: KIT LED */}
        <div className="w-full lg:w-7/12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="font-bold text-xl mb-4 text-[#313b2f] flex items-center gap-2">
            <span className="bg-[#ffd639] text-[#313b2f] w-8 h-8 rounded-full flex items-center justify-center text-sm">
              4
            </span>
            Deseja adicionar Kit LED?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setKitLed(true)}
              className={`flex-1 py-4 border rounded-xl font-bold transition-all text-lg flex justify-center items-center gap-2 ${
                kitLed === true
                  ? "bg-blue-50 text-blue-800 border-blue-500 ring-2 ring-blue-500"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {kitLed && <FaCheckCircle className="text-blue-500" />} Sim (+ R$
              50,00)
            </button>
            <button
              onClick={() => setKitLed(false)}
              className={`flex-1 py-4 border rounded-xl font-bold transition-all text-lg flex justify-center items-center gap-2 ${
                kitLed === false
                  ? "bg-gray-100 text-gray-800 border-gray-400 ring-2 ring-gray-400"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {!kitLed && <FaCheckCircle className="text-gray-500" />} Não
            </button>
          </div>
        </div>

        {/* RESUMO E BOTÃO DE COMPRAR */}
        <div className="w-full lg:w-5/12 bg-gray-50 p-8 rounded-3xl border border-gray-200 flex flex-col justify-center shadow-inner">
          <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-sm">
            Total a pagar
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-[#313b2f] mb-2">
            {tamanhoAtual
              ? `R$ ${(tamanhoAtual.preco + (kitLed ? 50 : 0)).toFixed(2).replace(".", ",")}`
              : "R$ 0,00"}
          </h2>
          <p className="text-sm text-gray-500 mb-6 h-6">
            {tamanhoAtual && `Tamanho ${tamanhoAtual.nome}`}
            {tamanhoAtual && kitLed && " + Kit LED"}
          </p>

          <button
            onClick={handleAdicionarAoCarrinho}
            className="w-full py-5 bg-[#313b2f] hover:bg-[#ffd639] hover:text-[#313b2f] text-white font-bold rounded-2xl text-xl transition-colors shadow-xl hover:shadow-2xl flex justify-center items-center gap-3"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtetorDeParedeProductPage;
