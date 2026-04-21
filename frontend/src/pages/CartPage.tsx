import React, { useEffect, useState, useMemo } from "react";
import { useCartStore } from "../store/CartStore";
import { useProductStore } from "../store/ProductStore";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowRight,
  FaUserLock,
  FaShoppingCart,
  FaStore,
  FaMagic,
  FaCartPlus,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

// --- ORDEM DAS CORES (Para organizar o Select do Lençol) ---
const COLOR_ORDER = [
  "b6-am14",
  "b6-az10",
  "b6-b8",
  "b6-l11",
  "b6-r12",
  "b6-vd25",
  "cz6-am14",
  "cz6-az10",
  "cz6-cz26",
  "cz6-l11",
  "cz6-r12",
  "cz6-vd25",
  "azul",
  "azul bebe",
  "bege",
  "branco",
  "cinza",
  "palha",
  "prata",
  "rosa",
  "rosa bebe",
  "verde",
];

const formatPrice = (val: number) =>
  Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ==========================================
// MINI COMPONENTE: CAIXINHA DE SUGESTÃO
// ==========================================
const SuggestionItem = ({
  product,
  size,
  variants,
  onAdd,
}: {
  product: any;
  size: string;
  variants: any[];
  onAdd: any;
}) => {
  // Ordena as variantes disponíveis usando a nossa lista de cores
  const sortedVariants = useMemo(() => {
    return [...variants].sort((a, b) => {
      const cA = a.color ? a.color.toLowerCase() : "";
      const cB = b.color ? b.color.toLowerCase() : "";
      const indexA = COLOR_ORDER.indexOf(cA);
      const indexB = COLOR_ORDER.indexOf(cB);
      const posA = indexA !== -1 ? indexA : 999;
      const posB = indexB !== -1 ? indexB : 999;
      return posA - posB;
    });
  }, [variants]);

  // Estado para controlar qual cor está selecionada no dropdown
  const [selectedVariantId, setSelectedVariantId] = useState(
    String(sortedVariants[0].id),
  );

  // Encontra a variante completa baseada no ID selecionado
  const selectedVariant =
    sortedVariants.find((v) => String(v.id) === selectedVariantId) ||
    sortedVariants[0];

  const imgUrl =
    selectedVariant.images?.[0]?.url ||
    product.mainImage ||
    "https://via.placeholder.com/100";

  return (
    <div className="bg-yellow-50/50 border border-yellow-200 p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-shadow">
      <img
        src={imgUrl}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-lg border border-white shadow-sm shrink-0"
      />
      <div className="flex-1 overflow-hidden">
        <h4 className="font-bold text-sm text-[#313b2f] line-clamp-1">
          {product.name}
        </h4>
        <div className="mt-1 flex flex-col items-start gap-1">
          <p className="text-xs text-gray-500">
            Tamanho: <span className="font-bold text-[#313b2f]">{size}</span>
          </p>

          {/* SE TIVER MAIS DE UMA COR, MOSTRA O SELECT */}
          {sortedVariants.length > 1 ? (
            <div className="relative w-full max-w-[160px] mt-1">
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                // appearance-none remove o estilo padrão do navegador
                className="w-full appearance-none text-xs bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 outline-none focus:ring-2 focus:ring-[#ffd639] focus:border-transparent text-gray-700 font-bold cursor-pointer hover:border-gray-300 transition-colors shadow-sm"
              >
                {sortedVariants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.color}
                  </option>
                ))}
              </select>

              {/* Seta personalizada que fica por cima do select */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          ) : (
            /* SE TIVER SÓ UMA COR, MOSTRA O TEXTO NORMAL */
            sortedVariants[0].color &&
            sortedVariants[0].color !== "Cor Única" && (
              <p className="text-xs text-gray-500">
                Cor:{" "}
                <span className="font-bold text-[#313b2f]">
                  {sortedVariants[0].color}
                </span>
              </p>
            )
          )}
        </div>
        <p className="font-bold text-[#313b2f] text-sm mt-1.5">
          {formatPrice(selectedVariant.price)}
        </p>
      </div>
      <button
        onClick={() => onAdd(product, selectedVariant)}
        className="w-10 h-10 bg-[#313b2f] text-white rounded-full flex items-center justify-center hover:bg-[#ffd639] hover:text-[#313b2f] transition-colors shadow-sm shrink-0"
        title="Adicionar ao Carrinho"
      >
        <FaCartPlus />
      </button>
    </div>
  );
};

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart, addItem } =
    useCartStore();
  const { products, fetchProducts } = useProductStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const isAuthenticated = !!user;
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      navigate("/checkout");
    }
  };

  const total = getTotal();

  // ==========================================
  // LÓGICA DE SUGESTÃO (UPSELL)
  // ==========================================
  const sizesInCart = Array.from(
    new Set(
      items
        .filter((item) => item.name.toLowerCase().includes("cama"))
        .map((item) => item.selectedVariant?.size)
        .filter(Boolean) as string[],
    ),
  );

  const suggestions: { product: any; size: string; variants: any[] }[] = [];

  sizesInCart.forEach((size) => {
    const upsellItems = products.filter((p) => {
      const name = p.name.toLowerCase();
      return (
        name.includes("protetor") ||
        name.includes("lençol") ||
        name.includes("lencol")
      );
    });

    upsellItems.forEach((upsellProduct) => {
      const matchingVariants =
        upsellProduct.variants?.filter((v) => v.size === size) || [];

      if (matchingVariants.length > 0) {
        const availableVariants = matchingVariants.filter(
          (v) =>
            !items.some(
              (cartItem) =>
                cartItem.productId === upsellProduct.id &&
                cartItem.selectedVariant?.id === v.id,
            ),
        );

        if (availableVariants.length > 0) {
          const isAlreadySuggested = suggestions.some(
            (s) => s.product.id === upsellProduct.id && s.size === size,
          );

          if (!isAlreadySuggested) {
            suggestions.push({
              product: upsellProduct,
              size,
              variants: availableVariants,
            });
          }
        }
      }
    });
  });

  const handleAddSuggestion = (product: any, variant: any) => {
    addItem(product, variant);
    toast.success(`${product.name} adicionado!`, {
      iconTheme: { primary: "#ffd639", secondary: "#313b2f" },
      style: { background: "#313b2f", color: "#fff" },
    });
  };

  // ==========================================
  // MAIS PRODUTOS DA LOJA (VITRINE DO CARRINHO)
  // ==========================================

  // Pega os IDs dos produtos que já estão no carrinho para não repeti-los
  const cartProductIds = items.map((item) => item.productId || item.id);

  // Filtra produtos que não estão no carrinho e pega no máximo 4
  const otherProducts = products
    .filter((p) => !cartProductIds.includes(p.id))
    .slice(0, 4);

  const handleRelatedClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Função para o botão "Adicionar Rápido"
  const handleAddToCartQuick = (productToAdd: any) => {
    // Se tem variações, o cliente precisa ir para a página de detalhes escolher
    if (productToAdd.variants && productToAdd.variants.length > 0) {
      navigate(`/products/${productToAdd.id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Se não tem variação, adiciona direto
      addItem(productToAdd);
      toast.success(`${productToAdd.name} adicionado!`, {
        iconTheme: { primary: "#ffd639", secondary: "#313b2f" },
        style: { background: "#313b2f", color: "#fff" },
      });
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8 md:pt-32 pb-20 min-h-[70vh]">
      <Toaster />
      <h1 className="text-3xl font-bold text-[#313b2f]  mb-8 flex items-center gap-3">
        <FaShoppingCart className="text-[#ffd639]" /> Meu Carrinho
      </h1>
      {items.length === 0 ? (
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
            to="/loja"
            className="flex items-center gap-2 px-8 py-3 bg-[#313b2f] text-white font-bold rounded-full hover:bg-[#ffd639] hover:text-[#313b2f] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <FaStore /> Ir para a Loja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Itens (Esquerda) */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              let displayImage = item.mainImage;

              if (
                item.selectedVariant?.images &&
                item.selectedVariant.images.length > 0
              ) {
                displayImage = item.selectedVariant.images[0].url;
              } else if ((item.selectedVariant as any)?.imageUrl) {
                displayImage = (item.selectedVariant as any).imageUrl;
              }

              return (
                <div
                  key={item.cartItemId}
                  className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-shadow"
                >
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

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-[#313b2f] text-lg mb-1">
                      {item.name}
                    </h3>

                    {item.selectedVariant && (
                      <div className="text-xs text-gray-600 bg-gray-100 inline-block px-3 py-1.5 rounded-lg mb-2 border border-gray-200">
                        <span className="font-bold text-gray-800">Cor:</span>{" "}
                        {item.selectedVariant.color}
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="font-bold text-gray-800">
                          Tamanho:
                        </span>{" "}
                        {item.selectedVariant.size}
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

                  <div className="flex items-center gap-4">
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

                    <div className="text-right min-w-[100px]">
                      <p className="font-bold text-lg text-[#313b2f]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

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

            {/* SESSÃO DE SUGESTÕES COM DROPDOWN DE COR */}
            {suggestions.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-bold text-[#313b2f] mb-4 flex items-center gap-2">
                  <FaMagic className="text-[#ffd639]" /> Aproveite para
                  completar sua cama:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {suggestions.map((sug, index) => (
                    <SuggestionItem
                      key={`${sug.product.id}-${index}`}
                      product={sug.product}
                      size={sug.size}
                      variants={sug.variants}
                      onAdd={handleAddSuggestion}
                    />
                  ))}
                </div>
              </div>
            )}
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
                Calcular Frete <FaArrowRight />
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

      {/* ========================================== */}
      {/* Todos os Outros Produtos (VITRINE INFERIOR)*/}
      {/* ========================================== */}
      {otherProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-[#313b2f] mb-8 ">
            Mais Produtos da Loja
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {otherProducts.map((other) => (
              <div
                key={other.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Link
                    to={`/products/${other.id}`}
                    onClick={handleRelatedClick}
                    className="block w-full h-full"
                  >
                    <img
                      src={other.mainImage || "https://via.placeholder.com/200"}
                      alt={other.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      onClick={() => handleAddToCartQuick(other)}
                      className="w-full py-2 bg-white/90 backdrop-blur-sm text-[#313b2f] font-bold text-sm rounded-lg shadow-lg hover:bg-[#ffd639]"
                    >
                      {other.variants && other.variants.length > 0
                        ? "Ver Opções"
                        : "Adicionar Rápido"}
                    </button>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <Link
                    to={`/products/${other.id}`}
                    onClick={handleRelatedClick}
                    className="font-bold text-[#313b2f] hover:text-[#ffd639] transition-colors mb-2 line-clamp-2"
                  >
                    {other.name}
                  </Link>
                  {/* <div className="mt-auto pt-2">
                    <span className="font-bold text-lg text-[#313b2f]">
                      {formatPrice(other.)}
                    </span>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
