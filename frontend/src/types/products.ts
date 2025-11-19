import type { Category } from './category';

export interface Product {
    id: number;
    name: string;
    description?: string;
    // O preço vem como string do Prisma, vamos tratá-lo no frontend
    price: number;
    stock: number;
    imageUrl?: string;
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
