import React, { useState } from 'react';
import {
    FaTools,
    FaShieldAlt,
    FaRecycle,
    FaHandSparkles,
    FaQuestionCircle,
    FaShippingFast,
} from 'react-icons/fa';
import './PosCompraPage.css';

// Definição das seções de conteúdo
const SECTIONS = [
    {
        id: 'montagem',
        title: 'Instruções de Montagem',
        icon: FaTools,
        content: (
            <div>
                <h2>Como montar sua Cama Montessoriana</h2>
                <p>
                    Todos os nossos produtos acompanham manual de instrução
                    impresso e kit de ferragens.
                </p>

                <div className="info-card-highlight">
                    <h3>⚠️ Dicas Importantes:</h3>
                    <ul>
                        <li>
                            Realize a montagem em uma superfície limpa e plana.
                        </li>

                        <li>
                            Confira todas as peças antes de iniciar (Base,
                            borda, colchão).
                        </li>

                        <li>
                            Este é o vídeo de montagem da cama, é importante
                            seguir os passos nele descritos, não alterando a
                            ordem de montagem!
                        </li>

                        <iframe
                            width="753"
                            height="480"
                            src="https://www.youtube.com/embed/9qnu3gMKYkc"
                            title="Montagem da Cama Montessoriana Phant"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </ul>
                </div>

                <h3>Vídeos Tutoriais</h3>
                <p>
                    Acesse nosso canal no YouTube para ver o passo a passo
                    detalhado:
                </p>
                <button className="action-btn-outline">
                    Ver Canal no YouTube
                </button>
            </div>
        ),
    },
    {
        id: 'garantia',
        title: 'Política de Garantia',
        icon: FaShieldAlt,
        content: (
            <div>
                <h2>Garantia Inphantil</h2>
                <h3>Política de Trocas, Devoluções e Desistência</h3>
                <p>
                    A <strong>INPHANTIL MÓVEIS LTDA</strong> preza pela
                    transparência e respeito ao consumidor, e por isso
                    estabelece as seguintes diretrizes quanto à troca, devolução
                    e desistência de compras:
                </p>
                <ul>
                    <li>
                        <strong>Garantia Legal:</strong> 90 dias contra defeitos
                        de fabricação.
                    </li>
                    <h3>1. Natureza dos Produtos</h3>
                    <li>
                        Os produtos comercializados pela INPHANTIL são
                        <strong> personalizados e produzidos sob medida</strong>
                        , conforme as especificações e preferências de cada
                        cliente. Por se tratar de itens personalizados e não
                        padronizados, não são passíveis de revenda em caso de
                        devolução.
                    </li>
                    <h3>2. Confirmação da Compra e Produção</h3>
                    <li>
                        A compra é considerada{' '}
                        <strong>
                            confirmada após a compensação do pagamento
                        </strong>
                        , momento em que o pedido entra automaticamente em fase
                        de
                        <strong> produção</strong>, conforme solicitado pelo
                        cliente.
                    </li>
                    <h3>
                        3. Direito de Arrependimento – INAPLICABILIDADE (art.
                        49, CDC)
                    </h3>
                    <li>
                        Conforme jurisprudência do Tribunal de Justiça de São
                        Paulo TJ-SP, no Recurso Inominado Cível:
                        <strong>0022737-88.2023.8.26.0002</strong>, o direito de
                        arrependimento
                        <strong> não se aplica </strong>à aquisição de produtos
                        personalizados ou confeccionados sob encomenda. Assim,
                        uma vez iniciado o processo de produção, não será
                        possível o cancelamento do pedido por desistência do
                        cliente, nem o reembolso dos valores pagos. Assim o art.
                        49, do Código de Defesa do Consumidor, não se aplica a
                        essa categoria de produtos.
                    </li>
                    <h3>
                        4. Trocas e Devoluções por Defeito ou Vício de Produto
                    </h3>
                    <li>
                        Caso o produto apresente
                        <strong> defeito de fabricação ou vício </strong>
                        que comprometa sua funcionalidade ou segurança, o
                        cliente deverá entrar em contato com nosso atendimento
                        dentro do prazo legal de
                        <strong> 90 (noventa) dias </strong>
                        contados do recebimento, conforme prevê o art. 26, II,
                        do CDC. Após análise técnica, será providenciado,
                        conforme o caso: • O reparo do produto; • A substituição
                        por outro em perfeitas condições; ou • A restituição
                        proporcional do valor pago, caso inviável a substituição
                        ou conserto.
                    </li>
                    <h3>5. Garantia dos Produtos</h3>
                    <li>
                        A INPHANTIL oferece garantia para seus produtos conforme
                        a natureza dos materiais utilizados, respeitando os
                        prazos legais e contratuais, nos seguintes termos:
                    </li>
                    <li>
                        <strong>Espuma: </strong>
                        garantia de
                        <strong> 1 (um) ano </strong>
                        contra deformações permanentes ou perda anormal de
                        densidade, desde que observadas as condições normais de
                        uso e conservação.
                    </li>
                    <li>
                        <strong>Materiais sintéticos </strong>
                        (como tecidos, couranos e similares): garantia de
                        <strong> 180 (cento e oitenta) dias</strong>, limitada a
                        defeitos de fabricação como rasgos espontâneos,
                        descolamento ou desgaste anormal fora das condições
                        esperadas de uso.
                    </li>
                    A garantia cobre exclusivamente
                    <strong> defeitos de fabricação</strong>. Ficam excluídos da
                    cobertura os danos decorrentes de:
                    <li>
                        Uso inadequado ou diferente daquele indicado nas
                        orientações de uso e manutenção fornecidas pela
                        INPHANTIL;
                    </li>
                    <li>
                        Exposição a intempéries, umidade excessiva, calor
                        intenso, agentes químicos ou produtos de limpeza não
                        recomendados;
                    </li>
                    <li>
                        Montagem incorreta, quando não realizada conforme as
                        instruções fornecidas;
                    </li>
                    <li>
                        Desgaste natural pelo uso regular. Durante o período de
                        garantia, constatado o defeito de fabricação, a
                        INPHANTIL poderá, a seu critério, realizar o conserto, a
                        substituição da parte afetada ou do produto.
                    </li>
                    <h3>6. Condições para Atendimento de Reclamações</h3>
                    <li>
                        Para análise de qualquer reclamação, é imprescindível
                        que:
                        <ul>
                            <li>
                                O produto seja apresentado sem sinais de uso
                                indevido;
                            </li>
                            <li>
                                Sejam fornecidos fotos e/ou vídeos que comprovem
                                o alegado defeito;
                            </li>
                            <li>
                                O cliente esteja dentro do prazo legal e
                                contratual de garantia.
                            </li>
                        </ul>
                    </li>
                    <h3>7. Canal de Atendimento</h3>
                    <li>
                        Para solicitar suporte, entre em contato pelo nosso
                        canal oficial de atendimento via
                        <strong> WhatsApp: (61) 9 8238-8828</strong>
                    </li>
                </ul>
            </div>
        ),
    },
    {
        id: 'cuidados',
        title: 'Limpeza e Cuidados',
        icon: FaHandSparkles,
        content: (
            <div>
                <h2>Como cuidar do seu móvel</h2>
                <p>
                    Para manter a beleza e durabilidade da madeira e dos
                    tecidos:
                </p>
                <h3>Madeira / MDF</h3>
                <p>
                    Utilize apenas um pano levemente umedecido com água, seguido
                    de um pano seco. Não use lustra-móveis ou solventes.
                </p>
                <h3>Tecidos (Sintéticos e Algodão)</h3>
                <p>
                    Para limpezas leves, use aspirador de pó ou escova de cerdas
                    macias. Em caso de manchas, utilize sabão neutro e água, sem
                    encharcar.
                </p>
            </div>
        ),
    },
    {
        id: 'entrega',
        title: 'Prazos e Entrega',
        icon: FaShippingFast,
        content: (
            <div>
                <h2>Sobre sua Entrega</h2>
                <p>
                    Nossas entregas são realizadas por transportadoras parceiras
                    especializadas em móveis.
                </p>
                <p>
                    O prazo informado no carrinho conta a partir da{' '}
                    <strong>confirmação do pagamento</strong> + o tempo de
                    produção (se for sob encomenda).
                </p>
                <p>
                    Você receberá o código de rastreio por e-mail assim que o
                    produto for despachado.
                </p>
            </div>
        ),
    },
    {
        id: 'trocas',
        title: 'Trocas e Devoluções',
        icon: FaRecycle,
        content: (
            <div>
                <h2>Política de Trocas</h2>
                <p>Queremos que você ame sua compra! Se precisar trocar:</p>
                <ul>
                    <li>
                        <strong>Arrependimento:</strong> Você tem até 7 dias
                        corridos após o recebimento para solicitar a devolução
                        (o produto deve estar desmontado e na embalagem
                        original).
                    </li>
                    <li>
                        <strong>Defeito:</strong> Entre em contato imediatamente
                        enviando fotos do problema para nosso WhatsApp.
                    </li>
                </ul>
                <p>
                    Para iniciar um processo, envie um e-mail para{' '}
                    <strong>sac@inphantil.com.br</strong>.
                </p>
            </div>
        ),
    },
    {
        id: 'faq',
        title: 'Dúvidas Frequentes',
        icon: FaQuestionCircle,
        content: (
            <div>
                <h2>Perguntas Comuns</h2>
                <details>
                    <summary>As camas suportam quantos quilos?</summary>
                    <p>
                        Nossas camas de solteiro suportam até 100kg
                        distribuídos. As de casal/queen suportam até 220kg.
                    </p>
                </details>
                <details>
                    <summary>Vocês fazem sob medida?</summary>
                    <p>
                        Sim! Temos opções personalizadas. Entre em contato pelo
                        WhatsApp para um orçamento.
                    </p>
                </details>
                <details>
                    <summary>Onde vejo o status do meu pedido?</summary>
                    <p>
                        Acesse a área "Dashboard" no topo do site e faça login
                        para ver o status em tempo real.
                    </p>
                </details>
            </div>
        ),
    },
];

const PosCompraPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(SECTIONS[0].id);

    // Encontra o objeto da seção ativa
    const activeSection = SECTIONS.find((s) => s.id === activeTab);

    return (
        <div className="pos-compra-container">
            <div className="pos-compra-header">
                <h1>Central de Ajuda e Pós-Compra</h1>
                <p>
                    Tudo o que você precisa saber sobre seu produto Inphantil.
                </p>
            </div>

            <div className="pos-compra-layout">
                {/* MENU LATERAL (Sidebar) */}
                <aside className="pc-sidebar">
                    <nav>
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                className={`pc-menu-btn ${
                                    activeTab === section.id ? 'active' : ''
                                }`}
                                onClick={() => setActiveTab(section.id)}
                            >
                                {/* <section.Icon className="pc-icon" /> */}
                                {section.title}
                            </button>
                        ))}
                    </nav>

                    <div className="pc-contact-box">
                        <h4>Ainda precisa de ajuda?</h4>
                        <p>Fale conosco no WhatsApp:</p>
                        <a
                            href="https://wa.me/5544999999999"
                            target="_blank"
                            rel="noreferrer"
                            className="contact-link"
                        >
                            (44) 99999-9999
                        </a>
                    </div>
                </aside>

                {/* ÁREA DE CONTEÚDO */}
                <main className="pc-content-area">
                    <div className="fade-in-content" key={activeTab}>
                        {activeSection?.content}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PosCompraPage;
