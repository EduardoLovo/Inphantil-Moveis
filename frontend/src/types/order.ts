import type { User } from './auth';
import type { Address } from './address';
import type { Product } from './products';

// 1. Substitua o 'enum' por 'const' (Objeto JavaScript)
export const OrderStatus = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    IN_PRODUCTION: 'IN_PRODUCTION',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELED: 'CANCELED',
} as const; // 'as const' torna as propriedades somente leitura e literais

// 2. Crie o Tipo a partir do Objeto (para usar nas interfaces)
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    productId: number;
    product: Product;
}

export interface Order {
    id: number;
    createdAt: string;
    updatedAt: string;
    total: number;
    status: OrderStatus; // O tipo continua funcionando aqui
    userId: number;
    user: User;
    addressId: number;
    address: Address;
    items: OrderItem[];
}
