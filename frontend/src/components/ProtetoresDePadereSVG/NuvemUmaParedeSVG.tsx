import React from 'react';
import './DesenhoSVG.css';

interface Props {
    colors: Record<string, string>; // Recebe o objeto com todas as cores
    onClick: (e: React.MouseEvent<SVGElement>) => void;
    lado: string;
}

export const NuvemUmaParedeSVG: React.FC<Props> = ({ colors, onClick }) => {
    // Fallback para cinza se a cor não estiver definida
    const cor1 = colors['cor1'] || '#ccc';
    const cor2 = colors['cor2'] || '#ccc';

    return (
        <div>
            <h2 className="titulo-lado">Uma Parede</h2>
            <div className="direito">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    // width="300mm"
                    height="60mm"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    image-rendering="optimizeQuality"
                    shape-rendering="geometricPrecision"
                    text-rendering="geometricPrecision"
                    version="1.0"
                    viewBox="0 0 210000 80000"
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
                            d="M58350.46 16308.9c16589.06-13228.06 38796.05-9273.85 49383.87 3190.95-4230.78 2290.66-8078.19 5487.23-11191.53 9730.87-12509.46-2333.49-29720.69 8441.1-30138.81 22200.82-5871.1 1323.03-11484.27 7566.89-11484.27 11200.46l.01 15451.21H2671.45V62632c55.21-11094.69 4176.72-21478.83 15413.63-27254.63 4444.98-15967.65 22856.85-25159.91 40265.38-19068.47z"
                        />
                        <path
                            id="cor2"
                            fill={cor2}
                            stroke="black"
                            strokeWidth="70.56"
                            onClick={onClick}
                            d="M150343.58 21957.55c12891.03-4226.44 29695.53 1565.51 34457.53 14170.4 15023.03 2049.41 23870.31 13127.73 23870.31 26918.81v15036.46l-153751.69-.01V62631.99c0-3633.57 5613.17-9877.43 11484.27-11200.46 418.12-13759.72 17629.35-24534.31 30138.82-22200.8 13678.08-18644.06 41525.39-17077.22 53800.76-7273.18z"
                        />
                    </g>
                </svg>
            </div>
        </div>
    );
};
