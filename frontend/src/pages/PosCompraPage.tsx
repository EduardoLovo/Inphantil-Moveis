import React, { useRef, useState } from "react";
import {
  FaTools,
  FaShieldAlt,
  FaRecycle,
  FaHandSparkles,
  FaQuestionCircle,
  FaShippingFast,
  FaWhatsapp,
} from "react-icons/fa";

// --- SEÇÕES DE CONTEÚDO ---
const SECTIONS = [
  {
    id: "garantia",
    title: "Política de Garantia",
    icon: FaShieldAlt,
    content: (
      <div className="space-y-6 text-[#313b2f]">
        <div>
          <h2 className="text-2xl font-bold  border-b-2 border-[#cbcfd1] pb-2 mb-4">
            Garantia Inphantil
          </h2>
          <h3 className="text-lg font-bold mt-4 mb-2">
            Política de Trocas, Devoluções e Desistência
          </h3>
          <p className="leading-relaxed mb-4">
            A <strong>INPHANTIL MÓVEIS LTDA</strong> preza pela transparência e
            respeito ao consumidor, e por isso estabelece as seguintes
            diretrizes quanto à troca, devolução e desistência de compras:
          </p>

          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>Garantia Legal:</strong> 90 dias contra defeitos de
              fabricação.
            </li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">
            1. Natureza dos Produtos
          </h3>
          <p className="leading-relaxed mb-4">
            Os produtos comercializados pela INPHANTIL são{" "}
            <strong>personalizados e produzidos sob medida</strong>, conforme as
            especificações e preferências de cada cliente. Por se tratar de
            itens personalizados e não padronizados, não são passíveis de
            revenda em caso de devolução.
          </p>

          <h3 className="text-lg font-bold mt-6 mb-2">
            2. Confirmação da Compra e Produção
          </h3>
          <p className="leading-relaxed mb-4">
            A compra é considerada{" "}
            <strong>confirmada após a compensação do pagamento</strong>, momento
            em que o pedido entra automaticamente em fase de{" "}
            <strong>produção</strong>, conforme solicitado pelo cliente.
          </p>

          <h3 className="text-lg font-bold mt-6 mb-2">
            3. Direito de Arrependimento – INAPLICABILIDADE (art. 49, CDC)
          </h3>
          <p className="leading-relaxed mb-4">
            Conforme jurisprudência do Tribunal de Justiça de São Paulo TJ-SP,
            no Recurso Inominado Cível:{" "}
            <strong>0022737-88.2023.8.26.0002</strong>, o direito de
            arrependimento <strong>não se aplica</strong> à aquisição de
            produtos personalizados ou confeccionados sob encomenda. Assim, uma
            vez iniciado o processo de produção, não será possível o
            cancelamento do pedido por desistência do cliente, nem o reembolso
            dos valores pagos. Assim o art. 49, do Código de Defesa do
            Consumidor, não se aplica a essa categoria de produtos.
          </p>

          <h3 className="text-lg font-bold mt-6 mb-2">
            4. Trocas e Devoluções por Defeito ou Vício de Produto
          </h3>
          <p className="leading-relaxed mb-4">
            Caso o produto apresente{" "}
            <strong>defeito de fabricação ou vício</strong> que comprometa sua
            funcionalidade ou segurança, o cliente deverá entrar em contato com
            nosso atendimento dentro do prazo legal de{" "}
            <strong>90 (noventa) dias</strong> contados do recebimento. Conforme
            prevê o art. 26, II, do CDC. Após análise técnica, será
            providenciado, conforme o caso: • O reparo do produto; • A
            substituição por outro em perfeitas condições; ou • A restituição
            proporcional do valor pago, caso inviável a substituição ou
            conserto.
          </p>

          <h3 className="text-lg font-bold mt-6 mb-2">
            5. Garantia dos Produtos
          </h3>
          <p className="leading-relaxed mb-4">
            A INPHANTIL oferece garantia para seus produtos conforme a natureza
            dos materiais utilizados, respeitando os prazos legais e
            contratuais, nos seguintes termos:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>Espuma:</strong> garantia de <strong>1 (um) ano</strong>{" "}
              contra deformações permanentes ou perda anormal de densidade,
              desde que observadas as condições normais de uso e conservação.
            </li>
            <li>
              <strong>Materiais sintéticos:</strong> garantia de{" "}
              <strong>180 (cento e oitenta) dias</strong> contra defeitos de
              fabricação.
            </li>
          </ul>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4 rounded text-sm">
            <p className="font-bold mb-2">Exclusões da Garantia:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Uso inadequado ou diferente do indicado;</li>
              <li>Exposição a intempéries, umidade ou produtos químicos;</li>
              <li>Montagem incorreta;</li>
              <li>Desgaste natural.</li>
            </ul>
          </div>

          <h3 className="text-lg font-bold mt-6 mb-2">
            7. Canal de Atendimento
          </h3>
          <p className="leading-relaxed">
            Para solicitar suporte, entre em contato pelo nosso canal oficial de
            atendimento via <br />
            <a
              href="https://wa.me/5561982388828"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              <FaWhatsapp /> WhatsApp: (61) 98238-8828
            </a>
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "montagem",
    title: "Instruções de Montagem",
    icon: FaTools,
    content: (
      <div className="space-y-8 text-[#313b2f]">
        <div>
          <h2 className="text-2xl font-bold font-[Poppins] border-b-2 border-[#cbcfd1] pb-2 mb-4">
            Como montar sua Cama Montessoriana
          </h2>
          <p className="mb-4">
            Todos os nossos produtos acompanham manual de instrução impresso e
            kit de ferragens.
          </p>

          <div className="bg-[#fff8e1] border-l-4 border-[#ffd639] p-4 my-6 rounded text-sm">
            <h3 className="font-bold text-base mb-2">⚠️ Dicas Importantes:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Realize a montagem em uma superfície limpa e plana.</li>
              <li>
                Confira todas as peças antes de iniciar (Base, borda, colchão).
              </li>
              <li>Siga a ordem exata dos vídeos abaixo!</li>
            </ul>
          </div>
        </div>

        {/* VÍDEOS DE MONTAGEM */}
        {[
          {
            title: "MONTAGEM DA CAMA PHANT",
            src: "https://www.youtube.com/embed/9qnu3gMKYkc",
          },
          {
            title: "MONTAGEM DO PROTETOR DE PAREDE",
            src: "https://www.youtube.com/embed/Ws2AjL6swaM",
          },
          {
            title: "MONTAGEM DA CABANA MOSQUETEIRO",
            src: "https://www.youtube.com/embed/u6YRKuakPcg",
          },
          {
            title: "MONTAGEM DA CABANA DE BRINCAR",
            src: "https://www.youtube.com/embed/yB_NiRUSdts",
          },
          {
            title: "MONTAGEM DA ÁRVORE DE NATAL",
            src: "https://www.youtube.com/embed/dQ3UifiW1C0",
          },
        ].map((video, idx) => (
          <div key={idx} className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-lg mb-3 uppercase">{video.title}</h3>
            <div className="w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-sm aspect-video">
              <iframe
                className="w-full h-full"
                src={video.src}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "alinhamento",
    title: "Alinhamento da Cama Phant",
    icon: FaShippingFast,
    content: (
      <div className="text-[#313b2f]">
        <h2 className="text-2xl font-bold font-[Poppins] border-b-2 border-[#cbcfd1] pb-2 mb-4">
          Alinhamento da Cama Phant
        </h2>
        <p className="leading-relaxed mb-6">
          Esse é o vídeo de alinhamento da nossa cama. É muito importante que
          seja feito de tempos em tempos, pois irá conservar sua cama sempre
          alinhada.
        </p>
        <div className="w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-sm aspect-video">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/EI-uWTHEtZA"
            title="Alinhamento de Cama Phant"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    ),
  },
  {
    id: "cuidados",
    title: "Limpeza e Cuidados",
    icon: FaHandSparkles,
    content: (
      <div className="text-[#313b2f]">
        <h2 className="text-2xl font-bold font-[Poppins] border-b-2 border-[#cbcfd1] pb-2 mb-6">
          Como cuidar do seu móvel
        </h2>

        <h3 className="font-bold text-lg mb-3">
          Limpeza da Cama, Tapete e Protetor de parede 🚰
        </h3>

        <ul className="list-disc pl-5 space-y-3 mb-8 leading-relaxed">
          <li>
            Para limpar seu produto você deve usar sabão de coco em barra ou
            sabonete neutro ou infantil e uma esponja macia. 🧼🧽🪣
          </li>
          <li>
            Coloque água em um recipiente pequeno com o sabão dentro, umedeça a
            esponja na mistura e passe por toda a peça, deixe agir por 5 minutos
            e depois retire o sabão com um pano molhado.
          </li>
          <li className="font-bold text-red-600">
            ⚠️ NÃO UTILIZAR: Veja, detergente líquido, álcool ou demais produtos
            químicos.
          </li>
          <li>
            Recomendamos retirar o colchão e colocá-lo em local arejado semanal
            ou quinzenalmente para evitar mofo e ácaro.
          </li>
        </ul>

        <div className="w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-sm aspect-video">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/DEH1n_AANnA"
            title="Inphantil Limpeza dos Produtos"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    ),
  },
  {
    id: "entrega",
    title: "Prazos e Entrega",
    icon: FaShippingFast,
    content: (
      <div className="text-[#313b2f]">
        <h2 className="text-2xl font-bold font-[Poppins] border-b-2 border-[#cbcfd1] pb-2 mb-4">
          Sobre sua Entrega
        </h2>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <p className="mb-4 text-lg">
            Nossas entregas são realizadas por transportadoras parceiras
            especializadas em móveis.
          </p>
          <p className="text-lg font-medium text-[#313b2f]">
            🚚 Você receberá o código de rastreio no WhatsApp assim que o
            produto for despachado.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "trocas",
    title: "Trocas e Devoluções",
    icon: FaRecycle,
    content: (
      <div className="text-[#313b2f]">
        <h2 className="text-2xl font-bold font-[Poppins] border-b-2 border-[#cbcfd1] pb-2 mb-4">
          Política de Trocas
        </h2>
        <p className="mb-4">
          Queremos que você ame sua compra! Se precisar trocar:
        </p>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-2">Arrependimento</h4>
            <p className="text-sm">
              Você tem até 7 dias corridos após o recebimento para solicitar a
              devolução (produto desmontado e na embalagem original).
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h4 className="font-bold text-red-800 mb-2">Defeito</h4>
            <p className="text-sm">
              Entre em contato imediatamente enviando fotos do problema para
              nosso WhatsApp.
            </p>
          </div>
        </div>
        <p className="bg-gray-100 p-3 rounded text-center">
          Para iniciar um processo, envie um e-mail para{" "}
          <strong>sac@inphantil.com.br</strong>.
        </p>
      </div>
    ),
  },
  {
    id: "faq",
    title: "Dúvidas Frequentes",
    icon: FaQuestionCircle,
    content: (
      <div className="text-[#313b2f]">
        <h2 className="text-2xl font-bold font-[Poppins] border-b-2 border-[#cbcfd1] pb-2 mb-6">
          Perguntas Comuns
        </h2>
        <div className="space-y-4">
          <details className="group border border-gray-200 rounded-lg p-4 open:bg-gray-50 transition-colors">
            <summary className="font-bold cursor-pointer list-none flex items-center justify-between text-lg">
              As camas suportam quantos quilos?
              <span className="text-[#ffd639] text-2xl group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <p className="mt-3 text-gray-700">
              Nossas camas de solteiro suportam até 110kg por ponto de pressão.
            </p>
          </details>

          <details className="group border border-gray-200 rounded-lg p-4 open:bg-gray-50 transition-colors">
            <summary className="font-bold cursor-pointer list-none flex items-center justify-between text-lg">
              Vocês fazem sob medida?
              <span className="text-[#ffd639] text-2xl group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <p className="mt-3 text-gray-700">
              Sim! Temos opções personalizadas. Entre em contato pelo WhatsApp
              para um orçamento.
            </p>
          </details>
        </div>
      </div>
    ),
  },
];

const PosCompraPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(SECTIONS[0].id);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeSection = SECTIONS.find((s) => s.id === activeTab);

  const handleTabChange = (sectionId: string) => {
    setActiveTab(sectionId);

    setTimeout(() => {
      if (contentRef.current) {
        const elementPosition = contentRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset;
        // Altura do header + um pouco de respiro
        const headerOffset = 100;

        window.scrollTo({
          top: offsetPosition - headerOffset,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <div className="w-full max-w-[90vw] mx-auto px-4 pt-32 pb-20 min-h-[80vh] text-[#313b2f]">
      {/* Header da Página */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-[Poppins] text-[#313b2f] mb-3">
          Central de Ajuda e Pós-Compra
        </h1>
        <p className="text-gray-600 text-lg">
          Tudo o que você precisa saber sobre seu produto Inphantil.
        </p>
      </div>

      {/* Layout Principal (Sidebar + Conteúdo) */}
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* --- SIDEBAR DE NAVEGAÇÃO --- */}
        <aside className="w-full md:w-[280px] bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:sticky md:top-28 md:max-h-[calc(100vh-120px)] md:overflow-y-auto z-10">
          <nav className="flex flex-col gap-1">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => handleTabChange(section.id)}
                className={`
                                    flex items-center w-full px-4 py-3 text-left text-sm md:text-base rounded-lg transition-all duration-200
                                    ${
                                      activeTab === section.id
                                        ? "bg-[#313b2f] text-[#ffd639] font-bold shadow-md"
                                        : "text-[#313b2f] hover:bg-gray-100"
                                    }
                                `}
              >
                <span className="mr-3 text-lg opacity-80">
                  {/* Ícone opcional se quiser reativar: <section.icon /> */}
                </span>
                {section.title}
              </button>
            ))}
          </nav>

          {/* Box de Contato na Sidebar */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">
              Ainda precisa de ajuda?
            </h4>
            <p className="text-sm text-gray-400 mb-2">
              Fale conosco no WhatsApp:
            </p>
            <a
              href="https://wa.me/5561982388828"
              target="_blank"
              rel="noreferrer"
              className="text-green-600 font-bold hover:underline block text-lg"
            >
              (61) 98238-8828
            </a>
          </div>
        </aside>

        {/* --- ÁREA DE CONTEÚDO --- */}
        <main
          className="flex-1 w-full bg-white p-6 md:p-10 rounded-xl border border-gray-100 shadow-sm min-h-[500px]"
          ref={contentRef}
        >
          <div
            className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            key={activeTab}
          >
            {activeSection?.content}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PosCompraPage;
