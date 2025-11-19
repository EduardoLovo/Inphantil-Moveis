import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SocialService {
    private readonly accessToken: string | undefined;
    private readonly userId: string | undefined;

    constructor(
        private configService: ConfigService,
        private httpService: HttpService,
    ) {
        // Obtenha o token de forma segura
        this.accessToken = this.configService.get<string>(
            'INSTAGRAM_ACCESS_TOKEN',
        );
        this.userId = this.configService.get<string>('INSTAGRAM_USER_ID');

        if (!this.accessToken || !this.userId) {
            console.warn(
                'Configuração do Instagram ausente. O endpoint social pode falhar.',
            );
        }
    }

    async getInstagramFeed() {
        if (!this.accessToken) {
            throw new InternalServerErrorException(
                'Configuracao de token do Instagram ausente.',
            );
        }

        const fields =
            'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';
        const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${this.accessToken}`;

        try {
            const response = await firstValueFrom(this.httpService.get(url));
            // Retorna apenas os dados dos posts (limite de 6-12 posts é comum)
            return response.data.data.slice(0, 12);
        } catch (error) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'message' in error
            ) {
                console.error(
                    'Erro ao buscar feed do Instagram:',
                    error.message,
                );
            } else {
                console.error('Erro desconhecido ao buscar feed do Instagram.');
            }
            return [];
        }
    }
}
