import { SetMetadata } from '@nestjs/common';

// Chave única para identificar rotas públicas
export const IS_PUBLIC_KEY = 'isPublic';

// Decorator: Adiciona o metadado { isPublic: true } à rota ou classe
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
