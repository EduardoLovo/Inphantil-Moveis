import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './AdminPage.css';

// Defina as interfaces conforme seu backend
interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: { name: string };
}

interface Order {
    id: number;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

interface UserDetail {
    id: number;
    name: string;
    email: string;
    fone: string;
    cpf: string;
    role: string;
    createdAt: string;
    addresses: any[];
    orders: Order[];
}

const AdminUserDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchUserDetail();
    }, [id]);

    const fetchUserDetail = async () => {
        try {
            const res = await api.get(`/users/${id}`);
            setUser(res.data);
        } catch (error) {
            alert('Erro ao carregar usuário');
            navigate('/admin/users');
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="admin-container">
                <p>Carregando...</p>
            </div>
        );
    if (!user) return null;

    return (
        <div className="admin-container">
            <div
                className="admin-content"
                style={{ maxWidth: '1000px', margin: '0 auto' }}
            >
                <button
                    onClick={() => navigate('/admin/users')}
                    style={{
                        marginBottom: '20px',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        color: '#666',
                    }}
                >
                    ← Voltar para lista
                </button>

                <div
                    className="card"
                    style={{
                        padding: '30px',
                        background: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        marginBottom: '30px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #eee',
                            paddingBottom: '20px',
                            marginBottom: '20px',
                        }}
                    >
                        <div>
                            <h1 style={{ margin: 0 }}>{user.name}</h1>
                            <p style={{ color: '#888', margin: '5px 0' }}>
                                Cliente #{user.id} • Cadastrado em{' '}
                                {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span
                                style={{
                                    display: 'block',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: '#2c3e50',
                                }}
                            >
                                {user.orders.length} Pedidos
                            </span>
                            <span
                                style={{
                                    fontSize: '0.9rem',
                                    color:
                                        user.role === 'ADMIN' ? 'red' : 'green',
                                }}
                            >
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '40px',
                        }}
                    >
                        <div>
                            <h3>Dados de Contato</h3>
                            <p>
                                <strong>Email:</strong> {user.email}
                            </p>
                            <p>
                                <strong>Telefone:</strong>{' '}
                                {user.fone || 'Não informado'}
                            </p>
                            <p>
                                <strong>CPF:</strong>{' '}
                                {user.cpf || 'Não informado'}
                            </p>
                        </div>
                        <div>
                            <h3>Endereços Cadastrados</h3>
                            {user.addresses.length === 0 ? (
                                <p>Nenhum endereço.</p>
                            ) : (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {user.addresses.map((addr: any) => (
                                        <li
                                            key={addr.id}
                                            style={{
                                                marginBottom: '10px',
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            📍 {addr.street}, {addr.number} -{' '}
                                            {addr.city}/{addr.state} <br />
                                            <small>CEP: {addr.zipCode}</small>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <h3>Histórico de Pedidos</h3>
                {user.orders.length === 0 ? (
                    <p
                        style={{
                            padding: '20px',
                            background: '#f9f9f9',
                            borderRadius: '8px',
                        }}
                    >
                        Este usuário ainda não fez pedidos.
                    </p>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                        }}
                    >
                        {user.orders.map((order) => (
                            <div
                                key={order.id}
                                style={{
                                    background: '#fff',
                                    border: '1px solid #eee',
                                    borderRadius: '8px',
                                    padding: '20px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '15px',
                                    }}
                                >
                                    <div>
                                        <strong>Pedido #{order.id}</strong>
                                        <span
                                            style={{
                                                margin: '0 10px',
                                                color: '#ccc',
                                            }}
                                        >
                                            |
                                        </span>
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </div>
                                    <div
                                        style={{
                                            fontWeight: 'bold',
                                            color: '#27ae60',
                                        }}
                                    >
                                        R$ {Number(order.total).toFixed(2)}
                                    </div>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    Status:{' '}
                                    <span
                                        className={`status-badge ${order.status.toLowerCase()}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        background: '#f9f9f9',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '5px',
                                            }}
                                        >
                                            <span>
                                                {item.quantity}x{' '}
                                                {item.product.name}
                                            </span>
                                            <span>
                                                R${' '}
                                                {Number(item.price).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUserDetailsPage;
