import type { Category } from "./category";

export interface ProductVariant {
  id: number;
  sku: string;
  color: string;
  size: string;
  complement?: string;
  stock: number;
  price: number;
  imageUrl: string;
  images?: ProductImage[];
  isFeatured?: boolean;
}

export interface ProductImage {
  id: number;
  url: string;
  alt?: string;
}
export interface Product {
  id: number;
  name: string;
  description?: string;
  variants: ProductVariant[];
  // O preço vem como string do Prisma, vamos tratá-lo no frontend
  price: number;
  stock: number;
  mainImage?: string;
  images: ProductImage[];
  sku?: string;
  slug?: string;
  size?: string;
  color?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  // Relações
  categoryId?: number;
  category?: Category;
}
