import React, { useState } from "react";
import { api } from "../../services/api";
import { searchCep } from "../../services/cepService";

const ShippingQuoteRequestPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Estado para guardar erros de validação
  const [errors, setErrors] = useState<{ customerCpf?: string }>({});

  const [formData, setFormData] = useState({
    customerName: "",
    customerCpf: "",
    customerZipCode: "",
    customerAddress: "",
    addressNumber: "",
    customerNeighborhood: "",
    customerCity: "",
    customerState: "",
    quoteDetails: "",
  });

  // --- FUNÇÕES DE MÁSCARA E VALIDAÇÃO ---

  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove tudo o que não é dígito
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o terceiro e o quarto dígitos
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o terceiro e o quarto dígitos de novo (para o segundo bloco de números)
      .replace(/(\d{3})(\d{1,2})/, "$1-$2") // Coloca um hífen entre o terceiro e o quarto dígitos
      .replace(/(-\d{2})\d+?$/, "$1"); // Impede de digitar mais de 11 números
  };

  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove tudo o que não é dígito
      .replace(/(\d{5})(\d)/, "$1-$2") // Coloca hífen depois do 5º dígito (Padrão BR: 00000-000)
      .replace(/(-\d{3})\d+?$/, "$1"); // Impede de digitar mais caracteres
  };

  // Algoritmo oficial de validação de CPF
  const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf === "" || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf))
      return false;

    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;

    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  // --- HANDLERS ---

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let { name, value } = e.target;

    // Aplica as máscaras conforme o usuário digita
    if (name === "customerCpf") {
      value = maskCPF(value);
      // Limpa o erro ao digitar
      if (errors.customerCpf)
        setErrors((prev) => ({ ...prev, customerCpf: undefined }));
    }
    if (name === "customerZipCode") {
      value = maskCEP(value);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepBlur = async () => {
    const cleanCep = formData.customerZipCode.replace(/\D/g, "");
    // Valida se tem 8 dígitos
    if (cleanCep.length < 8) return;

    setLoading(true);
    const data = await searchCep(formData.customerZipCode);
    setLoading(false);

    if (data && !data.erro) {
      setFormData((prev) => ({
        ...prev,
        customerAddress: data.logradouro,
        customerNeighborhood: data.bairro,
        customerCity: data.localidade,
        customerState: data.uf,
      }));
      document.getElementById("addressNumber")?.focus();
    } else {
      alert("CEP não encontrado!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação final do CPF antes de enviar
    if (formData.customerCpf && !validateCPF(formData.customerCpf)) {
      setErrors({ customerCpf: "CPF Inválido" });
      document.getElementById("cpfInput")?.focus();
      return;
    }
    if (!formData.customerCpf) {
      setErrors({});
    }
    setLoading(true);
    setSuccessMsg("");

    try {
      const fullAddress = `${formData.customerAddress}, ${formData.addressNumber} - ${formData.customerNeighborhood}`;

      const payload = {
        customerName: formData.customerName,
        customerCpf: formData.customerCpf,
        customerZipCode: formData.customerZipCode,
        customerAddress: fullAddress,
        customerCity: formData.customerCity,
        customerState: formData.customerState,
        quoteDetails: formData.quoteDetails,
      };

      await api.post("/shipping-quote", payload);

      setSuccessMsg("Solicitação enviada com sucesso!");
      setFormData({
        customerName: "",
        customerCpf: "",
        customerZipCode: "",
        customerAddress: "",
        addressNumber: "",
        customerNeighborhood: "",
        customerCity: "",
        customerState: "",
        quoteDetails: "",
      });

      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar solicitação.");
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";
  const inputClass =
    "w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all";
  const errorInputClass =
    "w-full p-2.5 border border-red-500 rounded-md focus:ring-2 focus:ring-red-500 outline-none transition-all bg-red-50";
  const readOnlyInputClass = `${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`;

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Nova Cotação de Frete
      </h2>
      <p className="text-gray-600 mb-6">
        Preencha os dados do cliente e os itens para orçamento.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div>
          <label className={labelClass}>Nome do Cliente</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Ex: Ana Souza"
            className={inputClass}
          />
        </div>

        {/* CPF com Validação e Máscara */}
        <div>
          <label className={labelClass}>CPF</label>
          <input
            id="cpfInput"
            type="text"
            name="customerCpf"
            value={formData.customerCpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            className={errors.customerCpf ? errorInputClass : inputClass} // Muda a cor se tiver erro
            maxLength={14}
          />
          {errors.customerCpf && (
            <span className="text-red-500 text-xs font-bold mt-1">
              {errors.customerCpf}
            </span>
          )}
        </div>

        {/* CEP com Máscara e Busca Automática */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>CEP</label>
            <input
              type="text"
              name="customerZipCode"
              value={formData.customerZipCode}
              onChange={handleChange}
              onBlur={handleCepBlur}
              required
              placeholder="00000-000"
              maxLength={9} // 8 números + 1 hífen
              className={inputClass}
            />
          </div>

          <div className="md:col-span-3">
            <label className={labelClass}>Cidade</label>
            <input
              type="text"
              name="customerCity"
              value={formData.customerCity}
              readOnly
              className={readOnlyInputClass}
            />
          </div>

          <div className="md:col-span-1">
            <label className={labelClass}>UF</label>
            <input
              type="text"
              name="customerState"
              value={formData.customerState}
              readOnly
              className={readOnlyInputClass}
            />
          </div>
        </div>

        {/* Endereço */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className={labelClass}>Endereço (Rua)</label>
            <input
              type="text"
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-1">
            <label className={labelClass}>Número</label>
            <input
              id="addressNumber"
              type="text"
              name="addressNumber"
              value={formData.addressNumber}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Bairro */}
        <div>
          <label className={labelClass}>Bairro</label>
          <input
            type="text"
            name="customerNeighborhood"
            value={formData.customerNeighborhood}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Detalhes */}
        <div>
          <label className={labelClass}>O que está sendo orçado?</label>
          <textarea
            name="quoteDetails"
            value={formData.quoteDetails}
            onChange={handleChange}
            rows={5}
            placeholder="Ex: Cama Casinha Solteiro Branca + Colchão + 2 Rolos laterais..."
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 p-3 font-bold text-white rounded-md transition-colors 
            ${
              loading
                ? "bg-gray-400 cursor-wait"
                : "bg-green-600 hover:bg-green-700 shadow-sm"
            }`}
        >
          {loading ? "Buscando/Enviando..." : "Enviar Solicitação"}
        </button>
      </form>
      {successMsg && (
        <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded mb-6 text-center font-medium animate-pulse">
          {successMsg}
        </div>
      )}
    </div>
  );
};

export default ShippingQuoteRequestPage;
