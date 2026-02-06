import React from "react";
import "./DesenhoSVG.css";

interface Props {
  colors: Record<string, string>; // Recebe o objeto com todas as cores
  onClick: (e: React.MouseEvent<SVGElement>) => void;
  lado: string;
}

export const OndaUmaParedeSVG: React.FC<Props> = ({ colors, onClick }) => {
  // Fallback para cinza se a cor não estiver definida
  const cor1 = colors["cor1"] || "#ccc";
  const cor2 = colors["cor2"] || "#ccc";

  return (
    <div className="w-full mb-8 flex flex-col items-center">
      <h2 className="text-xl font-bold text-[#313b2f] underline decoration-[#ffd639] underline-offset-4 mb-4 capitalize text-center">
        Uma Parede
      </h2>
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
            stroke-miterlimit="22.926"
            stroke-width="564.44"
          >
            <path
              id="cor1"
              fill={cor1}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M206055.83 72957.97c0,-22360.52 -1054.36,-63858.02 -34301,-46415.29 -30494.75,15998.97 -50689.23,18945.61 -68695.88,17987.91 -25720.09,-766.69 -35615.42,-20540.73 -54141.15,-22546.53 -20723.96,-2243.8 -50483.13,14370.53 -48855.74,50973.91 68664.59,0 137329.18,0 205993.77,0zm-102996.88 0l0 -28427.38"
            />
            <path
              id="cor2"
              fill={cor2}
              stroke="black"
              strokeWidth="70.56"
              onClick={onClick}
              d="M190586.39 23098.02c-4704.54,-1535.84 -10837.46,-749.42 -18831.56,3444.66 -30494.75,15998.96 -50689.23,18945.61 -68695.88,17987.91 -25720.09,-766.69 -35615.42,-20540.73 -54141.15,-22546.53 -13724.04,-1485.91 -31410.46,5298.4 -41319.95,20681.36 -7425.21,-28924.59 25347.74,-47081.7 50740.21,-36734.31 16740.51,6821.72 32535.35,15965.19 44720.89,13796.05 19812.06,-3526.72 30263.15,-17407.48 55162.23,-19615.86 13955.99,-1237.8 28673.26,8753.78 32365.21,22986.72zm-87527.44 21432.57l0 -24803.43"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
