import React, { useEffect } from 'react';
import { useOrderStore } from '../store/OrderStore';
import { useAuthStore } from '../store/AuthStore';
import { Navigate } from 'react-router-dom';
import { FaShoppingCart, FaTrashAlt } from 'react-icons/fa';
import { OrderStatus } from '../types/order';
import './AdminCategoryPage.css';
import './AdminOrdersPage.css'; // Estilos específicos (status colors)

const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Pendente',
    PAID: 'Pago',
    IN_PRODUCTION: 'Em Produção',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregue',
    CANCELED: 'Cancelado',
};

const AdminOrdersPage: React.FC = () => {
    const {
        orders,
        isLoading,
        error,
        fetchAllOrders,
        updateOrderStatus,
        deleteOrder,
    } = useOrderStore();
    const { user } = useAuthStore();

    const canAccess =
        user &&
        (user.role === 'ADMIN' ||
            user.role === 'DEV' ||
            user.role === 'SELLER');

    if (!canAccess) {
        return <Navigate to="/dashboard" replace />;
    }

    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders]);

    const handleStatusChange = (
        id: number,
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newStatus = e.target.value as OrderStatus;
        if (
            window.confirm(
                `Deseja alterar o status para ${STATUS_LABELS[newStatus]}?`
            )
        ) {
            updateOrderStatus(id, newStatus);
        } else {
            // Reverte visualmente se cancelar (opcional, pois o react re-renderiza)
            e.target.value = orders.find((o) => o.id === id)?.status || '';
        }
    };

    const handleDelete = async (id: number) => {
        if (
            window.confirm(
                'ATENÇÃO: Isso excluirá o pedido permanentemente e devolverá os itens ao estoque. Continuar?'
            )
        ) {
            await deleteOrder(id);
        }
    };

    const formatPrice = (val: number) =>
        Number(val).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });

    if (isLoading)
        return (
            <div className="loading-container">
                <h1>Carregando Pedidos...</h1>
            </div>
        );

    return (
        <div className="admin-page-container">
            <h1>
                <FaShoppingCart /> Gerenciamento de Pedidos
            </h1>
            <p className="page-description">
                Acompanhe e atualize o status das vendas.
            </p>

            {error && <p className="error-message">Erro: {error}</p>}

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="table-header">ID</th>
                            <th className="table-header">Data</th>
                            <th className="table-header">Cliente</th>
                            <th className="table-header">Itens</th>
                            <th className="table-header">Total</th>
                            <th className="table-header">Status</th>
                            <th className="table-header">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="category-row">
                                <td className="table-cell">#{order.id}</td>
                                <td className="table-cell">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString('pt-BR')}{' '}
                                    <br />
                                    <small>
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleTimeString('pt-BR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </small>
                                </td>
                                <td className="table-cell">
                                    <strong>{order.user.name}</strong>
                                    <br />
                                    <small>{order.user.email}</small>
                                </td>
                                <td className="table-cell">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            style={{ fontSize: '0.9em' }}
                                        >
                                            {item.quantity}x {item.product.name}
                                        </div>
                                    ))}
                                </td>
                                <td className="table-cell font-bold">
                                    {formatPrice(order.total)}
                                </td>
                                <td className="table-cell">
                                    <span
                                        className={`status-badge status-${order.status.toLowerCase()}`}
                                    >
                                        {STATUS_LABELS[order.status]}
                                    </span>
                                </td>
                                <td className="table-cell colum-acao">
                                    <select
                                        className="status-select"
                                        value={order.status}
                                        onChange={(e) =>
                                            handleStatusChange(order.id, e)
                                        }
                                    >
                                        {Object.keys(OrderStatus).map(
                                            (status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {STATUS_LABELS[status]}
                                                </option>
                                            )
                                        )}
                                    </select>
                                    <button
                                        className="action-button delete-button"
                                        onClick={() => handleDelete(order.id)}
                                        title="Excluir Pedido"
                                        style={{ marginLeft: '10px' }}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="empty-cell">
                                    Nenhum pedido encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
