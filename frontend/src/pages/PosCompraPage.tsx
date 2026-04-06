import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { api } from "../services/api"; // Sua configuração do Axios
import { FaCheckCircle, FaSpinner, FaCopy } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const PosCompraPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as any;

  // Se a pessoa tentou entrar nessa página digitando a URL direto, mandamos pro Início
  useEffect(() => {
    if (!state || !state.orderId) {
      navigate("/");
    }
  }, [state, navigate]);

  const [orderStatus, setOrderStatus] = useState<string>("PENDING");
  const [isChecking, setIsChecking] = useState(false);

  // =========================================================
  // ⏱️ A MÁGICA DO POLLING (VERIFICANDO O PAGAMENTO)
  // =========================================================
  // =========================================================
  // ⏱️ A MÁGICA DO POLLING (VERIFICANDO O PAGAMENTO)
  // =========================================================
  useEffect(() => {
    // Se não for Pix ou já estiver pago, não precisa fazer o cronômetro
    if (state?.method !== "pix" || orderStatus === "PAID") return;

    const checkPaymentStatus = async () => {
      try {
        setIsChecking(true);
        // Bate na sua rota do backend que retorna os dados do pedido
        const response = await api.get(`/orders/${state.orderId}`);
        const currentStatus = response.data.status;

        if (currentStatus === "PAID") {
          setOrderStatus("PAID");
          toast.success("Pagamento confirmado! 🎉");
        }
      } catch (error: any) {
        // Ignora o erro silenciosamente se for o 429 (Rate Limit do servidor pedindo pra esperar)
        if (error.response?.status !== 429) {
          console.error("Erro ao verificar status do pedido:", error);
        }
      } finally {
        setIsChecking(false);
      }
    };

    // 👉 AUMENTAMOS PARA 10 SEGUNDOS (10000ms) para não sobrecarregar o seu servidor
    const intervalId = setInterval(checkPaymentStatus, 10000);

    // Quando o usuário sair da página ou o pedido for pago, nós "destruímos" o cronômetro
    return () => clearInterval(intervalId);
  }, [state?.orderId, state?.method, orderStatus]);
  // =========================================================

  const handleCopyPix = () => {
    if (state?.pixCode) {
      navigator.clipboard.writeText(state.pixCode);
      toast.success("Código Copia e Cola copiado!");
    }
  };

  if (!state) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-16 md:pt-32 min-h-[70vh] flex flex-col items-center">
      <Toaster />

      {/* TELA DE SUCESSO DEFINITIVO (CARTÃO OU PIX PAGO) */}
      {state.method === "credit" || orderStatus === "PAID" ? (
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-green-100 shadow-xl text-center w-full animate-in zoom-in duration-500">
          <div className="w-24 h-24 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-[#313b2f] mb-4">
            Pagamento Confirmado!
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Oba! Já recebemos o seu pagamento referente ao pedido{" "}
            <strong>#{state.orderId}</strong>. Estamos preparando tudo com muito
            carinho para você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/meus-pedidos"
              className="px-8 py-3 bg-[#313b2f] text-white font-bold rounded-xl hover:bg-[#ffd639] hover:text-[#313b2f] transition-all shadow-md"
            >
              Acompanhar Pedido
            </Link>
            <Link
              to="/loja"
              className="px-8 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
            >
              Voltar para a Loja
            </Link>
          </div>
        </div>
      ) : (
        /* TELA DE ESPERA DO PIX (QR CODE) */
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl text-center w-full animate-in fade-in duration-500">
          <h1 className="text-2xl font-bold text-[#313b2f] mb-2">
            Aguardando Pagamento...
          </h1>
          <p className="text-gray-500 mb-8">
            Abra o app do seu banco e escaneie o QR Code ou use a opção Pix
            Copia e Cola.
          </p>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 inline-block mb-6 relative">
            <img
              src={state.qrCodeUrl}
              alt="QR Code do Pix"
              className="w-48 h-48 mx-auto mix-blend-multiply"
            />
            {/* Efeitinho de "Escaneando" enquanto espera */}
            <div className="absolute inset-0 border-2 border-[#ffd639] rounded-2xl animate-pulse opacity-50 pointer-events-none"></div>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <p className="text-sm font-bold text-gray-600 mb-2 text-left">
              Pix Copia e Cola:
            </p>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={state.pixCode}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-l-xl px-4 py-3 text-sm text-gray-500 outline-none truncate"
              />
              <button
                onClick={handleCopyPix}
                className="bg-[#313b2f] text-white px-6 py-3 rounded-r-xl hover:bg-[#ffd639] hover:text-[#313b2f] transition-colors flex items-center gap-2 font-bold"
              >
                <FaCopy /> Copiar
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-orange-500 font-medium bg-orange-50 py-3 px-6 rounded-xl ">
            <FaSpinner
              className={`text-xl ${isChecking ? "animate-spin" : ""}`}
            />
            Aguardando a confirmação do banco...
          </div>
        </div>
      )}
    </div>
  );
};

export default PosCompraPage;
