import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SevenPedidoVendaRequestDTO } from './seven.dto';

// 👉 1. OS MOLDES DO TYPESCRIPT (100% BLINDADOS CONTRA O PRISMA)
export interface IntegracaoUser {
    name: string;
    email?: string;
    cpf: string | null;
}

export interface IntegracaoAddress {
    zipCode: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
}

export interface IntegracaoOrderItem {
    quantity: number;
    price: any; // Aceita o Decimal do Prisma
    variant?: { sku?: string | null; color?: string | null } | null;
    product?: { sku?: string | null } | null; // Aceita Nulo!
}

export interface IntegracaoOrder {
    id: number | string;
    total: any; // Aceita o Decimal do Prisma
    paymentMethod: string | null; // Aceita Nulo!
    createdAt: Date | string;
    items: IntegracaoOrderItem[];
}

@Injectable()
export class SevenService {
    private readonly logger = new Logger(SevenService.name);

    constructor(private readonly httpService: HttpService) {}

    // 👉 1. A NOVA FUNÇÃO QUE FAZ O LOGIN SOZINHA
    private async gerarToken(): Promise<string> {
        const url = String(process.env.SEVEN_API_URL);
        const apiUser = String(process.env.SEVEN_API_USER);
        const apiPass = String(process.env.SEVEN_API_PASS);

        try {
            this.logger.log('Autenticando no ERP Seven (Gerando Token)...');

            const response = await firstValueFrom(
                this.httpService.post(`${url}/resources/v1/login`, {
                    login: apiUser,
                    senha: apiPass,
                }),
            );

            // 👉 PEGAMOS O TOKEN PURO E LIMPAMOS OS ESPAÇOS INVISÍVEIS!
            const tokenPuro = String(response.data).trim();

            return tokenPuro;
        } catch (error: unknown) {
            const err = error as any;
            this.logger.error(
                'Erro no Login da API Seven:',
                err.response?.data || err.message,
            );
            throw new Error('Falha de Autenticação com o ERP');
        }
    }
    // Função auxiliar para formatar a data como o Seven exige (DD/MM/YYYY)
    private formatDateBR(date: Date | string): string {
        const dObj = new Date(date);
        const d = String(dObj.getDate()).padStart(2, '0');
        const m = String(dObj.getMonth() + 1).padStart(2, '0');
        const y = dObj.getFullYear();
        return `${d}/${m}/${y}`;
    }

