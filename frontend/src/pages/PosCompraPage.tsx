import React, { useRef, useState } from 'react';
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
                        <p>
                            <strong> WhatsApp: (61) 98238-8828</strong>
                        </p>
                    </li>
                </ul>
            </div>
        ),
    },
    {
        id: 'montagem',
        title: 'Instruções de Montagem',
        icon: FaTools,
        content: (
            <div className="pos-compra-div">
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
                    </ul>
                </div>

                <div>
                    <h3>MONTAGEM DA CAMA PHANT</h3>
                    <p>
                        Este é o vídeo de montagem da cama, é importante seguir
                        os passos nele descritos, não alterando a ordem de
                        montagem!
                    </p>
                    <div className="video-responsive">
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
                    </div>
                </div>
                <hr />
                <div>
                    <h3>MONTAGEM DO PROTETOR DE PAREDE</h3>
                    <p>
                        Este é o vídeo de montagem do protetor de parede, é
                        importante seguir os passos nele descritos, não
                        alterando a ordem de montagem!
                    </p>
                    <div className="video-responsive">
                        <iframe
                            width="753"
                            height="480"
                            src="https://www.youtube.com/embed/Ws2AjL6swaM"
                            title="Montagem do Protetor de Parede"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
                <hr />
                <div>
                    <h3>MONTAGEM DA CABANA MOSQUETEIRO</h3>
                    <p>
                        Este é o vídeo de montagem da Cabana Mosqueteiro, é
                        importante seguir os passos nele descritos, não
                        alterando a ordem de montagem!
                    </p>
                    <div className="video-responsive">
                        <iframe
                            width="753"
                            height="480"
                            src="https://www.youtube.com/embed/u6YRKuakPcg"
                            title="Montagem da Cabana Mosquiteiro"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
                <hr />
                <div>
                    <h3>MONTAGEM DA CABANA DE BRINCAR</h3>
                    <p>
                        Este é o vídeo de montagem da Cabana de Brincar, é
                        importante seguir os passos nele descritos, não
                        alterando a ordem de montagem!
                    </p>
                    <div className="video-responsive">
                        <iframe
                            width="753"
                            height="480"
                            src="https://www.youtube.com/embed/yB_NiRUSdts"
                            title="Cabana de Brincar"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
                <hr />
                <div>
                    <h3>MONTAGEM DA ÁRVORE DE NATAL</h3>
                    <p>
                        Este é o vídeo de montagem da Árvore de Natal, é
                        importante seguir os passos nele descritos, não
                        alterando a ordem de montagem!
                    </p>
                    <div className="video-responsive">
                        <iframe
                            width="753"
                            height="480"
                            src="https://www.youtube.com/embed/dQ3UifiW1C0"
                            title="Montagem da Árvore de Natal Interativa"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'alinhamento',
        title: 'Alinhamento da Cama Phant',
        icon: FaShippingFast,
        content: (
            <div>
                <h2>Alinhamento da Cama Phant</h2>
                <p>
                    Esse é o vídeo de alinhamento da nossa cama. É muito
                    importante que seja feito de tempos em tempos, pois irá
                    conservar sua cama sempre alinhada.
                </p>
                <div className="video-responsive">
                    <iframe
                        width="753"
                        height="480"
                        src="https://www.youtube.com/embed/EI-uWTHEtZA"
                        title="Alinhamento de Cama Phant"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        ),
    },
    {
        id: 'cuidados',
        title: 'Limpeza e Cuidados',
        icon: FaHandSparkles,
        content: (
            <div>
                <ul>
                    <h2>Como cuidar do seu móvel</h2>
                    <li>Limpeza da Cama, Tapete e Protetor de parede 🚰</li>

                    <li>
                        Para limpar seu produto você deve usar sabão de coco em
                        barra ou sabonete neutro ou infantil e uma esponja
                        macia. 🧼🧽🪣
                    </li>
                    <li>
                        Coloque água em um recipiente pequeno com o sabão
                        dentro, umedeça a esponja na mistura e passe por toda a
                        peça, deixe agir por 5 minutos e depois retire o sabão
                        com um pano molhado, repita por algumas vezes até
                        retirar todo sabão. Essa limpeza deve ser feita semanal
                        ou quinzenalmente. No dia a dia utilize apenas um pano
                        úmido com água.
                    </li>
                    <li>
                        ⚠️ NÃO UTILIZAR: Veja, detergente líquido, álcool ou
                        demais produtos químicos, pois são agressivos aos
                        materiais utilizados e à saúde de seu filho!
                    </li>
                    <li>
                        Recomendamos retirar o colchão e colocá-lo em local
                        arejado semanal ou quinzenalmente para evitar que haja
                        proliferação de Mofo e Ácaro. Caso o produto fique em
                        local de alta umidade realizar esse procedimento
                        semanalmente. Utilizar um protetor impermeável auxilia a
                        manter a integridade do colchão, pois evita que absorva
                        líquidos que porventura venha a cair sobre o colchão. Em
                        cidades muito úmidas o tapete de drenagem abaixo do
                        colchão ajuda na ventilação🚱
                    </li>
                    <li>
                        Sua cama já vai higienizada e pronta para uso, indicamos
                        apenas este cuidado com o colchão!
                    </li>
                </ul>
                <div className="video-responsive">
                    <iframe
                        width="753"
                        height="480"
                        src="https://www.youtube.com/embed/DEH1n_AANnA"
                        title="Inphantil Limpeza dos Produtos"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>
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
                    Você receberá o código de rastreio no whatsapp assim que o
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
            <div className="perguntas-comuns">
                <h2>Perguntas Comuns</h2>
                <details>
                    <summary>As camas suportam quantos quilos?</summary>
                    <p>
                        Nossas camas de solteiro suportam até 110kg por ponto de
                        pressão.
                    </p>
                </details>
                <details>
                    <summary>Vocês fazem sob medida?</summary>
                    <p>
                        Sim! Temos opções personalizadas. Entre em contato pelo
                        WhatsApp para um orçamento.
                    </p>
                </details>
            </div>
        ),
    },
];

const PosCompraPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(SECTIONS[0].id);
    const contentRef = useRef<HTMLDivElement>(null);
    // Encontra o objeto da seção ativa
    const activeSection = SECTIONS.find((s) => s.id === activeTab);
    const handleTabChange = (sectionId: string) => {
        setActiveTab(sectionId);

        setTimeout(() => {
            if (contentRef.current) {
                // 1. Descobre a posição do elemento na página
                const elementPosition =
                    contentRef.current.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset;

                // 2. Define o ajuste (Quanto mais alto o número, mais "para cima" ele vai)
                // 130px costuma ser ideal (Altura do Header ~100px + 30px de respiro)
                const headerOffset = 100;

                // 3. Rola suavemente para a posição ajustada
                window.scrollTo({
                    top: offsetPosition - headerOffset,
                    behavior: 'smooth',
                });
            }
        }, 100);
    };
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
                                onClick={() => handleTabChange(section.id)}
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
                            href="https://wa.me/5561982388828"
                            target="_blank"
                            rel="noreferrer"
                            className="contact-link"
                        >
                            (61) 98238-8828
                        </a>
                    </div>
                </aside>

                {/* ÁREA DE CONTEÚDO */}
                <main className="pc-content-area" ref={contentRef}>
                    <div className="fade-in-content" key={activeTab}>
                        {activeSection?.content}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PosCompraPage;
