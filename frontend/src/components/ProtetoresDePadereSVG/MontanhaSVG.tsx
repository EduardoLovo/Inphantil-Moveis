import React from "react";

interface Props {
  colors: Record<string, string>;
  onClick: (e: React.MouseEvent<SVGElement>) => void;
  lado: string;
}

export const MontanhaSVG: React.FC<Props> = ({ colors, onClick, lado }) => {
  const cor1 = colors["cor1"] || "#ccc";
  const cor2 = colors["cor2"] || "#ccc";
  const cor3 = colors["cor3"] || "#ccc";

  // Verifica se é o lado esquerdo para aplicar o espelhamento
  const isEsquerdo = lado.toLowerCase() === "esquerdo";

  return (
    <div className="w-full mb-8">
      {/* Título */}
      <h2 className="text-center text-xl font-bold text-[#313b2f] underline decoration-[#ffd639] underline-offset-4 mb-4 capitalize">
        Lado {lado}
      </h2>

      {/* Container do SVG com lógica de Espelhamento */}
      <div
        className={`flex justify-center w-full transition-transform duration-300 ${isEsquerdo ? "scale-x-[-1]" : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          // Removemos width/height fixos em mm e usamos classes Tailwind
          className="w-full h-auto max-w-[800px] drop-shadow-sm"
          viewBox="0 0 330000 71000"
          version="1.1"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
          imageRendering="optimizeQuality"
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <g id="Camada_x0020_1">
            <path
              id="cor3"
              fill={cor3}
              stroke="black"
              strokeWidth="70.56"
              strokeMiterlimit="22.9256"
              onClick={onClick}
              className="cursor-pointer hover:opacity-90 transition-opacity"
              d="M231746.76 5050.52c15793.17,1257.25 30119.41,9621.52 55517.62,9255.39 -4047.65,5170.65 -6722.84,11403.67 -6595.72,17262.05l3.41 37.49c-11617.07,4578.79 -20949.73,7983.28 -26616.64,11214.7 -10074.98,-15838.51 -43799.13,2180.5 -71285.8,-19914.3 -1492.25,-1199.52 -3026.72,-2360.06 -4600.9,-3479.24 11226.22,-14650.98 37784.88,-15633.34 53578.03,-14376.09zm-150539.14 4745.5c-10300.16,6694.88 -18155.61,16614.15 -20794.98,28593.86 -8808.17,-2936.36 -17655.21,-3937.45 -24787.42,1658.35 -6187.51,-4904.6 -12341.62,-6731.91 -17684.2,-6162.73 8383.32,-34038.87 44772.44,-33342.6 63266.6,-24089.48z"
            />
            <path
              id="cor2"
              fill={cor2}
              stroke="black"
              strokeWidth="70.56"
              strokeMiterlimit="22.9256"
              onClick={onClick}
              className="cursor-pointer hover:opacity-90 transition-opacity"
              d="M182769.63 22905.85c27486.68,22094.8 61210.82,4075.79 71285.8,19914.3 -7329.87,4179.68 -21092.01,12396.73 -28902.52,11657.38 -7810.51,-739.35 -27580.02,-2724.32 -27723.61,15860.15l-37656.3 0.01c-1015.79,-20669.23 -18396.47,-28813.22 -37653.81,-25377.78l12.48 -44341.85c23084.73,768.71 44369.64,9210.71 60637.96,22287.79zm-65252.13 -22287.93l-9.17 44342.18c-6931.7,1315.21 -21396.79,5419.63 -28836.91,4268.56 -7412.31,-1146.73 -17808.2,-7354.9 -28258.77,-10838.78 5338.74,-24231.82 32018.91,-40033.41 57104.85,-37771.96zm-81892.28 39430.31c-5926.55,4649.85 -10669.05,13854.79 -13221.32,30289.45l-20887 0 0 -15000c273.6,-18959.96 17064.2,-28799.67 34108.32,-15289.45zm245043.44 -8480.27c-494.24,-22777.9 41374.57,-51219.18 41564.68,-861.78 -7466.85,-7505.84 -20603.69,-7703.72 -30778.92,-3460.34 -3767.56,1571.19 -7373.32,3015.97 -10782.35,4359.61l-3.41 -37.49z"
            />
            <path
              id="cor1"
              fill={cor1}
              stroke="black"
              strokeWidth="70.56"
              strokeMiterlimit="22.9256"
              onClick={onClick}
              className="cursor-pointer hover:opacity-90 transition-opacity"
              d="M122119.19 44959.91c19257.33,-3435.44 36638.01,4708.55 37653.8,25377.77l-37660.96 0 7.16 -25377.77zm-4610.87 0.19l-5.25 25377.58 -0.89 0 -95098.29 0c9267.95,-59678.57 47416.49,-24025.4 66267.52,-21109.02 7440.12,1151.07 21905.21,-2953.35 28836.91,-4268.56zm173946.09 -17714.26c15077.44,-6287.77 36657.61,-2823.97 36657.61,19718.19l0 23373.65 -130682.73 0c143.59,-18584.47 19913.1,-16599.5 27723.61,-15860.15 7810.51,739.35 21572.65,-7477.7 28902.52,-11657.38 5666.91,-3231.42 14999.56,-6635.91 26616.64,-11214.7 3409.03,-1343.65 7014.78,-2788.42 10782.35,-4359.61z"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