    async enviarPedidoParaOSeven(
        order: IntegracaoOrder,
        user: IntegracaoUser,
        address: IntegracaoAddress,
    ) {
        const url = String(process.env.SEVEN_API_URL);

        try {
            // 👉 2. PRIMEIRO PASSO: Pega o Token antes de tudo!
            const token = await this.gerarToken();

            const cfopCalculado =
                address.state.toUpperCase() === 'PR' ? '5101' : '6107';

            const payload = {
                codigo: String(order.id),
                valorTotalPedido: Number(order.total),
                valorTotalProdutos: Number(order.total),
                valorTotalServicos: 0,
                vlDespAcessor: 0,
                vlFretePedidoVenda: 0,
                pcFretePedidoVenda: 0,

                tipoPedidoId: 1,
                status: 'BLOQUEADO',
                planoContaId: '3.1.1.1',
                cfop: cfopCalculado,
                codEmpresa: 1,
                formaPagamento:
                    order.paymentMethod === 'pix' ? 'A VISTA' : 'CARTAO',
                formaCobranca:
                    order.paymentMethod === 'pix'
                        ? 'PIX'
                        : 'CARTAO DE CREDITO REDE',

                tpComissao: 'PEDIDO',
                dataPedido: this.formatDateBR(order.createdAt),
                dataPrevistaEntrega: this.formatDateBR(order.createdAt),

                atualizaDadosCliente: 'SIM',
                atualizaCadastroCliente: 'SIM',
                atualizaDadosVendedor: 'NAO',
                insereObsCliente: 'NAO',
                insereVend2Cliente: 'NAO',
                boComissaoAuto: 'NAO',
                tipoDeFrete: 'SEM FRETE',

                cliente: {
                    regimeTributacao: 'Lucro Real',
                    tipoTributacao: 'Consumidor Final - Pessoa Fisica',
                    razaoSocial: String(user.name),
                    nomeFantasia: String(user.name),
                    limiteCreditoId: 1,
                    cpfCnpjCliente: String(user.cpf || '').replace(/\D/g, ''),
                    endereco: {
                        uf: String(address.state),
                        cidade: String(address.city),
                        cep: String(address.zipCode).replace(/\D/g, ''),
                        bairro: String(address.neighborhood),
                        logradouro: String(address.street),
                        numero: String(address.number),
                        complemento: '',
                        observacao: '',
                    },
                    contato: {
                        telefones: [],
                        emails: user.email
                            ? [
                                  {
                                      tipo: 'Principal',
                                      email: String(user.email),
                                      nome: String(user.name),
                                  },
                              ]
                            : [],
                    },
                },

                vendedor: {
                    nome: 'Vendedor E-commerce',
                    cpfCnpjCliente: '03761683000198',
                    endereco: {
                        uf: 'PR',
                        cidade: 'Jandaia do Sul',
                        cep: '00000000',
                        bairro: 'Internet',
                        logradouro: 'Loja Virtual',
                        numero: 'S/N',
                        complemento: '',
                        observacao: '',
                    },
                },

                produtos: order.items.map((item) => {
                    // 1. Pegamos a cor que vem do banco (ex: "cz6-cz26")

                    console.log(
                        `\n🔍 ESPIANDO O ITEM [${item.product?.sku || item.variant?.sku}]:`,
                        {
                            temVariante: !!item.variant,
                            corQueChegou: item.variant?.color,
                        },
                    );
                    console.log(item);

                    const corOriginal = item.variant?.color || '';
                    let obsFormatada = '';

                    // 2. Se a cor tiver um traço (-), nós dividimos em duas partes
                    if (corOriginal.includes('-')) {
                        const [ext, int] = corOriginal.split('-');
                        // O .trim() tira os espaços e o .toUpperCase() deixa tudo em MAIÚSCULAS
                        obsFormatada = `Ext: ${ext.trim().toUpperCase()} - Int: ${int.trim().toUpperCase()}`;
                    } else if (corOriginal) {
                        // Prevenção de erros: e se um dia cadastrarem uma cor sem traço? (ex: "Azul")
                        obsFormatada = `Cor: ${corOriginal.trim().toUpperCase()}`;
                    }

                    // 3. Devolvemos o produto montado
                    return {
                        sku: String(
                            item.variant?.sku || item.product?.sku || 'CM002',
                        ),
                        quantidade: Number(item.quantity),
                        valorTotal: Number(item.price) * Number(item.quantity),
                        valorBruto: Number(item.price) * Number(item.quantity),
                        valorLiquido:
                            Number(item.price) * Number(item.quantity),
                        percentualDesconto: 0,
                        obsItem: obsFormatada,
                    };
                }),

                servicos: [],

                enderecoEntrega: {
                    cep: String(address.zipCode).replace(/\D/g, ''),
                    endereco: String(address.street),
                    numero: String(address.number),
                    bairro: String(address.neighborhood),
                    complemento: '',
                    cidade: String(address.city),
                    uf: String(address.state),
                    cnpjCpf: String(user.cpf || '').replace(/\D/g, ''),
                    recebedor: String(user.name),
                    telefone: '',
                },
            };

            console.log(payload);

            this.logger.log(
                `Enviando pedido ${order.id} para o ERP Seven (v2)...`,
            );

            // 👉 3. SEGUNDO PASSO: Envia o pedido usando o TOKEN (Bearer)
            const response = await firstValueFrom(
                this.httpService.post(
                    `${url}/resources/v2/pedido-venda`,
                    payload,
                    {
                        headers: {
                            Authorization: token,
                            'Content-Type': 'application/json',
                        },
                    },
                ),
            );

            this.logger.log(
                `Pedido ${order.id} integrado com sucesso no Seven!`,
            );
            return response.data;
        } catch (error: unknown) {
            const err = error as any;
            this.logger.error(
                `Erro ao integrar pedido ${order.id} no Seven`,
                err.response?.data || err.message,
            );
        }
    }
}
