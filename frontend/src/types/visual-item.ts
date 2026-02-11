export enum VisualItemType {
  APLIQUE = "APLIQUE",
  TECIDO = "TECIDO",
  PANTONE = "PANTONE",
  LENCOL = "LENCOL",
  SINTETICO = "SINTETICO",
  SHOWROOM = "SHOWROOM",
}

export enum ItemSize {
  FRONHA = "FRONHA",
  BERCO = "BERCO",
  JUNIOR = "JUNIOR",
  SOLTEIRO = "SOLTEIRO",
  SOLTEIRAO = "SOLTEIRÃO",
  VIUVA = "VIUVA",
  CASAL = "CASAL",
  QUEEN = "QUEEN",
  KING = "KING",
}

export enum ItemColor {
  AMARELO = "AMARELO",
  AZUL = "AZUL",
  AZULAZ3 = "AZULAZ3",
  AZULBEBE = "AZULBEBE",
  BEGE = "BEGE",
  BRANCO = "BRANCO",
  CINZA = "CINZA",
  LARANJA = "LARANJA",
  LILAS = "LILAS",
  MOSTARDA = "MOSTARDA",
  PALHA = "PALHA",
  PRATA = "PRATA",
  ROSA = "ROSA",
  ROSABEBE = "ROSABEBE",
  TIFFANY = "TIFFANY",
  VERDE = "VERDE",
  VERMELHO = "VERMELHO",
}
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
  type: "APLIQUE" | "TECIDO" | "PANTONE" | "LENCOL" | "SINTETICO" | "SHOWROOM";
  imageUrl: string;
  isExternal: boolean;
  isTapete: boolean;
}
