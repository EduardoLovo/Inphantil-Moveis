import {
    Injectable,
    CanActivate,
    ExecutionContext,
    // 1. CORREÇÃO: Importe o BadRequestException aqui
    BadRequestException,
} from '@nestjs/common';
import { RecaptchaService } from './recaptcha.service';

@Injectable()
export class RecaptchaGuard implements CanActivate {
    constructor(private recaptchaService: RecaptchaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // CORREÇÃO: Acessamos o campo usando o nome CamelCase do DTO
        const recaptchaToken = request.body.gRecaptchaResponse;

        // Opcionalmente, pode ser necessário verificar se o DTO existe no corpo
        if (!request.body || !recaptchaToken) {
            // 2. O erro agora deve ser reconhecido
            throw new BadRequestException('Token reCAPTCHA ausente.');
        }

        // Tentamos pegar o IP do cliente para uma verificação mais precisa
        const ip = request.ip as string;

        // O serviço faz a validação com o Google. Se falhar, ele lança uma BadRequestException (400)
        await this.recaptchaService.validateRecaptcha(recaptchaToken, ip);

        // Se a validação passar, o Guard retorna true e a requisição continua
        return true;
    }
}
