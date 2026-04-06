import React, { useEffect, useState, useMemo } from "react";
import { useCartStore } from "../store/CartStore";
import { api, processCreditCardPayment } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaSpinner,
  FaTrash,
  FaPlus,
  FaCreditCard,
  FaQrcode,
  FaTruck,
  FaWhatsapp,
} from "react-icons/fa";
import type { Address } from "../types/address";
import AddressForm from "../components/AddressForm";
import { useOrderStore } from "../store/OrderStore";
import { useAuthStore } from "../store/AuthStore";

// --- FUNÇÕES E LISTAS AUXILIARES PARA O FRETE ---
const normalizeString = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// Mapeamento das capitais que possuem regras específicas (já normalizadas)
const CAPITALS: Record<string, string> = {
  MS: "campo grande",
  MT: "cuiaba",
  GO: "goiania",
  MA: "sao luis",
  PI: "teresina",
  CE: "fortaleza",
  RN: "natal",
  PB: "joao pessoa",
  PE: "recife",
  AL: "maceio",
  SE: "aracaju",
};

const formatPrice = (val: number) =>
  Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CheckoutPage: React.FC = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const navigate = useNavigate();

  // Estados de Pagamento
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "pix">(
    "credit",
  );
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpMonth, setCardExpMonth] = useState("");
  const [cardExpYear, setCardExpYear] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState("1");

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const { user } = useAuthStore();
  const [cpf, setCpf] = useState(user?.cpf || "");

  // Estados de Endereço e UX
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Estado do Modal de Cotação de Frete
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/addresses");
      setAddresses(response.data);

      if (response.data.length > 0 && !selectedAddressId) {
        const defaultAddr = response.data.find((a: Address) => a.isDefault);
        setSelectedAddressId(
          defaultAddr ? defaultAddr.id : response.data[0].id,
        );
      } else if (response.data.length === 0) {
        setSelectedAddressId(null);
      }
    } catch (err) {
      setError("Erro ao carregar endereços.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteAddress = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja excluir este endereço?")) {
      try {
        await api.delete(`/addresses/${id}`);
        if (selectedAddressId === id) setSelectedAddressId(null);
        fetchAddresses();
      } catch (error) {
        alert("Erro ao excluir endereço.");
      }
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(value);
  };

  const handleAddressSuccess = () => {
    setShowAddressModal(false);
    fetchAddresses();
  };

  // ==========================================
  // LÓGICA DE FRETE DINÂMICO E PRAZOS
  // ==========================================
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const shippingData = useMemo(() => {
    if (!selectedAddress || !selectedAddress.state) {
      return { percentage: 0, days: null, requiresQuote: false };
    }

    const uf = selectedAddress.state.trim().toUpperCase();
    const city = normalizeString(selectedAddress.city || "");

    const ALWAYS_QUOTE = ["RO", "AC", "PA", "AM", "RR", "AP", "TO", "DF"];
    if (ALWAYS_QUOTE.includes(uf)) {
      return { percentage: 0, days: null, requiresQuote: true };
    }

    const isCapital = (stateUf: string) => {
      const capital = CAPITALS[stateUf];
      return capital ? city === capital : false;
    };

    if (["MS", "MT", "GO"].includes(uf)) {
      if (isCapital(uf))
        return { percentage: 13, days: 10, requiresQuote: false };
      return { percentage: 0, days: null, requiresQuote: true };
    }

    if (["MA", "PI", "CE", "RN", "PB", "PE", "AL", "SE"].includes(uf)) {
      if (isCapital(uf))
        return { percentage: 15, days: 15, requiresQuote: false };
      return { percentage: 0, days: null, requiresQuote: true };
    }

    if (uf === "SC") return { percentage: 12, days: 10, requiresQuote: false };
    if (["PR", "SP"].includes(uf))
      return { percentage: 10, days: 10, requiresQuote: false };
    if (uf === "RJ") return { percentage: 15, days: 10, requiresQuote: false };
    if (["RS", "ES", "MG"].includes(uf))
      return { percentage: 13, days: 10, requiresQuote: false };
    if (uf === "BA") return { percentage: 13, days: 15, requiresQuote: false };
    if (uf === "DF") return { percentage: 8, days: 10, requiresQuote: false };

    return { percentage: 0, days: null, requiresQuote: true };
  }, [selectedAddress]);

  const subtotal = getTotal();
  const shippingCost =
    selectedAddress && !shippingData.requiresQuote
      ? (subtotal * shippingData.percentage) / 100
      : 0;
  const finalTotal = subtotal + shippingCost;
  // ==========================================

  // ==========================================
  // FUNÇÃO PARA MONTAR A MENSAGEM DO WHATSAPP
  // ==========================================
  const generateWhatsAppMessage = () => {
    const saudacao = user?.name ? `Olá, me chamo *${user.name}*!` : `Olá!`;

    let msg = `${saudacao} Estou no site e gostaria de realizar a cotação de frete para o meu pedido.\n\n`;

    msg += `*🛒 Meu Carrinho:*\n`;
    items.forEach((item) => {
      let detalhes = "";
      if (item.selectedVariant) {
        const parts = [];
        if (item.selectedVariant.size)
          parts.push(`Tam: ${item.selectedVariant.size}`);
        if (
          item.selectedVariant.color &&
          item.selectedVariant.color !== "Cor Única"
        )
          parts.push(`Cor: ${item.selectedVariant.color}`);
        if (item.selectedVariant.complement)
          parts.push(`Extra: ${item.selectedVariant.complement}`);

        if (parts.length > 0) {
          detalhes = ` (${parts.join(" | ")})`;
        }
      }
      msg += `- ${item.quantity}x ${item.name}${detalhes}\n`;
    });

    if (selectedAddress) {
      msg += `\n*📍 Meu Endereço:*\n`;
      msg += `${selectedAddress.street}, ${selectedAddress.number}${selectedAddress.complement ? ` - ${selectedAddress.complement}` : ""}\n`;
      msg += `Bairro: ${selectedAddress.neighborhood}\n`;
      msg += `CEP: ${selectedAddress.zipCode} (${selectedAddress.city}/${selectedAddress.state})`;
    }

    return encodeURIComponent(msg);
  };
  // ==========================================

  const handleCheckout = async () => {
    setPaymentError("");
    setIsProcessingPayment(true);

    try {
      if (!selectedAddressId)
        throw new Error("Por favor, selecione um endereço de entrega.");
      if (!cpf || cpf.length < 14)
        throw new Error("Por favor, preencha um CPF válido para continuarmos.");

      const orderPayload = {
        addressId: selectedAddressId,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          variantId: item.selectedVariant ? item.selectedVariant.id : null,
          customData: item.customData,
        })),
        cpf: cpf,
        shippingCost: shippingCost,
      };

      const newOrder = await createOrder(orderPayload);
      const orderId = newOrder.id;

      if (paymentMethod === "credit") {
        const paymentResponse = await processCreditCardPayment({
          orderId: String(orderId),
          amount: finalTotal,
          cardData: {
            holderName: cardName,
            number: cardNumber.replace(/\D/g, ""),
            expMonth: cardExpMonth,
            expYear: cardExpYear,
            cvv: cardCvv,
            installments: installments,
          },
        });

        if (paymentResponse.success) {
          clearCart();
          navigate("/pos-compra", {
            state: {
              isSuccess: true,
              method: paymentMethod,
              orderId: orderId,
              transactionId: paymentResponse.transactionId,
            },
          });
        }
      } else if (paymentMethod === "pix") {
        const pixResponse = await api.post("/payment/pix", {
          orderId: String(orderId),
          amount: finalTotal,
        });

        const pixData = pixResponse.data;

        console.log("🔍 DADOS DO PIX DA REDE:", pixData);

        if (pixData && pixData.returnCode === "00") {
          // 👉 1. CAPTURANDO A IMAGEM EM BASE64
          // Colocamos o prefixo 'data:image/png;base64,' para o HTML conseguir desenhar a foto!
          const base64Image = pixData.qrCodeResponse?.qrCodeImage;
          const qrCodeImageLink = base64Image
            ? `data:image/png;base64,${base64Image}`
            : "";

          // 👉 2. CAPTURANDO O CÓDIGO COPIA E COLA
          const copiaECola = pixData.qrCodeResponse?.qrCodeData || "";

          clearCart();
          navigate("/pos-compra", {
            state: {
              isSuccess: true,
              method: "pix",
              orderId: orderId,
              // Manda a nossa imagem montada (ou um tapa-buraco de segurança se der erro)
              qrCodeUrl:
                qrCodeImageLink ||
                "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
              // Manda o código oficial
              pixCode: copiaECola,
            },
          });
        } else {
          throw new Error("Não foi possível gerar o código Pix neste momento.");
        }
      }
    } catch (error: any) {
      console.error(error);
      setPaymentError(
        error.response?.data?.message ||
          error.message ||
          "Erro ao processar o pagamento. Verifique os dados.",
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 py-8 md:pt-32 pb-20 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="bg-gray-50 p-12 rounded-2xl border border-dashed border-gray-300 text-center w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Seu carrinho está vazio.
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#313b2f] text-white font-bold rounded-full hover:bg-[#ffd639] hover:text-[#313b2f] transition-all shadow-md"
          >
            Voltar ao Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8 md:pt-32 pb-20 min-h-[70vh]">
      {isProcessingPayment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-[#313b2f] p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm mx-4 text-center transform transition-all animate-in zoom-in-95 duration-300 border border-[#ffd639]/20">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#ffd639] blur-xl opacity-20 rounded-full animate-pulse"></div>
              <FaSpinner className="relative animate-spin text-6xl text-[#ffd639]" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
              Processando o pagamento...
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Estamos a finalizar o seu pedido de forma segura. <br />
              <span className="font-bold text-[#ffd639]">
                Por favor, não feche nem recarregue esta página.
              </span>{" "}
              🔒
            </p>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-[#313b2f] mb-8">
        Finalizar Compra
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-100 gap-4">
              <h2 className="text-xl font-bold text-[#313b2f] flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#ffd639]" /> Endereço de
                Entrega
              </h2>
              <button
                className="flex items-center gap-2 text-sm font-bold text-[#007bff] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                onClick={() => setShowAddressModal(true)}
              >
                <FaPlus size={12} /> Novo Endereço
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10 text-gray-400">
                <FaSpinner className="animate-spin text-3xl text-[#ffd639]" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">
                  Você não tem endereços cadastrados.
                </p>
                <button
                  className="bg-[#313b2f] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#ffd639] hover:text-[#313b2f] transition-colors"
                  onClick={() => setShowAddressModal(true)}
                >
                  Cadastrar Endereço
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? "border-[#ffd639] bg-yellow-50/30 shadow-md"
                        : "border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <strong className="text-[#313b2f] font-bold block pr-8">
                        {addr.recipientName}
                      </strong>
                      <button
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        onClick={(e) => handleDeleteAddress(e, addr.id)}
                        title="Excluir endereço"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        {addr.street}, {addr.number}{" "}
                        {addr.complement && `- ${addr.complement}`}
                      </p>
                      <p>
                        {addr.neighborhood} - {addr.city}/{addr.state}
                      </p>
                      <p className="font-mono text-gray-500 mt-2">
                        CEP: {addr.zipCode}
                      </p>
                    </div>
                    {addr.isDefault && (
                      <span className="absolute bottom-4 right-4 text-[10px] uppercase font-bold bg-[#313b2f] text-white px-2 py-1 rounded">
                        Padrão
                      </span>
                    )}
                    {selectedAddressId === addr.id && (
                      <div className="absolute -top-3 -right-3 bg-green-500 text-white p-1 rounded-full shadow-md">
                        <FaCheckCircle size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-lg lg:sticky lg:top-32">
            <h2 className="text-xl font-bold text-[#313b2f] mb-6 pb-4 border-b border-gray-100">
              Resumo do Pedido
            </h2>

            <div className="space-y-4 mb-6 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex justify-between items-start gap-4 text-sm"
                >
                  <div className="flex-1">
                    <span className="font-bold text-gray-800">
                      {item.quantity}x
                    </span>{" "}
                    <span className="text-gray-600 font-medium">
                      {item.name}
                    </span>
                    {item.selectedVariant && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        {item.selectedVariant.color !== "Cor Única" &&
                          `Cor: ${item.selectedVariant.color} | `}
                        Tam: {item.selectedVariant.size}
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-[#313b2f]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-dashed border-gray-200 mb-8">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-500 text-sm items-center">
                <span className="flex items-center gap-1.5">
                  <FaTruck /> Frete{" "}
                  {selectedAddress && !shippingData.requiresQuote
                    ? `(${shippingData.percentage}%)`
                    : ""}
                </span>
                <span className="font-medium text-[#313b2f] text-right">
                  {!selectedAddress ? (
                    "Selecione o endereço"
                  ) : shippingData.requiresQuote ? (
                    <span className="text-orange-500 font-bold">
                      Sob Consulta
                    </span>
                  ) : (
                    <>
                      {formatPrice(shippingCost)}
                      <span className="block text-xs text-gray-400 font-normal">
                        Prazo: {shippingData.days} dias úteis
                      </span>
                    </>
                  )}
                </span>
              </div>

              <div className="flex justify-between items-end pt-4 border-t border-gray-100 mt-4">
                <span className="font-bold text-lg text-[#313b2f]">Total</span>
                <span className="font-bold text-3xl text-[#313b2f]">
                  {shippingData.requiresQuote
                    ? "Sob Consulta"
                    : formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 mb-4 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div
              className={`mb-6 transition-opacity ${shippingData.requiresQuote ? "opacity-30 pointer-events-none" : ""}`}
            >
              <h3 className="text-lg font-bold text-[#313b2f] mb-4">
                Método de Pagamento
              </h3>

              {!user?.cpf && (
                <div className="mb-6 animate-in fade-in duration-300">
                  <h3 className="text-lg font-bold text-[#313b2f] mb-3">
                    Dados Pessoais
                  </h3>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">
                      CPF (Obrigatório para a Nota Fiscal)
                    </label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={handleCpfChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod("credit")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === "credit" ? "border-[#ffd639] bg-yellow-50 text-[#313b2f]" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                >
                  <FaCreditCard className="mb-1 text-xl" />
                  <span className="text-xs font-bold">Crédito</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("pix")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === "pix" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                >
                  <FaQrcode className="mb-1 text-xl" />
                  <span className="text-xs font-bold">Pix</span>
                </button>
              </div>
            </div>

            {paymentError && (
              <div className="p-3 mb-4 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium text-center">
                {paymentError}
              </div>
            )}

            {!shippingData.requiresQuote && paymentMethod === "credit" && (
              <div className="space-y-3 mb-6 animate-in fade-in duration-300">
                <input
                  type="text"
                  placeholder="Nome impresso no cartão"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  maxLength={50}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all"
                />
                <input
                  type="text"
                  placeholder="Número do Cartão"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all"
                />
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Mês (Ex: 12)"
                    value={cardExpMonth}
                    onChange={(e) => setCardExpMonth(e.target.value)}
                    maxLength={2}
                    className="w-1/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Ano (Ex: 2029)"
                    value={cardExpYear}
                    onChange={(e) => setCardExpYear(e.target.value)}
                    maxLength={4}
                    className="w-1/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    maxLength={4}
                    className="w-1/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="mt-3">
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}x de {formatPrice(finalTotal / num)} (Sem juros)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {!shippingData.requiresQuote && paymentMethod === "pix" && (
              <div className="bg-green-50 p-5 rounded-xl border border-green-200 text-center mb-6 animate-in fade-in duration-300">
                <FaQrcode className="mx-auto text-4xl text-green-600 mb-3" />
                <p className="text-green-800 font-bold mb-1">
                  Aprovação imediata!
                </p>
                <p className="text-sm text-green-700">
                  O QR Code e o código "Copia e Cola" serão gerados na próxima
                  tela assim que você finalizar o pedido.
                </p>
              </div>
            )}

            {shippingData.requiresQuote && selectedAddress ? (
              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 text-lg shadow-md"
              >
                <FaWhatsapp size={24} /> Cotar Frete
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={isProcessingPayment || !selectedAddressId}
                className="w-full py-4 bg-[#ffd639] text-[#313b2f] font-bold rounded-xl hover:bg-[#e6c235] hover:-translate-y-1 shadow-md transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isProcessingPayment ? (
                  <>
                    <FaSpinner className="animate-spin" /> Processando...
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> Finalizar Compra
                  </>
                )}
              </button>
            )}

            {!selectedAddressId && (
              <p className="text-xs text-red-500 text-center mt-3">
                Selecione um endereço para continuar.
              </p>
            )}
          </div>
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <AddressForm
              onSuccess={handleAddressSuccess}
              onCancel={() => setShowAddressModal(false)}
            />
          </div>
        </div>
      )}

      {/* --- MODAL DE COTAÇÃO DE FRETE (WHATSAPP) --- */}
      {showQuoteModal && selectedAddress && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <FaTruck className="text-3xl text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-[#313b2f] mb-2">
              Frete Especial
            </h3>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Para a sua região ({selectedAddress.city}/{selectedAddress.state}
              ), precisamos realizar uma cotação especial com a transportadora
              para garantir o melhor valor!
            </p>

            <a
              href={`https://wa.me/5561982388828?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors flex justify-center items-center gap-2 mb-3"
              onClick={() => setShowQuoteModal(false)}
            >
              <FaWhatsapp size={20} /> Falar com Atendente
            </a>

            <button
              onClick={() => setShowQuoteModal(false)}
              className="w-full py-3 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-colors text-sm"
            >
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
