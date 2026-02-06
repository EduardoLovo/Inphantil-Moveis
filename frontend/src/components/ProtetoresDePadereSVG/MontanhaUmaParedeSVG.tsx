import React from "react";

interface Props {
  colors: Record<string, string>;
  onClick: (e: React.MouseEvent<SVGElement>) => void;
  lado: string;
}

export const MontanhaUmaParedeSVG: React.FC<Props> = ({ colors, onClick }) => {
  const cor1 = colors["cor1"] || "#ccc";
  const cor2 = colors["cor2"] || "#ccc";
  const cor3 = colors["cor3"] || "#ccc";

  return (
    <div className="w-full mb-8 flex flex-col items-center">
      <h2 className="text-xl font-bold text-[#313b2f] underline decoration-[#ffd639] underline-offset-4 mb-4 capitalize text-center">
        Uma Parede
      </h2>

      {/* Container do SVG com Espelhamento Condicional */}
      <div className="w-full flex justify-center transition-transform duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto max-w-[800px] drop-shadow-sm"
          viewBox="0 0 210000 80000"
          version="1.1"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
          imageRendering="optimizeQuality"
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <g
            fill="none"
            stroke="#000"
            strokeMiterlimit="22.926"
            strokeWidth="564.44"
          >
            <path
              id="cor1"
              fill={cor1}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M42440.88 52994.84c13391.98 15622.4 32045.45-9963.85 33504.09 24129.97H1728.7c623.22-23717.97 6037.04-43626.84 18390.57-44958.94 12353.52-1332.1 16378.68 13896.26 22321.61 20828.97zm134218.78-18961.88c12778.82-6287.77 31069.01-2823.97 31069.01 19718.19v23373.66l-110759.66-.01c121.71-18584.47 16877.28-16599.5 23497.04-15860.15 6619.78 739.35 18283.82-7477.7 24496.23-11657.38 6212.4-4179.68 17622.65-8648.91 31697.38-15574.31z"
            />
            <path
              id="cor2"
              fill={cor2}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              className="cursor-pointer hover:opacity-90 transition-opacity"
              d="M78714.88 30492.77c20940 25194.5 47014.56 4762.8 50340.44 28708.66-3189.27 1440.68-6213.99 2328.51-8589.27 2063.22-6619.76-739.35-23375.33-2724.32-23497.04 15860.16H75944.97c-1458.64-34093.82-20112.11-8507.57-33504.09-24129.97-5942.93-6932.71-9968.09-22161.07-22321.61-20828.97 2571.36-17333.43 33184.79-32246.75 58595.61-1673.1zm79039.46 12407.34c-2501.95-25427.54 42568.28-49229 40565.45-9121.35-6354.09-3686.28-14801.04-3120.79-21660.13 254.2-7084.54 3485.92-13494.02 6349.54-18905.32 8867.15z"
            />
            <path
              id="cor3"
              fill={cor3}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              className="cursor-pointer hover:opacity-90 transition-opacity"
              d="M118112.95 6407.64c14738.85 5076.51 20660.6 13407.93 46275.42 17331.74-4466.37 5426.61-7315.65 12233.32-6634.03 19160.73-5339.21 2484.08-9706.69 4631.34-12792.06 6707.16-3983.29 2679.95-10207.87 7019.74-15906.96 9594.16-3325.88-23945.86-29400.44-3514.17-50340.44-28708.66-4459.85-5365.99-9079.98-9330.82-13680.63-12127.29C83075.51 1217.16 103265.74 1293.8 118112.95 6407.64z"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
