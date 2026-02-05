import React, { useEffect, useState } from "react";
import { useCartStore } from "../store/CartStore";
import { api } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaSpinner,
  FaTrash,
  FaArrowLeft,
  FaPlus,
  FaBoxOpen,
} from "react-icons/fa";
import type { Address } from "../types/address";
import AddressForm from "../components/AddressForm";
import axios from "axios";

const CheckoutPage: React.FC = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);

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
  }, []);

  const handleDeleteAddress = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja excluir este endereço?")) {
      try {
        await api.delete(`/addresses/${id}`);
        if (selectedAddressId === id) {
          setSelectedAddressId(null);
        }
        fetchAddresses();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          alert(error.response.data.message);
        } else {
          alert("Erro ao excluir endereço.");
        }
      }
    }
  };

  const handleAddressSuccess = () => {
    setShowAddressModal(false);
    fetchAddresses();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Por favor, selecione um endereço de entrega.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        addressId: selectedAddressId,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      await api.post("/orders", payload);
      clearCart();
      alert("Pedido realizado com sucesso!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erro ao finalizar pedido.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <FaBoxOpen className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-[#313b2f] mb-2">
          Seu carrinho está vazio.
        </h2>
        <p className="text-gray-500 mb-6">
          Adicione itens ao carrinho para finalizar a compra.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ffd639] text-[#313b2f] font-bold rounded-lg hover:bg-[#e6c235] transition-colors shadow-sm"
        >
          <FaArrowLeft /> Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8 md:pt-32 pb-20">
      <h1 className="text-3xl font-bold text-[#313b2f] mb-8 border-b border-gray-100 pb-4">
        Finalizar Compra
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ESQUERDA: ENDEREÇOS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#313b2f] flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#ffd639]" /> Endereço de Entrega
            </h2>
            <button
              onClick={() => setShowAddressModal(true)}
              className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <FaPlus /> Novo
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8 text-gray-500 animate-pulse">
              <FaSpinner className="animate-spin text-2xl mr-2" /> Carregando
              endereços...
            </div>
          ) : addresses.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-500 mb-4">
                Você não tem endereços cadastrados.
              </p>
              <button
                onClick={() => setShowAddressModal(true)}
                className="px-6 py-2 bg-[#313b2f] text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
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
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedAddressId === addr.id
                      ? "border-[#ffd639] bg-yellow-50/30 ring-1 ring-[#ffd639]"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <strong className="text-[#313b2f] font-bold">
                      {addr.recipientName}
                    </strong>
                    <button
                      onClick={(e) => handleDeleteAddress(e, addr.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      title="Excluir"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      {addr.street}, {addr.number} {addr.complement}
                    </p>
                    <p>
                      {addr.neighborhood} - {addr.city}/{addr.state}
                    </p>
                    <p>CEP: {addr.zipCode}</p>
                  </div>
                  {addr.isDefault && (
                    <span className="inline-block mt-3 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded">
                      Padrão
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DIREITA: RESUMO */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg lg:sticky lg:top-32">
            <h2 className="text-xl font-bold text-[#313b2f] mb-6 pb-4 border-b border-gray-100">
              Resumo do Pedido
            </h2>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    <span className="font-bold text-[#313b2f]">
                      {item.quantity}x
                    </span>{" "}
                    {item.name}
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-200 pt-4 mt-4 space-y-2">
              <div className="flex justify-between items-center text-lg font-bold text-[#313b2f]">
                <span>Total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                <FaCheckCircle className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={submitting || !selectedAddressId}
              className="w-full mt-6 py-4 bg-[#ffd639] text-[#313b2f] font-bold rounded-xl hover:bg-[#e6c235] hover:-translate-y-1 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" /> Processando...
                </>
              ) : (
                <>
                  <FaCheckCircle /> Confirmar Pedido
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE ENDEREÇO */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Novo Endereço</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <AddressForm
                onSuccess={handleAddressSuccess}
                onCancel={() => setShowAddressModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
