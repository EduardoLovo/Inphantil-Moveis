import React from 'react';
import './DesenhoSVG.css';

interface Props {
    colors: Record<string, string>; // Recebe o objeto com todas as cores
    onClick: (e: React.MouseEvent<SVGElement>) => void;
    lado: string;
}

export const OndaSVG: React.FC<Props> = ({ colors, onClick, lado }) => {
    // Fallback para cinza se a cor não estiver definida
    const cor1 = colors['cor1'] || '#ccc';
    const cor2 = colors['cor2'] || '#ccc';

    return (
        <div>
            <h2 className="titulo-lado">Lado {lado}</h2>
            <div className={lado}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="300mm"
                    height="60mm"
                    version="1.0"
                    shape-rendering="geometricPrecision"
                    text-rendering="geometricPrecision"
                    image-rendering="optimizeQuality"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    viewBox="0 0 330000 71000"
                >
                    <g id="Camada_x0020_1">
                        <path
                            id="cor1" // O ID é crucial para o handler funcionar
                            fill={cor1}
                            stroke="black"
                            strokeWidth="70.56"
                            onClick={onClick} // Passa o click
                            d="M120540.56 21370.55v28469.16c-17696.98 10989.14-40709.16-4055.37-57378.48-13407.2-20564.33-11934.35-44905.3-1883.61-54479.06 14416.45-4189.56-15239.6 5881.76-40331.37 27257.69-41658.3 11270.87-699.64 20392.88 5719.95 28350 10270.72 16887.59 10711.68 42179.67 11364.98 56249.85 1909.17zm7539.32 0c50922.69-29719.49 77018.71 11521.66 102996.89 6897.31v20829.15c-25720.09-766.69-39080.77-25132.04-59161.79-25249.95-15323.67-89.97-31717.42 19738.07-43835.1 25992.65zM286239 4677.72c13708.39-1472.94 28164.59 7094.38 31856.54 21327.32-4161.94-651.23-9405.49 440.38-16011.11 3905.99-30494.75 15998.97-53001.01 20143.68-71007.66 19185.98V28267.86C250888.83 24741.14 261417.66 7652.58 286239 4677.72z"
                        />
                        <path
                            className="teste"
                            id="cor2"
                            fill={cor2}
                            stroke="black"
                            strokeWidth="70.56"
                            onClick={onClick}
                            d="M4540.58 64435.19c911.94-23241.08 32754.44-43014.43 58621.51-28002.68 16669.31 9351.83 39681.49 24396.34 57378.47 13407.2v27684.68H4540.58zm226536.19-15338.18c18006.65 957.7 40512.9-3187.01 71007.66-19185.98 33246.64-17442.74 31989.22 25252.84 31989.22 47613.36H231076.77zm-102996.89 742.7c12117.68-6254.58 28511.43-26082.62 43835.1-25992.65 20081.02 117.91 33441.7 24483.26 59161.79 25249.95v28427.38H128079.88z"
                        />
                    </g>
                </svg>
            </div>
        </div>
    );
};
