// Tipos para Login e Registro
export interface LoginDto {
    email: string;
    password: string;
    gRecaptchaResponse: string;
}

export interface RegisterDto extends LoginDto {
    name: string;
    fone: string;
}

// Tipos para o Usuário (simplificado)
export interface User {
    id: number;
    name: string;
    email: string;
    fone: string;
    role: 'ADMIN' | 'SELLER' | 'USER' | 'DEV';
    createdAt: string;
}
