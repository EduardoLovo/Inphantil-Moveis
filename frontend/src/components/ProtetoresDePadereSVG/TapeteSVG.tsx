import React from "react";
import "./DesenhoSVG.css";

interface Props {
  colors: Record<string, string>; // Recebe o objeto com todas as cores
  onClick: (e: React.MouseEvent<SVGElement>) => void;
  lado: string;
}

export const TapeteSVG: React.FC<Props> = ({ colors, onClick }) => {
  // Fallback para cinza se a cor não estiver definida
  const cor1 = colors["cor1"] || "#ccc";
  const cor2 = colors["cor2"] || "#ccc";
  const cor3 = colors["cor3"] || "#ccc";
  const cor4 = colors["cor4"] || "#ccc";
  const cor5 = colors["cor5"] || "#ccc";
  const cor6 = colors["cor6"] || "#ccc";
  const cor7 = colors["cor7"] || "#ccc";
  const cor8 = colors["cor8"] || "#ccc";
  const cor9 = colors["cor9"] || "#ccc";
  const cor10 = colors["cor10"] || "#ccc";
  const cor11 = colors["cor11"] || "#ccc";
  const cor12 = colors["cor12"] || "#ccc";
  const cor13 = colors["cor13"] || "#ccc";
  const cor14 = colors["cor14"] || "#ccc";
  const cor15 = colors["cor15"] || "#ccc";
  const cor16 = colors["cor16"] || "#ccc";
  const cor17 = colors["cor17"] || "#ccc";

  return (
    <div className="w-full mb-8 flex flex-col items-center">
      <h2 className="text-xl font-bold text-[#313b2f] underline decoration-[#ffd639] underline-offset-4 mb-4 capitalize text-center">
        Tapete
      </h2>
      <div className="w-full flex justify-center transition-transform duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 73000 38000"
          version="1.1"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
          imageRendering="optimizeQuality"
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <g
            id="Camada_x0020_1"
            fill="none"
            stroke="#000"
            stroke-miterlimit="22.926"
            stroke-width="564.44"
          >
            <path
              id="cor6"
              fill={cor6}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M465.48 29643.59l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.34l5833.34 0 0 5833.34 -5833.34 0 0 -5833.34zm5833.34 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.34l5833.34 0 0 5833.34 -5833.34 0 0 -5833.34zm5833.34 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33z"
            />
            <path
              id="cor5"
              fill={cor5}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M465.48 23810.25l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34zm5833.33 -5833.33l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33zm5833.34 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.34l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34zm5833.33 -5833.33l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33z"
            />
            <path
              id="cor4"
              fill={cor4}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M465.48 17976.92l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.33l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33zm5833.34 -5833.34l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34zm5833.33 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33z"
            />
            <path
              id="cor3"
              fill={cor3}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M465.48 12143.59l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.34l5833.34 0 0 5833.34 -5833.34 0 0 -5833.34zm5833.34 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33z"
            />
            <path
              id="cor2"
              fill={cor2}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M465.48 6310.25l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34zm5833.33 -5833.33l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33z"
            />
            <rect
              id="cor1"
              fill={cor1}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              x="465.48"
              y="476.92"
              width="5833.33"
              height="5833.33"
            />
            <path
              id="cor7"
              fill={cor7}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M6298.81 29643.59l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33zm5833.34 -5833.34l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34zm5833.33 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.33l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33zm5833.34 -5833.34l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34zm5833.33 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33z"
            />
            <path
              id="cor8"
              fill={cor8}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M12132.15 29643.59l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.34l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34zm5833.33 -5833.33l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33zm5833.34 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.34l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34zm5833.33 -5833.33l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33z"
            />
            <path
              id="cor9"
              fill={cor9}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M17965.48 29643.59l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.34l5833.34 0 0 5833.34 -5833.34 0 0 -5833.34zm5833.34 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.34l5833.34 0 0 5833.34 -5833.34 0 0 -5833.34zm5833.34 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33z"
            />
            <path
              id="cor10"
              fill={cor10}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M23798.81 29643.59l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33zm5833.34 -5833.34l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34zm5833.33 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.33l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33zm5833.34 -5833.34l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34zm5833.33 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33z"
            />
            <path
              id="cor11"
              fill={cor11}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M29632.15 29643.59l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.34l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34zm5833.33 -5833.33l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33zm5833.34 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.34l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34zm5833.33 -5833.33l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33z"
            />
            <path
              id="cor12"
              fill={cor12}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M35465.48 29643.59l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.34l5833.34 0 0 5833.34 -5833.34 0 0 -5833.34zm5833.34 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.34l5833.34 0 0 5833.34 -5833.34 0 0 -5833.34zm5833.34 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33z"
            />
            <path
              id="cor13"
              fill={cor13}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M41298.81 29643.59l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33zm5833.34 -5833.34l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34zm5833.33 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.33l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33zm5833.34 -5833.34l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34z"
            />
            <path
              id="cor14"
              fill={cor14}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M47132.15 29643.59l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.34l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34zm5833.33 -5833.33l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33zm5833.34 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33z"
            />
            <path
              id="cor15"
              fill={cor15}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M52965.48 29643.59l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33zm5833.33 -5833.34l5833.34 0 0 5833.34 -5833.34 0 0 -5833.34zm5833.34 -5833.33l5833.33 0 0 5833.33 -5833.33 0 0 -5833.33z"
            />
            <path
              id="cor16"
              fill={cor16}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M58798.81 29643.59l5833.34 0 0 5833.33 -5833.34 0 0 -5833.33zm5833.34 -5833.34l5833.33 0 0 5833.34 -5833.33 0 0 -5833.34z"
            />
            <rect
              id="cor17"
              fill={cor17}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              x="64632.15"
              y="29643.59"
              width="5833.33"
              height="5833.33"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
