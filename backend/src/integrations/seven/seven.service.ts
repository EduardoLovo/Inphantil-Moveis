import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';

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
    // Removido o sku de dentro do product!
    product?: { name?: string | null } | null;
    customData?: any; // 👉 Aceita os dados de personalização
}

export interface IntegracaoOrder {
    id: number | string;
    total: any; // Aceita o Decimal do Prisma
    paymentMethod: string | null; // Aceita Nulo!
    createdAt: Date | string;
    items: IntegracaoOrderItem[];
    shippingCost?: any;
}

@Injectable()
export class SevenService {
    private readonly logger = new Logger(SevenService.name);

    constructor(private readonly httpService: HttpService) {}

    // 👉 1. A NOVA FUNÇÃO QUE FAZ O LOGIN SOZINHA
    public async gerarToken(): Promise<string> {
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
        observacaoPersonalizada: string = '',
    ) {
        const url = String(process.env.SEVEN_API_URL);
        const dataEntrega = new Date(order.createdAt);
        dataEntrega.setDate(dataEntrega.getDate() + 5);
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
                boFreteAuto: 'NAO',
                vlFretePedidoVenda: Number(order.shippingCost),
                // pcFretePedidoVenda: 0,
                tipoPedidoId: 1,
                status: 'BLOQUEADO',
                planoContaId: '3.1.1.1',
                cfop: cfopCalculado,
                observacao1: `VENDA PELO SITE - PEDIDO #${order.id}`,
                codEmpresa: 1,
                formaPagamento:
                    order.paymentMethod === 'pix' ? 'A VISTA' : 'CARTAO',
                formaCobranca:
                    order.paymentMethod === 'pix'
                        ? 'PIX'
                        : 'CARTAO DE CREDITO REDE',

                tpComissao: 'PEDIDO',
                dataPedido: this.formatDateBR(order.createdAt),
                dataPrevistaEntrega: this.formatDateBR(dataEntrega),

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

                produtos: order.items.map((item: any) => {
                    const corOriginal =
                        item.variant?.attributes?.color ||
                        item.variant?.color ||
                        '';
                    const tamanhoOriginal =
                        item.variant?.attributes?.size ||
                        item.variant?.size ||
                        '';
                    const complementoOriginal =
                        item.variant?.attributes?.complement ||
                        item.variant?.complement ||
                        '';

                    let obsFormatada = '';

                    // 👉 1.5 FORMATA TAMANHO E EXTRA (Novo bônus para o seu ERP)
                    if (
                        tamanhoOriginal &&
                        tamanhoOriginal !== 'Tamanho Único'
                    ) {
                        obsFormatada += `Tamanho: ${tamanhoOriginal} \n`;
                    }
                    if (complementoOriginal) {
                        obsFormatada += `Extra: ${complementoOriginal} \n`;
                    }

                    // 👉 2. FORMATA A COR (Igual você já tinha feito brilhantemente)
                    if (corOriginal.includes('-')) {
                        const [ext, int] = corOriginal.split('-');
                        obsFormatada += `Ext: ${ext.trim().toUpperCase()} - Int: ${int.trim().toUpperCase()}`;
                    } else if (corOriginal && corOriginal !== 'Cor Única') {
                        obsFormatada += `Cor: ${corOriginal.trim().toUpperCase()}`;
                    }

                    // 👉 2.5 LÓGICA DE PRODUTOS PERSONALIZADOS (Continua intacta!)
                    if (item.customData) {
                        const custom =
                            typeof item.customData === 'string'
                                ? JSON.parse(item.customData)
                                : item.customData;

                        let coresFormatadas = 'Nenhuma';
                        if (custom.cores) {
                            coresFormatadas = Object.entries(custom.cores)
                                .map(([chave, valor]) => {
                                    const chaveCapitalizada =
                                        chave.charAt(0).toUpperCase() +
                                        chave.slice(1);
                                    return `${chaveCapitalizada}: ${valor}`;
                                })
                                .join(', ');
                        }

                        const frasePersonalizada = `Modelo: ${custom.modelo}\nTamanho: ${custom.tamanho}\nKit LED: ${custom.kitLed}\nCores: ${coresFormatadas}`;

                        obsFormatada = obsFormatada
                            ? `${obsFormatada}\n\n${frasePersonalizada}`
                            : frasePersonalizada;
                    }

                    let skuOficial = item.variant?.sku || item.product?.sku;
                    if (item.customData) {
                        skuOficial = 'PP021';
                    }

                    // 3. Fallback de segurança para os outros produtos da loja
                    if (!skuOficial) {
                        skuOficial = 'CM002';
                    }
                    // 3. Devolvemos o produto montado para o Seven
                    return {
                        sku: String(skuOficial),
                        quantidade: Number(item.quantity),
                        // O valorTotal da linha é a única coisa que deve ser multiplicada
                        valorTotal: Number(item.price) * Number(item.quantity),

                        // Valor Bruto e Líquido (para o Seven) é sempre o PREÇO DE 1 UNIDADE!
                        valorBruto: Number(item.price),
                        valorLiquido: Number(item.price),

                        percentualDesconto: 0,
                        obsItem: obsFormatada, // 👉 O Seven vai receber a nota bonitinha linha a linha!
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

    async baixarNotaFiscal(pedidoVendaId: string): Promise<Buffer> {
        try {
            // Como estamos dentro do SevenService, ele acha a função autenticar()
            const token = await this.gerarToken();

            const response = await axios.get(
                `https://accionsistemas.com.br:8090/api/resources/v1/downloadNF/linkDanfeNfe/${pedidoVendaId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'arraybuffer', // Fundamental para baixar arquivos
                },
            );

            return Buffer.from(response.data);
        } catch (error: any) {
            // 👈 2. O ': any' aqui resolve o erro "unknown"
            console.error(
                `Erro ao baixar NF do pedido ${pedidoVendaId} no Seven:`,
                error.message,
            );
            throw new Error('Falha ao obter o PDF da Nota Fiscal');
        }
    }
}
