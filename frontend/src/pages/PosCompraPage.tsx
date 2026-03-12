import React, { useState } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaQrcode,
  FaCopy,
  FaBoxOpen,
  FaArrowRight,
} from "react-icons/fa";

const PosCompraPage: React.FC = () => {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  // Recupera os dados que enviámos lá do CheckoutPage
  const state = location.state as {
    isSuccess?: boolean;
    method?: "credit" | "debit" | "pix";
    orderId?: string | number;
    transactionId?: string;
    qrCodeUrl?: string;
    pixCode?: string;
  };

  // Se a pessoa tentou aceder a esta página diretamente sem comprar nada, mandamos para a Home
  if (!state || !state.isSuccess) {
    return <Navigate to="/" replace />;
  }

  const isPix = state.method === "pix";

  const handleCopyPix = () => {
    if (state.pixCode) {
      navigator.clipboard.writeText(state.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-gray-50">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
        {/* CABEÇALHO DE SUCESSO (Muda de cor dependendo do método) */}
        <div
          className={`p-8 text-center ${isPix ? "bg-green-500" : "bg-[#ffd639]"}`}
        >
          <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg mb-4 animate-bounce">
            {isPix ? (
              <FaQrcode className="text-4xl text-green-500" />
            ) : (
              <FaCheckCircle className="text-4xl text-[#313b2f]" />
            )}
          </div>
          <h1
            className={`text-3xl font-bold ${isPix ? "text-white" : "text-[#313b2f]"}`}
          >
            {isPix ? "Pedido Gerado!" : "Pagamento Aprovado!"}
          </h1>
          <p
            className={`mt-2 ${isPix ? "text-green-50" : "text-[#313b2f]/80"} font-medium`}
          >
            O seu pedido{" "}
            <strong className="bg-white/30 px-2 py-1 rounded text-black">
              #{state.orderId}
            </strong>{" "}
            foi processado com sucesso.
          </p>
        </div>

        {/* CORPO DO CONTEÚDO */}
        <div className="p-8">
          {/* TELA SE FOR PIX */}
          {isPix && (
            <div className="text-center space-y-6">
              <p className="text-gray-600">
                Escaneie o QR Code abaixo com o aplicativo do seu banco para
                finalizar o pagamento. A aprovação é imediata!
              </p>

              <div className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-2xl inline-block shadow-sm">
                <img
                  src={state.qrCodeUrl}
                  alt="QR Code Pix"
                  className="w-48 h-48 mx-auto"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-500 uppercase">
                  Ou copie o código Pix
                </p>
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                  <input
                    type="text"
                    readOnly
                    value={state.pixCode}
                    className="flex-1 bg-transparent text-sm text-gray-500 outline-none px-2 truncate"
                  />
                  <button
                    onClick={handleCopyPix}
                    className={`p-3 rounded-lg text-white font-bold transition-all flex items-center gap-2 ${
                      copied
                        ? "bg-green-500"
                        : "bg-[#313b2f] hover:bg-[#1a2019]"
                    }`}
                  >
                    {copied ? <FaCheckCircle /> : <FaCopy />}
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TELA SE FOR CARTÃO */}
          {!isPix && (
            <div className="text-center space-y-6">
              <p className="text-gray-600 text-lg">
                Tudo certo com o seu pagamento! Já estamos a preparar a sua
                encomenda com muito carinho.
              </p>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center gap-3">
                <FaBoxOpen className="text-5xl text-gray-300" />
                <p className="text-sm text-gray-500">
                  Você receberá as atualizações de envio no seu e-mail
                  cadastrado.
                </p>
                {state.transactionId && (
                  <p className="text-xs text-gray-400 mt-2 font-mono">
                    ID da Transação: {state.transactionId}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* BOTÕES DE AÇÃO COMUNS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/meus-pedidos"
              className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all text-center flex items-center justify-center gap-2"
            >
              Ver meus pedidos
            </Link>
            <Link
              to="/products"
              className="px-6 py-3 rounded-xl bg-[#313b2f] text-white font-bold hover:bg-[#ffd639] hover:text-[#313b2f] transition-all shadow-md text-center flex items-center justify-center gap-2"
            >
              Continuar Comprando <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosCompraPage;
