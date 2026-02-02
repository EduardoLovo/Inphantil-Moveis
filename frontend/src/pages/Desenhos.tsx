import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import "./Desenhos.css";

import { NuvemSVG } from "../components/Desenhos/NuvemSVG";
import { MontanhaSVG } from "../components/Desenhos/MontanhaSVG";
import { OndaSVG } from "../components/Desenhos/OndaSVG";
import { PicoSVG } from "../components/Desenhos/PicoSVG";
import { EncaixeSVG } from "../components/Desenhos/EncaixeSVG";
import { CamaSVG } from "../components/Desenhos/CamaSVG";
import { TapeteSVG } from "../components/Desenhos/TapeteSVG";
import toast, { Toaster } from "react-hot-toast";
import { MontanhaUmaParedeSVG } from "../components/Desenhos/MontanhaUmaParedeSVG";
import { NuvemUmaParedeSVG } from "../components/Desenhos/NuvemUmaParedeSVG";
import { OndaUmaParedeSVG } from "../components/Desenhos/OndaUmaParede";

// Definição dos tipos
interface Cor {
  codigo: string;
  hex: string;
}

// Movemos a lista para fora do componente para não recriar a cada render
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

export const Desenhos = () => {
  const [selectedColor, setSelectedColor] = useState("#ccc");

  // ESTADO ÚNICO: Guarda todas as cores aplicadas por ID (cor1, cor2, etc.)
  const [svgColors, setSvgColors] = useState<Record<string, string>>({});

  const [tipoDoDesenho, setTipoDoDesenho] = useState("");
  const divRef = useRef<HTMLDivElement>(null);
  const isPaintingMode = selectedColor !== "#ccc";
  // Lógica simplificada: Pega o ID do elemento clicado e aplica a cor selecionada
  const handleSVGClick = (e: React.MouseEvent<SVGElement>) => {
    const target = e.target as SVGElement;
    const id = target.id; // Ex: 'cor1', 'cor2'

    if (id && id.startsWith("cor")) {
      setSvgColors((prev) => ({
        ...prev,
        [id]: selectedColor,
      }));
    }
  };

  // Helper para pegar o nome da cor baseado no ID (para exibir no resultado)
  const getColorName = (colorId: string) => {
    const hex = svgColors[colorId] || "#ccc";
    const corEncontrada = listaDeCores.find((c) => c.hex === hex);
    return corEncontrada ? corEncontrada.codigo.toUpperCase() : "";
  };

  const copiarPrint = async () => {
    toast.success("Print ok", {
      position: "bottom-right",
      style: {
        background: "#838383ff",
        color: "#fff",
      },
    });
    const el = divRef.current;
    if (!el) return;

    try {
      const canvas = await html2canvas(el);
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
        }
      });
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  // Função auxiliar para renderizar o desenho selecionado
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
        return null;
    }
  };

  // Função auxiliar para renderizar os nomes das cores
  const renderNomesCores = () => {
    if (!tipoDoDesenho) return null;

    // Define quais IDs de cor cada desenho usa
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
      tapete: [
        "cor1",
        "cor2",
        "cor3",
        "cor4",
        "cor5",
        "cor6",
        "cor7",
        "cor8",
        "cor9",
        "cor10",
        "cor11",
        "cor12",
        "cor13",
        "cor14",
        "cor15",
        "cor16",
        "cor17",
      ],
    };

    const ids = mapDesenhoCores[tipoDoDesenho] || [];

    return (
      <p>
        {ids
          .map((id) => getColorName(id))
          .filter(Boolean)
          .join(" - ")}
      </p>
    );
  };

  return (
    <div
      className={`contentDesenhos ${isPaintingMode ? "painting-active" : ""}`}
    >
      <Toaster />

      <h1>Escolha uma cor e clique na imagem para aplicar</h1>

      <div className="botoesCoresDesenho">
        {listaDeCores.map((cor) => (
          <button
            key={cor.codigo}
            type="button"
            onClick={() => setSelectedColor(cor.hex)}
            className={`
                            ${
                              selectedColor === cor.hex
                                ? "selected"
                                : cor.codigo
                            } 
                            cursor-pincel 
                        `}
            style={{ backgroundColor: cor.hex }} // Dica: já mostra a cor no botão
            title={cor.codigo}
          >
            {cor.codigo.toUpperCase()}
          </button>
        ))}
      </div>

      <div
        ref={divRef}
        className={`area-desenho ${isPaintingMode ? "cursor-pincel" : ""}`}
      >
        {renderDesenho()}

        <div className="resultadoNomeDasCores">{renderNomesCores()}</div>
      </div>

      <button className="btnPrint" onClick={copiarPrint}>
        📸 Tirar print e copiar
      </button>

      <div className="opcoesRadio">
        {/* Dica: Você pode gerar isso com um .map também para limpar o código */}
        <label>
          <input
            type="radio"
            name="desenho"
            value="nuvem"
            checked={tipoDoDesenho === "nuvem"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Nuvem (Lado direito)
        </label>

        <label>
          <input
            type="radio"
            name="desenho"
            value="nuvem-lado-esquerdo"
            checked={tipoDoDesenho === "nuvem-lado-esquerdo"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Nuvem (Lado esquerdo)
        </label>
        <label>
          <input
            type="radio"
            name="desenho"
            value="nuvem-uma-parede"
            checked={tipoDoDesenho === "nuvem-uma-parede"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Nuvem Uma Parede
        </label>

        <label>
          <input
            type="radio"
            name="desenho"
            value="montanha"
            checked={tipoDoDesenho === "montanha"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Montanha (Lado direito)
        </label>

        <label>
          <input
            type="radio"
            name="desenho"
            value="montanha-lado-esquerdo"
            checked={tipoDoDesenho === "montanha-lado-esquerdo"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Montanha (Lado esquerdo)
        </label>
        <label>
          <input
            type="radio"
            name="desenho"
            value="montanha-uma-parede"
            checked={tipoDoDesenho === "montanha-uma-parede"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Montanha Uma Parede
        </label>
        <label>
          <input
            type="radio"
            name="desenho"
            value="onda"
            checked={tipoDoDesenho === "onda"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Onda (Lado direito)
        </label>
        <label>
          <input
            type="radio"
            name="desenho"
            value="onda-lado-esquerdo"
            checked={tipoDoDesenho === "onda-lado-esquerdo"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Onda (Lado esquerdo)
        </label>
        <label>
          <input
            type="radio"
            name="desenho"
            value="onda-uma-parede"
            checked={tipoDoDesenho === "onda-uma-parede"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Onda Uma Parede
        </label>
        <label>
          <input
            type="radio"
            name="desenho"
            value="pico"
            checked={tipoDoDesenho === "pico"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Pico (Lado direito)
        </label>
        <label>
          <input
            type="radio"
            name="desenho"
            value="pico-lado-esquerdo"
            checked={tipoDoDesenho === "pico-lado-esquerdo"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Pico (Lado esquerdo)
        </label>
        <label>
          <input
            type="radio"
            name="desenho"
            value="encaixe"
            checked={tipoDoDesenho === "encaixe"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Encaixe
        </label>
        <label>
          <input
            type="radio"
            name="desenho"
            value="cama"
            checked={tipoDoDesenho === "cama"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Cama
        </label>
        <label>
          <input
            type="radio"
            name="desenho"
            value="cama-lado-esquerdo"
            checked={tipoDoDesenho === "cama-lado-esquerdo"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Cama
        </label>
        <label>
          <input
            type="radio"
            name="desenho"
            value="tapete"
            checked={tipoDoDesenho === "tapete"}
            onChange={(e) => setTipoDoDesenho(e.target.value)}
          />
          Tapete
        </label>
      </div>
    </div>
  );
};
