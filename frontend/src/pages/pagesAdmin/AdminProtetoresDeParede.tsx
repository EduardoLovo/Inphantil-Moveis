import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import toast, { Toaster } from "react-hot-toast";

// Importação dos Componentes SVG
import { NuvemSVG } from "../../components/ProtetoresDePadereSVG/NuvemSVG";
import { MontanhaSVG } from "../../components/ProtetoresDePadereSVG/MontanhaSVG";
import { OndaSVG } from "../../components/ProtetoresDePadereSVG/OndaSVG";
import { PicoSVG } from "../../components/ProtetoresDePadereSVG/PicoSVG";
import { EncaixeSVG } from "../../components/ProtetoresDePadereSVG/EncaixeSVG";
import { CamaSVG } from "../../components/ProtetoresDePadereSVG/CamaSVG";
import { TapeteSVG } from "../../components/ProtetoresDePadereSVG/TapeteSVG";
import { MontanhaUmaParedeSVG } from "../../components/ProtetoresDePadereSVG/MontanhaUmaParedeSVG";
import { NuvemUmaParedeSVG } from "../../components/ProtetoresDePadereSVG/NuvemUmaParedeSVG";
import { OndaUmaParedeSVG } from "../../components/ProtetoresDePadereSVG/OndaUmaParede";
import { FaPalette } from "react-icons/fa";

// Definição dos tipos
interface Cor {
  codigo: string;
  hex: string;
}

// Lista de Cores
const listaDeCores: Cor[] = [
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

// Configuração das Opções de Desenho para limpar o JSX
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

const AdminProtetoresDeParedePage = () => {
  const [selectedColor, setSelectedColor] = useState("#ccc");
  const [svgColors, setSvgColors] = useState<Record<string, string>>({});
  const [tipoDoDesenho, setTipoDoDesenho] = useState("");
  const divRef = useRef<HTMLDivElement>(null);

  const isPaintingMode = selectedColor !== "#ccc";

  const handleSVGClick = (e: React.MouseEvent<SVGElement>) => {
    const target = e.target as SVGElement;
    // Tenta pegar o ID do target ou do pai mais próximo caso o clique seja em um path interno
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

  const copiarPrint = async () => {
    const el = divRef.current;
    if (!el) return;

    try {
      const canvas = await html2canvas(el);
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          toast.success("Print copiado para a área de transferência!", {
            position: "bottom-right",
            style: {
              background: "#333",
              color: "#fff",
            },
          });
        }
      });
    } catch (err) {
      console.error("Erro ao copiar:", err);
      toast.error("Erro ao gerar print");
    }
  };

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
          <div className="h-64 flex items-center justify-center text-gray-400">
            Selecione um desenho abaixo
          </div>
        );
    }
  };

  const renderNomesCores = () => {
    if (!tipoDoDesenho) return null;

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
      tapete: Array.from({ length: 17 }, (_, i) => `cor${i + 1}`),
    };

    const ids = mapDesenhoCores[tipoDoDesenho] || [];

    return (
      <p className="pb-8 font-bold text-2xl text-center w-full">
        {ids
          .map((id) => getColorName(id))
          .filter(Boolean)
          .join(" - ")}
      </p>
    );
  };

  return (
    <div className=" text-black text-center md:text-left min-h-screen px-4 pb-20">
      <Toaster />
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#313b2f]">
            <FaPalette className="text-[#ffd639]" /> Composição de Protetores de
            Parede
          </h1>
          <p className="text-gray-500 mt-1 ml-1">
            Faça simulações de cores para os protetores de parede
          </p>
        </div>
      </header>

      <h1 className="py-4 px-2 text-xl md:text-2xl font-bold text-center text-gray-800">
        Escolha uma cor e clique na imagem para aplicar
      </h1>

      {/* Grid de Botões de Cores */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-8">
        {listaDeCores.map((cor) => (
          <button
            key={cor.codigo}
            type="button"
            onClick={() => setSelectedColor(cor.hex)}
            className={`
                            w-[60px] md:w-[70px] py-2.5 rounded-lg cursor-pointer transition-all duration-300 border-none
                            text-[#0c0c0c] text-xs font-bold
                            ${
                              selectedColor === cor.hex
                                ? "text-[#747474] shadow-none ring-2 ring-gray-400 scale-95"
                                : "shadow-[0_0_10px_rgba(0,0,0,0.44)] hover:shadow-none hover:scale-105"
                            }
                        `}
            style={{ backgroundColor: cor.hex }}
            title={cor.codigo}
          >
            {cor.codigo.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Área do Desenho */}
      <div
        ref={divRef}
        className={`
                    w-full flex flex-col items-center justify-center p-4 bg-white rounded-xl mb-6
                    ${isPaintingMode ? 'cursor-[url("/images/cursor.png")_0_24,crosshair]' : ""}
                `}
      >
        <div
          className={`w-full max-w-4xl ${isPaintingMode ? '[&_svg]:cursor-[url("/images/cursor.png")_0_24,crosshair]' : ""}`}
        >
          {renderDesenho()}
        </div>

        <div className="w-full flex justify-center mt-4">
          {renderNomesCores()}
        </div>
      </div>

      {/* Botão de Print */}
      <div className="flex justify-center mb-10">
        <button
          className="px-6 py-3 bg-[#bbb8b8] text-gray-800 font-bold rounded-lg shadow-md hover:bg-[#a8a5a5] transition-colors flex items-center gap-2"
          onClick={copiarPrint}
        >
          📸 Tirar print e copiar
        </button>
      </div>

      {/* Opções de Desenhos (Radio Buttons) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 p-4 md:p-5 text-xs md:text-base bg-gray-50 rounded-xl border border-gray-200">
        {DESENHO_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`
                            flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
                            ${tipoDoDesenho === option.value ? "bg-blue-100 text-blue-800 font-semibold" : "hover:bg-gray-200"}
                        `}
          >
            <input
              type="radio"
              name="desenho"
              value={option.value}
              checked={tipoDoDesenho === option.value}
              onChange={(e) => setTipoDoDesenho(e.target.value)}
              className="accent-blue-600"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default AdminProtetoresDeParedePage;
