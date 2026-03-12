import React from "react";
import { useCartStore } from "../store/CartStore";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore"; // Importe o seu AuthStore
import { useState } from "react";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowRight,
  FaUserLock,
  FaShoppingCart,
  FaStore,
} from "react-icons/fa";

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Criamos a variável isAuthenticated na hora:
  // Se existir um user, é true. Se for null, é false.
  const isAuthenticated = !!user;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true); // Se não estiver logado, abre o modal
    } else {
      navigate("/checkout"); // Se estiver, vai direto pro pagamento
    }
  };
  const total = getTotal();
  const formatPrice = (val: number) =>
    Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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
            {items.map((item) => {
              // --- LÓGICA DA IMAGEM DA VARIANTE ---
              let displayImage = item.mainImage; // Começa com a imagem base do produto

              // 1. Tenta pegar a primeira imagem do array de imagens da Variação
              if (
                item.selectedVariant?.images &&
                item.selectedVariant.images.length > 0
              ) {
                displayImage = item.selectedVariant.images[0].url;
              }
              // 2. Fallback caso você tenha dados antigos no banco (imageUrl singular)
              else if ((item.selectedVariant as any)?.imageUrl) {
                displayImage = (item.selectedVariant as any).imageUrl;
              }

              return (
                <div
                  key={item.cartItemId}
                  className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-shadow"
                >
                  {/* Imagem do Produto */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                    {displayImage ? (
                      <img
                        src={displayImage}
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

                    {/* Exibe Cor e Tamanho se for uma variação */}
                    {item.selectedVariant && (
                      <div className="text-xs text-gray-600 bg-gray-100 inline-block px-3 py-1.5 rounded-lg mb-2 border border-gray-200">
                        <span className="font-bold text-gray-800">Cor:</span>{" "}
                        {item.selectedVariant.color}
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="font-bold text-gray-800">
                          Tamanho:
                        </span>{" "}
                        {item.selectedVariant.size}
                        {/* NOVO: Mostra o complemento (Colchão) apenas se ele existir nesta variação */}
                        {item.selectedVariant.complement && (
                          <>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="font-bold text-[#ffd639] bg-[#313b2f] px-2 py-0.5 rounded">
                              {item.selectedVariant.complement}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    <p className="text-sm text-gray-500 font-medium mt-1">
                      Preço unitário: {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Controles */}
                  <div className="flex items-center gap-4">
                    {/* Quantidade */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.cartItemId,
                            Math.max(1, item.quantity - 1),
                          )
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
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity + 1)
                        }
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
                      onClick={() => removeItem(item.cartItemId)}
                      className="text-gray-400 hover:text-red-500 p-2 transition-colors rounded-full hover:bg-red-50"
                      title="Remover item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
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
                onClick={handleCheckoutClick}
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
      {/* --- MODAL DE LOGIN NECESSÁRIO --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto bg-yellow-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <FaUserLock className="text-3xl text-[#ffd639]" />
            </div>

            <h3 className="text-2xl font-bold text-[#313b2f] mb-3">
              Falta pouco!
            </h3>

            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              Para finalizar a sua compra de forma segura, precisamos que você
              faça login ou crie uma conta rapidinho.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  // Passamos um state no navigate para a página de login saber
                  // que deve voltar pro checkout depois de logar!
                  navigate("/login", { state: { returnTo: "/checkout" } });
                }}
                className="w-full py-4 rounded-xl bg-[#313b2f] text-white font-bold hover:bg-[#1a2019] hover:-translate-y-1 transition-all shadow-md"
              >
                Fazer Login
              </button>

              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-3 rounded-xl text-gray-400 font-bold hover:bg-gray-50 hover:text-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
