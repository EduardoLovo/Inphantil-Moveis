import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SevenPedidoVendaRequestDTO } from './seven.dto';

@Injectable()
export class SevenService {
    private readonly logger = new Logger(SevenService.name);

    constructor(private readonly httpService: HttpService) {}

    // Função auxiliar para formatar a data como o Seven exige (DD/MM/YYYY)
    private formatDateBR(date: Date): string {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    }

    async enviarPedidoParaOSeven(order: any, user: any, address: any) {
        // 1. O TRADUTOR: Mapeamos os dados do nosso sistema para o Seven
        const url = process.env.SEVEN_API_URL;
        const token = process.env.SEVEN_API_TOKEN;
        const payload: SevenPedidoVendaRequestDTO = {
            codigo: order.id.toString(), // ID do pedido no nosso banco
            valorTotalPedido: order.total,
            valorTotalProdutos: order.total, // Assumindo que o frete já está no total ou não tem serviços
            valorTotalServicos: 0,

            // DADOS FIXOS DO SEU ERP (Você precisa olhar no painel do Seven e colocar aqui)
            tipoPedidoId: 1, // Ex: 1 pode ser "Venda Site"
            status: 'ABERTO',
            planoContaId: '1001', // Código do Plano de contas do site
            cfop: '5102', // Venda de mercadoria dentro do estado
            formaPagamento:
                order.paymentMethod === 'pix' ? 'PIX' : 'CARTAO DE CREDITO',
            formaCobranca: order.paymentMethod === 'pix' ? 'PIX' : 'CARTAO',
            tpComissao: 'PEDIDO',

            dataPedido: this.formatDateBR(order.createdAt),

            cliente: {
                regimeTributacao: 'Normal', // Ou Simples Nacional, verifique com seu contador
                tipoTributacao: 'Consumidor Final - Pessoa Fisica',
                razaoSocial: user.name,
                nomeFantasia: user.name,
                limiteCreditoId: 1, // ID padrão do Seven
                cpfCnpjCliente: order.cpf,
                endereco: {
                    cep: address.zipCode.replace(/\D/g, ''),
                    endereco: address.street,
                    numero: address.number,
                    bairro: address.neighborhood,
                    cidade: address.city,
                    uf: address.state,
                    cnpjCpf: order.cpf,
                },
            },

            vendedor: {
                nome: 'Vendedor E-commerce', // Vendedor genérico para o site
                cpfCnpjCliente: '00000000000',
                endereco: {
                    cep: '00000000',
                    endereco: 'Loja Virtual',
                    numero: 'S/N',
                    bairro: 'Internet',
                    cidade: 'Jandaia do Sul',
                    uf: 'PR',
                    cnpjCpf: '00000000000',
                },
            },

            // 👉 CORREÇÃO 1: Adicionamos ": any" ao item para acalmar o TypeScript
            produtos: order.items.map((item: any) => ({
                // Verificamos se tem variant.sku, se não, tentamos product.sku (se existir), ou um padrão
                sku: item.variant?.sku || item.product?.sku || 'SKU-PADRAO',
                quantidade: item.quantity,
                valorTotal: item.price * item.quantity,
                valorBruto: item.price * item.quantity,
                valorLiquido: item.price * item.quantity,
                percentualDesconto: 0,
            })),

            enderecoEntrega: {
                cep: address.zipCode.replace(/\D/g, ''),
                endereco: address.street,
                numero: address.number,
                bairro: address.neighborhood,
                cidade: address.city,
                uf: address.state,
                cnpjCpf: order.cpf,
            },
        };

        // 2. ENVIO PARA A API DO SEVEN
        try {
            this.logger.log(`Enviando pedido ${order.id} para o ERP Seven...`);

            const response = await firstValueFrom(
                this.httpService.post(`${url}/pedidos`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }),
            );

            this.logger.log(
                `Pedido ${order.id} integrado com sucesso no Seven!`,
            );
            return response.data;

            // 👉 CORREÇÃO 2: Deixamos como unknown, mas usamos uma constante tipada dentro do bloco
        } catch (error: unknown) {
            const err = error as any; // Transformamos o erro desconhecido em 'any' temporariamente

            this.logger.error(
                `Erro ao integrar pedido ${order.id} no Seven`,
                err.response?.data || err.message,
            );
        }
    }
}
