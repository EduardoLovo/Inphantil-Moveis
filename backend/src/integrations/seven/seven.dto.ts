// src/integrations/seven/seven.dto.ts

export interface SevenEnderecoDTO {
    cep: string;
    endereco: string;
    numero: string;
    bairro: string;
    complemento?: string;
    cidade: string;
    uf: string;
    cnpjCpf: string;
}

export interface SevenClienteDTO {
    regimeTributacao: string;
    tipoTributacao: string;
    razaoSocial: string;
    nomeFantasia: string;
    limiteCreditoId: number;
    cpfCnpjCliente: string;
    endereco: SevenEnderecoDTO;
}

export interface SevenItemDTO {
    sku: string;
    quantidade: number;
    valorTotal: number;
    valorBruto: number;
    valorLiquido: number;
    percentualDesconto: number;
}

export interface SevenPedidoVendaRequestDTO {
    codigo: string;
    valorTotalPedido: number;
    valorTotalProdutos: number;
    valorTotalServicos: number;
    tipoPedidoId: number;
    status: 'ABERTO' | 'BLOQUEADO';
    planoContaId: string;
    cfop: string;
    formaPagamento: string;
    dataPedido: string; // Formato DD/MM/YYYY
    formaCobranca: string;
    tpComissao: 'PEDIDO' | 'PRODUTO';
    cliente: SevenClienteDTO;
    produtos: SevenItemDTO[];
    enderecoEntrega: SevenEnderecoDTO;
    // Vendedor é obrigatório na doc, criamos um Vendedor "E-commerce" genérico
    vendedor: {
        nome: string;
        cpfCnpjCliente: string;
        endereco: SevenEnderecoDTO;
    };
}
