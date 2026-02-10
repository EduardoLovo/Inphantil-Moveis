import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

@Controller('proxy')
export class ProxyController {
    @Get('image')
    async proxyImage(@Query('url') imageUrl: string, @Res() res: Response) {
        try {
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
            });
            const contentType = response.headers['content-type'];
            res.set('Content-Type', contentType);
            res.send(response.data);
        } catch (error) {
            res.status(500).send('Erro ao buscar imagem externa');
        }
    }
}
