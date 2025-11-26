export interface Category {
    id: number;
    name: string;
    slug: string;
    _count?: {
        products: number;
    };
}
