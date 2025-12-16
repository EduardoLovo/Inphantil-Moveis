import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/AuthStore';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaBoxOpen,
    FaHome,
    FaInfoCircle,
    FaMapMarkerAlt,
    FaPlus,
    FaRegEdit,
    FaSignOutAlt,
    FaTrash,
    FaUserCircle,
} from 'react-icons/fa';
import './DashboardPage.css';
import { api } from '../services/api';
import AddressForm from '../components/AddressForm';
import { useOrderStore } from '../store/OrderStore';
import type { Address } from '../types/address';
import axios from 'axios';

const DashboardPage = () => {
    // Pega o estado e o método de logout
    const { user, isLoggedIn, logout } = useAuthStore();
    const { orders, fetchMyOrders, isLoading: ordersLoading } = useOrderStore(); // Store de pedidos
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAddressModal, setShowAddressModal] = useState(false);

    // Efeito para redirecionar se não estiver logado
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            // Carrega dados assim que logado
            fetchMyOrders();
            fetchAddresses();
        }
    }, [isLoggedIn, navigate]);

    const fetchAddresses = async () => {
        try {
            const response = await api.get('/addresses');
            setAddresses(response.data);
        } catch (error) {
            console.error('Erro ao buscar endereços');
        }
    };

    const handleDeleteAddress = async (id: number) => {
        // No checkout pode ter 'e: MouseEvent' antes
        // e.stopPropagation(); // Mantenha se for no CheckoutPage

        if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
            try {
                await api.delete(`/addresses/${id}`);
                // Lógica de limpar seleção (se CheckoutPage) ...
                fetchAddresses();
            } catch (error) {
                // CORREÇÃO AQUI: Pega a mensagem do backend
                if (axios.isAxiosError(error) && error.response) {
                    alert(error.response.data.message);
                } else {
                    alert('Erro ao excluir endereço.');
                }
            }
        }
    };

    const handleAddressSuccess = () => {
        setShowAddressModal(false);
        fetchAddresses();
    };
    // Se o estado ainda não carregou o usuário (pode acontecer no primeiro carregamento)
    if (!user || !isLoggedIn) {
        return <h1>Carregando...</h1>;
    }

    const handleLogout = () => {
        logout();
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('pt-BR');
    const formatPrice = (val: number) =>
        Number(val).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });

    const STATUS_MAP: Record<string, string> = {
        PENDING: 'Pendente',
        PAID: 'Pago',
        IN_PRODUCTION: 'Em Produção',
        SHIPPED: 'Enviado',
        DELIVERED: 'Entregue',
        CANCELED: 'Cancelado',
    };

    if (!user || !isLoggedIn) {
        return (
            <div className="dashboard-loading-container">
                <h1>Carregando Perfil...</h1>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="profile-card">
                {/* --- CABEÇALHO DO PERFIL --- */}
                <h1 className="profile-card-title">
                    <FaUserCircle className="profile-icon" /> Meu Perfil
                </h1>

                <p className="cc">
                    Bem-vindo(a),{' '}
                    <span className="user-name-highlight">{user.name}</span>
                </p>
                {user.role !== 'USER' && (
                    <p className="role-message">
                        Acesso:{' '}
                        <strong className="role-highlight">{user.role}</strong>
                    </p>
                )}

                <hr className="profile-divider" />

                {/* --- DADOS PESSOAIS --- */}
                <div className="section-header-row">
                    <h2 className="info-section-title">
                        <FaInfoCircle className="info-icon" /> Meus Dados
                    </h2>

                    <Link to="/profile/edit" className="edit-profile-link">
                        <span>Editar Perfil</span>{' '}
                        {/* Use span em vez de p para evitar margens */}
                        <FaRegEdit className="info-icon" />
                    </Link>
                </div>
                <div className="info-detail-group">
                    <div className="info-detail">
                        <label>Email:</label> <p>{user.email}</p>
                    </div>
                    <div className="info-detail">
                        <label>Telefone:</label> <p>{user.fone}</p>
                    </div>
                </div>

                {/* --- MEUS PEDIDOS --- */}
                <div className="section-block">
                    <h2 className="info-section-title">
                        <FaBoxOpen className="info-icon" /> Meus Pedidos
                    </h2>

                    {ordersLoading ? (
                        <p>Carregando pedidos...</p>
                    ) : orders.length === 0 ? (
                        <p className="empty-text">
                            Você ainda não fez nenhum pedido.
                        </p>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div key={order.id} className="order-item">
                                    <div className="order-header">
                                        <span className="order-id">
                                            Pedido #{order.id}
                                        </span>
                                        <span
                                            className={`status-badge status-${order.status.toLowerCase()}`}
                                        >
                                            {STATUS_MAP[order.status] ||
                                                order.status}
                                        </span>
                                    </div>
                                    <div className="order-info">
                                        <span>
                                            Data: {formatDate(order.createdAt)}
                                        </span>
                                        <span>
                                            Total:{' '}
                                            <strong>
                                                {formatPrice(order.total)}
                                            </strong>
                                        </span>
                                    </div>
                                    {/* Opcional: Listar itens resumidos */}
                                    <div className="order-products">
                                        {order.items?.map((item) => (
                                            <span
                                                key={item.id}
                                                className="order-product-tag"
                                            >
                                                {item.quantity}x{' '}
                                                {item.product?.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- MEUS ENDEREÇOS --- */}
                <div className="section-block">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '15px',
                        }}
                    >
                        <h2
                            className="info-section-title"
                            style={{ marginBottom: 0 }}
                        >
                            <FaMapMarkerAlt className="info-icon" /> Endereços
                        </h2>
                        <button
                            className="btn-add-small"
                            onClick={() => setShowAddressModal(true)}
                        >
                            <FaPlus /> Novo
                        </button>
                    </div>

                    {addresses.length === 0 ? (
                        <p className="empty-text">
                            Nenhum endereço cadastrado.
                        </p>
                    ) : (
                        <div className="address-grid">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    className="dash-address-card"
                                >
                                    <div className="addr-header">
                                        <strong>{addr.recipientName}</strong>
                                        <button
                                            onClick={() =>
                                                handleDeleteAddress(addr.id)
                                            }
                                            className="btn-delete-icon"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                    <p>
                                        {addr.street}, {addr.number}
                                    </p>
                                    <p>
                                        {addr.neighborhood} - {addr.city}/
                                        {addr.state}
                                    </p>
                                    <p>{addr.zipCode}</p>
                                    {addr.isDefault && (
                                        <span className="tag-default">
                                            Padrão
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- NAVEGAÇÃO --- */}
                <div className="quick-nav-section">
                    <h3 className="quick-nav-title">Atalhos</h3>
                    <div className="quick-nav-links">
                        <Link to="/products" className="nav-link">
                            <FaHome /> Ir para Loja
                        </Link>
                        {user.role !== 'USER' && (
                            <Link to="/admin" className="nav-link admin-link">
                                Painel Administrativo
                            </Link>
                        )}
                    </div>
                </div>

                <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt /> Sair
                </button>
            </div>

            {/* MODAL DE ENDEREÇO */}
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

export default DashboardPage;
