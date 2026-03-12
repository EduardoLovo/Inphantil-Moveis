import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly mailerService: MailerService) {}

    async sendPaymentApprovedEmail(
        order: any,
        customerEmail: string,
        customerName: string,
    ) {
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #313b2f;">
        <div style="background-color: #313b2f; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffd639; margin: 0;">Pagamento Aprovado! 🎉</h1>
        </div>
        <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #313b2f;">Olá, ${customerName}!</h2>
          <p style="font-size: 16px; line-height: 1.5;">
            Temos excelentes notícias! O pagamento do seu pedido <strong>#${order.id}</strong> foi confirmado com sucesso.
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            A nossa equipa já foi notificada e o seu pedido acabou de entrar em <strong>fase de produção/separação</strong>. 
          </p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #313b2f;">Resumo do Pedido:</h3>
            <p style="margin: 5px 0;"><strong>Valor Total:</strong> R$ ${Number(order.totalAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> Em Produção 🛠️</p>
          </div>

          <p style="font-size: 16px; line-height: 1.5;">
            Assim que o seu pedido for despachado para a transportadora, enviar-lhe-emos um novo e-mail com o código de rastreio para que possa acompanhar a viagem da sua encomenda!
          </p>
        </div>
      </div>
    `;

        try {
            await this.mailerService.sendMail({
                to: customerEmail,
                subject: `Pagamento Confirmado - Pedido #${order.id} 🚀`,
                html: htmlContent,
            });
            this.logger.log(
                `E-mail de Pagamento Aprovado enviado com sucesso para ${customerEmail}`,
            );
        } catch (error) {
            this.logger.error(
                `Erro ao enviar e-mail de pagamento aprovado para ${customerEmail}`,
                error,
            );
        }
    }
}
