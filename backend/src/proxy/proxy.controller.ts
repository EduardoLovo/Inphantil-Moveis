import {
    Controller,
    Get,
    Query,
    Res,
    BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { Public } from '../auth/decorators/public.decorator';

@Controller('proxy')
export class ProxyController {
    @Public() // Deixa a rota pública para o frontend acessar sem token (se necessário)
    @Get('image')
    async proxyImage(@Query('url') imageUrl: string, @Res() res: Response) {
        if (!imageUrl) throw new BadRequestException('URL é obrigatória');

        // Segurança: Permitir apenas domínios conhecidos (Adicione o do Pinterest)
        const allowedDomains = [
            'pinterest.com',
            'pinimg.com',
            'googleusercontent.com',
        ];
        const isAllowed = allowedDomains.some((domain) =>
            imageUrl.includes(domain),
        );

        if (!isAllowed) {
            throw new BadRequestException('Domínio de imagem não permitido');
        }

        try {
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
                timeout: 5000, // Timeout de 5 segundos
                maxContentLength: 5 * 1024 * 1024, // Limite de 5MB
            });

            const contentType = response.headers['content-type'];

            // Define os headers de resposta para o navegador entender que é uma imagem
            res.set({
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400', // Cache de 1 dia
                'Access-Control-Allow-Origin': '*', // Garante que o frontend consiga ler
            });

            res.send(response.data);
        } catch (error) {
            // Se for um erro do Axios, ele tem propriedades específicas, mas o genérico 'Error' resolve o .message
            if (error instanceof Error) {
                console.error('Erro no proxy de imagem:', error.message);
            } else {
                console.error('Erro desconhecido no proxy:', error);
            }

            res.status(500).send('Erro ao buscar imagem externa');
        }
    }
}
