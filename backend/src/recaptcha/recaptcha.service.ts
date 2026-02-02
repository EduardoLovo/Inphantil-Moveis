import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { URLSearchParams } from 'url';

@Injectable()
export class RecaptchaService {
    private readonly logger = new Logger(RecaptchaService.name);
    private readonly secretKey: string;
    private readonly verificationUrl =
        'https://www.google.com/recaptcha/api/siteverify';

    constructor(
        private configService: ConfigService,
        private httpService: HttpService,
    ) {
        const secret = this.configService.get<string>('RECAPTCHA_SECRET_KEY');

        if (!secret) {
            throw new Error(
                'RECAPTCHA_SECRET_KEY não está configurada no ambiente.',
            );
        }
        this.secretKey = secret as string;
    }

    async validateRecaptcha(token: string, ip?: string): Promise<void> {
        if (!token) {
            throw new BadRequestException('Token reCAPTCHA ausente.');
        }

        const params = new URLSearchParams();
        params.append('secret', this.secretKey);
        params.append('response', token);
        if (ip) {
            params.append('remoteip', ip);
        }

        try {
            const response = await firstValueFrom(
                this.httpService.post(this.verificationUrl, params),
            );

            const { success, score } = response.data;

            const MINIMUM_SCORE = 0.5;

            if (!success || (score && score < MINIMUM_SCORE)) {
                throw new BadRequestException(
                    'Falha na validação reCAPTCHA. Você é um robô?',
                );
            }
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error('Erro na validação do reCAPTCHA', error);
            throw new BadRequestException(
                'Erro de comunicação com o serviço reCAPTCHA.',
            );
        }
    }
}
