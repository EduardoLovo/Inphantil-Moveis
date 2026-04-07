import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../services/api";

const PagamentoPendentePage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Estados principais
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Estados das telas de pagamento
  const [pixData, setPixData] = useState<any>(null);
  const [showCardForm, setShowCardForm] = useState(false);

  // Estado do formulário do cartão
  const [cardData, setCardData] = useState({
    holderName: "",
    number: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    installments: "1",
  });

  useEffect(() => {
    const buscarPedido = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        toast.error("Erro ao buscar o pedido.");
        navigate("/meus-pedidos");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) buscarPedido();
  }, [orderId, navigate]);

  // =========================================================
  // 🟢 GERAÇÃO DO PIX
  // =========================================================
  const handleGerarPix = async () => {
    try {
      setIsProcessing(true);
      toast.loading("Gerando QR Code...", { id: "pagamento" });

      // 👉 CORREÇÃO: Removido o 'S' de payments. Agora bate certinho no seu @Controller('payment')
      const response = await api.post(`/payment/pix/${order.id}`);

      // Salva os dados para mostrar na tela (Base64 da imagem e o Copia e Cola)
      setPixData({
        qrCodeUrl: response.data.qrCodeUrl,
        pixCode: response.data.pixCode,
      });

      toast.success("Pix gerado com sucesso!", { id: "pagamento" });
    } catch (error) {
      console.error(error);
      toast.error("Falha ao gerar o Pix. Verifique o servidor.", {
        id: "pagamento",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // =========================================================
  // 💳 PROCESSAMENTO DO CARTÃO
  // =========================================================
  // =========================================================
  // 💳 PROCESSAMENTO DO CARTÃO
  // =========================================================
  const handleProcessarCartao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      toast.loading("Processando pagamento...", { id: "pagamento" });

      // 1. Guardamos a resposta do seu backend em uma variável
      const response = await api.post(`/payment/credit-card`, {
        orderId: String(order.id),
        amount: Number(order.total), // 👈 AQUI ESTÁ A CHAVE DE ACESSO!
        cardData: {
          holderName: cardData.holderName,
          number: cardData.number,
          expMonth: cardData.expMonth,
          expYear: cardData.expYear,
          cvv: cardData.cvv,
          installments: Number(cardData.installments),
        },
      });

      // 👉 A CORREÇÃO ESTÁ AQUI: Verificamos se a Rede realmente aprovou!
      if (response.data && response.data.success === false) {
        // Se a Rede recusou (ex: success: false), nós forçamos o React a ir para o bloco de ERRO (catch)
        throw new Error(
          response.data.message || "Cartão recusado pela operadora.",
        );
      }

      // Se passou pela trava acima, é porque a Rede aprovou e o servidor já mudou pra PAGO e mandou pro Seven!
      toast.success("Pagamento aprovado!", { id: "pagamento" });

      // Redireciona para a tela de Pós Compra
      navigate("/pos-compra", {
        state: { orderId: order.id, method: "credit" },
      });
    } catch (error: any) {
      console.log("🚨 MOTIVO DA RECUSA DO NESTJS:", error.response?.data);
      console.error(error);
      // Pega a mensagem exata de recusa da Rede (ou do erro que forçamos acima)
      const msgErro =
        error.message ||
        error.response?.data?.message ||
        "Cartão recusado ou erro no sistema.";
      toast.error(msgErro, { id: "pagamento" });
    } finally {
      setIsProcessing(false);
    }
  };

  // =========================================================
  // TELAS DE CARREGAMENTO E ERROS
  // =========================================================
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#313b2f]"></div>
      </div>
    );
  }

  if (order?.status !== "PENDING") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Este pedido não está aguardando pagamento.
        </h2>
        <p className="text-gray-500 mb-6">Status atual: {order?.status}</p>
        <button
          onClick={() => navigate("/meus-pedidos")}
          className="bg-[#313b2f] text-white px-6 py-2 rounded-lg font-bold"
        >
          Voltar para Meus Pedidos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Toaster />
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all">
        <h1 className="text-3xl font-black text-[#313b2f] mb-2 text-center">
          Concluir Pagamento
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Pedido #{order.id} no valor de{" "}
          <strong className="text-gray-800">
            R$ {Number(order.total).toFixed(2).replace(".", ",")}
          </strong>
        </p>

        {/* ==============================================
            TELA 1: MOSTRA O QR CODE DO PIX
        ============================================== */}
        {pixData ? (
          <div className="flex flex-col items-center gap-6 p-4 animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-green-600">
              Pague agora com Pix
            </h2>
            <p className="text-gray-600 text-center">
              Escaneie o código abaixo com o app do seu banco:
            </p>

            <img
              src={pixData.qrCodeUrl}
              alt="QR Code Pix"
              className="w-56 h-56 border-4 border-gray-100 rounded-xl shadow-sm"
            />

            <div className="w-full mt-2">
              <p className="text-sm font-bold text-gray-700 mb-2">
                Pix Copia e Cola:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={pixData.pixCode}
                  readOnly
                  className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-600 outline-none truncate"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(pixData.pixCode);
                    toast.success("Código copiado!");
                  }}
                  className="px-8 py-4 bg-[#313b2f] hover:bg-[#ffd639] hover:text-[#313b2f] text-white font-bold rounded-xl transition-colors whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
            </div>
            <p className="text-sm text-orange-500 font-medium mt-4 animate-pulse">
              Aguardando a confirmação do banco...
            </p>
          </div>
        ) : /* ==============================================
            TELA 2: MOSTRA O FORMULÁRIO DO CARTÃO
        ============================================== */
        showCardForm ? (
          <form
            onSubmit={handleProcessarCartao}
            className="space-y-4 animate-in slide-in-from-right duration-300"
          >
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Nome impresso no cartão
              </label>
              <input
                required
                type="text"
                value={cardData.holderName}
                onChange={(e) =>
                  setCardData({ ...cardData, holderName: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500"
                placeholder="Ex: JOAO M DA SILVA"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Número do Cartão
              </label>
              <input
                required
                type="text"
                maxLength={19}
                value={cardData.number}
                onChange={(e) =>
                  setCardData({ ...cardData, number: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500"
                placeholder="0000 0000 0000 0000"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Mês (MM)
                </label>
                <input
                  required
                  type="text"
                  maxLength={2}
                  value={cardData.expMonth}
                  onChange={(e) =>
                    setCardData({ ...cardData, expMonth: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500"
                  placeholder="12"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Ano (AAAA)
                </label>
                <input
                  required
                  type="text"
                  maxLength={4}
                  value={cardData.expYear}
                  onChange={(e) =>
                    setCardData({ ...cardData, expYear: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500"
                  placeholder="29"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  required
                  type="text"
                  maxLength={4}
                  value={cardData.cvv}
                  onChange={(e) =>
                    setCardData({ ...cardData, cvv: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500"
                  placeholder="123"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Parcelamento
              </label>
              <select
                value={cardData.installments}
                onChange={(e) =>
                  setCardData({ ...cardData, installments: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 bg-white"
              >
                <option value="1">
                  1x de R$ {Number(order.total).toFixed(2).replace(".", ",")}
                </option>
                <option value="2">2x sem juros</option>
                <option value="3">3x sem juros</option>
              </select>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowCardForm(false)}
                className="px-6 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-4 bg-[#313b2f] hover:bg-[#1a2019] text-[#ffd639] font-bold rounded-xl shadow-md disabled:opacity-50 transition-colors"
              >
                {isProcessing ? "Processando..." : "Confirmar Pagamento"}
              </button>
            </div>
          </form>
        ) : (
          /* ==============================================
            TELA 3: OS BOTÕES INICIAIS DE ESCOLHA
        ============================================== */
          <div className="flex flex-col gap-4 animate-in fade-in">
            <button
              disabled={isProcessing}
              onClick={handleGerarPix}
              className="w-full p-6 flex flex-col items-center justify-center border-2 border-green-500 rounded-2xl hover:bg-green-50 transition-colors group"
            >
              <span className="text-green-600 font-bold text-xl mb-1">
                Pagar com Pix
              </span>
              <span className="text-sm text-gray-500">
                Aprovação imediata (Gera QR Code)
              </span>
            </button>

            <button
              disabled={isProcessing}
              onClick={() => setShowCardForm(true)}
              className="w-full p-6 flex flex-col items-center justify-center border-2 border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span className="text-gray-700 font-bold text-xl mb-1">
                Pagar com Cartão de Crédito
              </span>
              <span className="text-sm text-gray-500">
                Parcele em até 10x sem juros
              </span>
            </button>
          </div>
        )}

        {/* Botão de voltar */}
        {!showCardForm && !pixData && (
          <button
            onClick={() => navigate("/meus-pedidos")}
            className="mt-8 font-medium text-gray-500 hover:text-gray-800 underline transition-colors block mx-auto"
          >
            Voltar para Meus Pedidos
          </button>
        )}
      </div>
    </div>
  );
};

export default PagamentoPendentePage;
