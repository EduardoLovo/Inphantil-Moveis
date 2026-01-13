import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './AdminUsersPage.css'; // Reutilizando estilo do admin

interface UserSummary {
    id: number;
    name: string;
    email: string;
    role: string;
    fone: string | null;
    createdAt: string;
    _count: { orders: number };
}

const AdminUsersPage = () => {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // <--- 1. Estado da busca
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Erro ao buscar usuários', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) => {
        const term = searchTerm.toLowerCase();
        return (
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.id.toString().includes(term) // Bônus: busca por ID também
        );
    });

    console.log(users);

    return (
        <div className="aup-container">
            <div className="aup-content">
                {/* Cabeçalho com Título e Busca */}
                <div className="aup-header">
                    <h1 className="aup-title">Gerenciar Clientes</h1>

                    <div className="aup-search-wrapper">
                        <input
                            type="text"
                            placeholder="🔍 Pesquisar por nome, email ou ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="aup-search-input"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="aup-loading">
                        <p>Carregando clientes...</p>
                    </div>
                ) : (
                    <div className="aup-table-responsive">
                        <table className="aup-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Telefone</th>
                                    <th>Pedidos</th>
                                    <th>Cadastro</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>#{user.id}</td>
                                            <td>
                                                <strong>{user.name}</strong>
                                                {user.role === 'ADMIN' ? (
                                                    <span className="aup-badge-admin">
                                                        ADMIN
                                                    </span>
                                                ) : user.role === 'SELLER' ? (
                                                    <span className="aup-badge-admin">
                                                        SELLER
                                                    </span>
                                                ) : user.role === 'DEV' ? (
                                                    <span className="aup-badge-admin">
                                                        DEV
                                                    </span>
                                                ) : null}
                                            </td>
                                            <td>{user.email}</td>
                                            <td>{user.fone || '-'}</td>
                                            <td>{user._count.orders}</td>
                                            <td>
                                                {new Date(
                                                    user.createdAt
                                                ).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/users/${user.id}`
                                                        )
                                                    }
                                                    className="aup-btn-details"
                                                >
                                                    Ver Detalhes
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="aup-empty-state"
                                        >
                                            Nenhum usuário encontrado para "
                                            <span className="aup-highlight-text">
                                                {searchTerm}
                                            </span>
                                            "
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;
