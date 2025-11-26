// Em frontend/src/types/visual-item.ts

export interface VisualItem {
    id: number;
    name: string;
    code: string;
    color: string;
    size: string;
    quantity: number;
    inStock: boolean;
    description: string;
    sequence: number;
    type:
        | 'APLIQUE'
        | 'TECIDO'
        | 'PANTONE'
        | 'LENÇOL'
        | 'SINTETICO'
        | 'SHOWROOM';
    imageUrl: string;
    isExternal: boolean;
    isTapete: boolean;
}
