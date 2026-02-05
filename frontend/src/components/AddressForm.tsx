import React, { useState, useRef } from "react";
import { api } from "../services/api";
import axios from "axios";
import { FaSpinner, FaMapMarkerAlt, FaTimes } from "react-icons/fa";

interface AddressFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [error, setError] = useState("");

  const overlayRef = useRef<HTMLDivElement>(null);

  // Estados do Formulário
  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [recipientName, setRecipientName] = useState("");

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onCancel();
    }
  };

  const handleBlurCep = async () => {
    const cep = zipCode.replace(/\D/g, "");
    if (cep.length !== 8) return;

    setCepLoading(true);
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        setError("CEP não encontrado.");
        return;
      }
      setStreet(response.data.logradouro);
      setNeighborhood(response.data.bairro);
      setCity(response.data.localidade);
      setState(response.data.uf);
      setError("");
    } catch (err) {
      setError("Erro ao buscar CEP.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/addresses", {
        recipientName,
        zipCode,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        isDefault: false,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao salvar endereço.");
    } finally {
      setLoading(false);
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    setZipCode(value);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 border border-gray-100">
        {/* Header */}
        <div className="bg-[#313b2f] p-5 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#ffd639]" /> Novo Endereço
          </h3>
          <button
            onClick={onCancel}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 space-y-5 overflow-y-auto max-h-[80vh]"
        >
          {/* Quem Recebe */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Quem vai receber?
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Ex: Maria Silva"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all text-sm"
            />
          </div>

          {/* CEP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                CEP
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  onBlur={handleBlurCep}
                  placeholder="00000-000"
                  maxLength={9}
                  required
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all text-sm"
                />
                {cepLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#313b2f]">
                    <FaSpinner className="animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Endereço Principal */}
          <div className="grid grid-cols-4 gap-5">
            <div className="col-span-3">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Rua / Logradouro
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all text-sm bg-gray-50"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Número
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Complemento e Bairro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Complemento (Opcional)
              </label>
              <input
                type="text"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                placeholder="Apto, Bloco..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Bairro
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all text-sm bg-gray-50"
              />
            </div>
          </div>

          {/* Cidade e UF */}
          <div className="grid grid-cols-4 gap-5">
            <div className="col-span-3">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all text-sm bg-gray-50"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                UF
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                maxLength={2}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all text-sm bg-gray-50 uppercase"
              />
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-3 bg-white text-gray-600 font-bold rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#313b2f] text-white font-bold rounded-xl hover:bg-[#ffd639] hover:text-[#313b2f] transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Salvando...
                </>
              ) : (
                "Salvar Endereço"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
