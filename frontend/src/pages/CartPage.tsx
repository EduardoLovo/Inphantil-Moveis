import React from "react";
import { useCartStore } from "../store/CartStore";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowRight,
  FaShoppingCart,
  FaStore,
} from "react-icons/fa";

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();
  const navigate = useNavigate();

  const total = getTotal();
  const formatPrice = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8 md:pt-32 pb-20 min-h-[70vh]">
      <h1 className="text-3xl font-bold text-[#313b2f]  mb-8 flex items-center gap-3">
        <FaShoppingCart className="text-[#ffd639]" /> Meu Carrinho
      </h1>

      {items.length === 0 ? (
        // --- CARRINHO VAZIO ---
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center animate-in fade-in zoom-in duration-300">
          <div className="bg-white p-6 rounded-full shadow-sm mb-6">
            <FaShoppingCart className="text-6xl text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-gray-500 mb-8 max-w-md">
            Parece que você ainda não adicionou nenhum item. Explore nossa loja
            para encontrar produtos incríveis!
          </p>
          <Link
            to="/products"
            className="flex items-center gap-2 px-8 py-3 bg-[#313b2f] text-white font-bold rounded-full hover:bg-[#ffd639] hover:text-[#313b2f] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <FaStore /> Ir para a Loja
          </Link>
        </div>
      ) : (
        // --- CONTEÚDO DO CARRINHO ---
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Itens (Esquerda) */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-shadow"
              >
                {/* Imagem do Produto (Placeholder se não tiver) */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                      Sem Imagem
                    </div>
                  )}
                </div>

                {/* Detalhes */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-[#313b2f] text-lg mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    Preço unitário: {formatPrice(item.price)}
                  </p>
                </div>

                {/* Controles */}
                <div className="flex items-center gap-4">
                  {/* Quantidade */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="px-3 py-2 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="w-10 text-center font-bold text-[#313b2f]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[100px]">
                    <p className="font-bold text-lg text-[#313b2f]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Remover */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 p-2 transition-colors rounded-full hover:bg-red-50"
                    title="Remover item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo do Pedido (Direita - Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg lg:sticky lg:top-32">
              <h2 className="text-xl font-bold text-[#313b2f] mb-6 pb-4 border-b border-gray-100">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Frete</span>
                  <span className="text-green-600 font-medium">Grátis</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-dashed border-gray-200 mt-4">
                  <span className="font-bold text-lg text-[#313b2f]">
                    Total
                  </span>
                  <span className="font-bold text-2xl text-[#313b2f]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full py-4 bg-[#ffd639] text-[#313b2f] font-bold rounded-xl hover:bg-[#e6c235] hover:-translate-y-1 shadow-md transition-all flex items-center justify-center gap-2 text-lg mb-3"
              >
                Finalizar Compra <FaArrowRight />
              </button>

              <button
                onClick={clearCart}
                className="w-full py-2 text-sm text-gray-400 hover:text-red-500 underline transition-colors flex items-center justify-center gap-2"
              >
                <FaTrash size={12} /> Esvaziar Carrinho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
