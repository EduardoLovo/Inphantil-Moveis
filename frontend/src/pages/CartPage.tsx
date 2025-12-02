import React from 'react';
import { useCartStore } from '../store/CartStore';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowRight } from 'react-icons/fa';
import './CartPage.css';

const CartPage: React.FC = () => {
    const { items, removeItem, updateQuantity, getTotal, clearCart } =
        useCartStore();
    const navigate = useNavigate();

    const total = getTotal();
    const formatPrice = (val: number) =>
        val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="cart-container">
            <h1>Meu Carrinho</h1>

            {items.length === 0 ? (
                <div className="empty-cart">
                    <p>Seu carrinho está vazio.</p>
                    <Link to="/products" className="continue-shopping-btn">
                        Ver Produtos
                    </Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-list">
                        {items.map((item) => (
                            <div key={item.id} className="cart-item">
                                {/* Se tiver imagem, mostre aqui. Se não, placeholder */}
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p className="item-price">
                                        {formatPrice(item.price)}
                                    </p>
                                </div>

                                <div className="item-controls">
                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity - 1
                                            )
                                        }
                                    >
                                        <FaMinus />
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        <FaPlus />
                                    </button>
                                </div>

                                <div className="item-subtotal">
                                    <p>
                                        {formatPrice(
                                            item.price * item.quantity
                                        )}
                                    </p>
                                </div>

                                <button
                                    className="remove-btn"
                                    onClick={() => removeItem(item.id)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Resumo</h2>
                        <div className="summary-row">
                            <span>Total:</span>
                            <span className="summary-total">
                                {formatPrice(total)}
                            </span>
                        </div>

                        <button onClick={clearCart} className="clear-cart-btn">
                            Limpar Carrinho
                        </button>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="checkout-btn"
                        >
                            Finalizar Compra <FaArrowRight />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
