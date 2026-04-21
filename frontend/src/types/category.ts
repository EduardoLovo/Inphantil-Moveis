export interface Category {
  id: number;
  name: string;
  slug: string;

  // 👉 NOVO: Adicionamos o cérebro da categoria!
  config?:
    | {
        showSizes?: boolean;
        showColors?: boolean;
        colorPalette?: string | null;
        showComplements?: boolean;
      }
    | any; // O "any" garante que o TypeScript não vai reclamar se vier um JSON ligeiramente diferente

  // (Mantenha o _count se você já tiver ele para contar os produtos)
  _count?: {
    products: number;
  };
}
