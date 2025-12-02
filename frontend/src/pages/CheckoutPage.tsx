import React, { useEffect, useState } from 'react';
import { useCartStore } from '../store/CartStore';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import {
    FaMapMarkerAlt,
    FaCheckCircle,
    FaSpinner,
    FaTrash,
} from 'react-icons/fa'; // Importe FaTrash
import type { Address } from '../types/address';
import AddressForm from '../components/AddressForm';
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
    const { items, getTotal, clearCart } = useCartStore();
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showAddressModal, setShowAddressModal] = useState(false);

    // Função de busca isolada para poder recarregar
    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/addresses');
            setAddresses(response.data);

            // Lógica de seleção automática
            if (response.data.length > 0 && !selectedAddressId) {
                const defaultAddr = response.data.find(
                    (a: Address) => a.isDefault
                );
                setSelectedAddressId(
                    defaultAddr ? defaultAddr.id : response.data[0].id
                );
            } else if (response.data.length === 0) {
                setSelectedAddressId(null);
            }
        } catch (err) {
            setError('Erro ao carregar endereços.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    // --- NOVA FUNÇÃO: DELETAR ENDEREÇO ---
    const handleDeleteAddress = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Impede que o clique selecione o card

        if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
            try {
                await api.delete(`/addresses/${id}`);
                // Se o endereço deletado estava selecionado, limpa a seleção
                if (selectedAddressId === id) {
                    setSelectedAddressId(null);
                }
                fetchAddresses(); // Recarrega a lista
            } catch (error) {
                alert('Erro ao excluir endereço.');
            }
        }
    };

    const handleAddressSuccess = () => {
        setShowAddressModal(false);
        fetchAddresses();
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            setError('Por favor, selecione um endereço de entrega.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const payload = {
                addressId: selectedAddressId,
                items: items.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };

            await api.post('/orders', payload);
            clearCart();
            alert('Pedido realizado com sucesso!');
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(
                err.response?.data?.message || 'Erro ao finalizar pedido.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const formatPrice = (val: number) =>
        val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (items.length === 0) {
        return (
            <div className="checkout-empty">
                <h2>Seu carrinho está vazio.</h2>
                <Link to="/products">Voltar ao Catálogo</Link>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h1>Finalizar Compra</h1>

            <div className="checkout-layout">
                <div className="checkout-section">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px',
                            borderBottom: '2px solid #ffd639',
                            paddingBottom: '10px',
                        }}
                    >
                        <h2 style={{ margin: 0, border: 'none', padding: 0 }}>
                            <FaMapMarkerAlt /> Endereço de Entrega
                        </h2>
                        <button
                            className="add-address-small-btn"
                            onClick={() => setShowAddressModal(true)}
                        >
                            + Novo
                        </button>
                    </div>

                    {loading ? (
                        <p>Carregando endereços...</p>
                    ) : addresses.length === 0 ? (
                        <div className="no-address">
                            <p>Você não tem endereços cadastrados.</p>
                            <button
                                className="add-address-btn"
                                onClick={() => setShowAddressModal(true)}
                            >
                                + Cadastrar Endereço
                            </button>
                        </div>
                    ) : (
                        <div className="address-list">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    className={`address-card ${
                                        selectedAddressId === addr.id
                                            ? 'selected'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setSelectedAddressId(addr.id)
                                    }
                                >
                                    <div className="address-header">
                                        <strong>{addr.recipientName}</strong>
                                        {/* Botão de Excluir no Topo Direito */}
                                        <button
                                            className="delete-address-btn"
                                            onClick={(e) =>
                                                handleDeleteAddress(e, addr.id)
                                            }
                                            title="Excluir endereço"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>

                                    <p>
                                        {addr.street}, {addr.number}{' '}
                                        {addr.complement}
                                    </p>
                                    <p>
                                        {addr.neighborhood} - {addr.city}/
                                        {addr.state}
                                    </p>
                                    <p>CEP: {addr.zipCode}</p>

                                    {addr.isDefault && (
                                        <span
                                            className="badge-default"
                                            style={{
                                                marginTop: '10px',
                                                display: 'inline-block',
                                            }}
                                        >
                                            Padrão
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="checkout-summary">
                    <h2>Resumo do Pedido</h2>
                    <div className="summary-items">
                        {items.map((item) => (
                            <div key={item.id} className="summary-item-row">
                                <span>
                                    {item.quantity}x {item.name}
                                </span>
                                <span>
                                    {formatPrice(item.price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <hr />

                    <div className="summary-total-row">
                        <span>Total</span>
                        <span>{formatPrice(getTotal())}</span>
                    </div>

                    {error && <p className="checkout-error">{error}</p>}

                    <button
                        className="confirm-order-btn"
                        onClick={handlePlaceOrder}
                        disabled={submitting || !selectedAddressId}
                    >
                        {submitting ? (
                            <FaSpinner className="spin" />
                        ) : (
                            <>
                                <FaCheckCircle /> Confirmar Pedido
                            </>
                        )}
                    </button>
                </div>
            </div>

            {showAddressModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <AddressForm
                            onSuccess={handleAddressSuccess}
                            onCancel={() => setShowAddressModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
