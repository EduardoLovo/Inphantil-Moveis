// Em frontend/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // ADICIONE O BLOCO ABAIXO:
    server: {
        port: 5173, // Porta padrão do React/Vite
        proxy: {
            // Quando o frontend tentar acessar /api/..., ele será redirecionado para o backend
            '/api': {
                target: 'http://localhost:3000', // URL do seu NestJS
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api do caminho
            },
        },
    },
});
