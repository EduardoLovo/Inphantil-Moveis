import React, { useEffect } from 'react';
import { useContactStore } from '../store/ContactStore';
import { useAuthStore } from '../store/AuthStore';
import { Navigate } from 'react-router-dom';
import { FaEnvelopeOpenText, FaUser } from 'react-icons/fa';
import './AdminCategoryPage.css'; // Reutiliza estilos de tabela (ou crie um novo se preferir)

const AdminContactPage: React.FC = () => {
    const { messages, isLoading, error, fetchMessages } = useContactStore();
    const { user } = useAuthStore();

    // Permissão
    const canAccess =
        user &&
        (user.role === 'ADMIN' ||
            user.role === 'DEV' ||
            user.role === 'SELLER');
    if (!canAccess) return <Navigate to="/dashboard" replace />;

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    if (isLoading)
        return (
            <div className="loading-container">
                <h1>Carregando Mensagens...</h1>
            </div>
        );

    return (
        <div className="admin-page-container">
            <h1>
                <FaEnvelopeOpenText /> Mensagens de Contato
            </h1>
            <p className="page-description">
                Gerencie as dúvidas e solicitações enviadas pelos clientes.
            </p>

            {error && <p className="error-message">Erro: {error}</p>}

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="table-header">Data</th>
                            <th className="table-header">Nome</th>
                            <th className="table-header">Email</th>
                            <th className="table-header">Assunto</th>
                            <th className="table-header">Mensagem</th>
                            <th className="table-header">Vinculado a</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map((msg) => (
                            <tr key={msg.id} className="category-row">
                                <td
                                    className="table-cell"
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {new Date(msg.createdAt).toLocaleDateString(
                                        'pt-BR'
                                    )}{' '}
                                    <br />
                                    <small>
                                        {new Date(
                                            msg.createdAt
                                        ).toLocaleTimeString('pt-BR')}
                                    </small>
                                </td>
                                <td className="table-cell">{msg.name}</td>
                                <td className="table-cell">
                                    <a
                                        href={`mailto:${msg.email}`}
                                        style={{
                                            color: 'green',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {msg.email}
                                    </a>
                                </td>
                                <td className="table-cell font-bold">
                                    {msg.subject}
                                </td>
                                <td
                                    className="table-cell"
                                    style={{ maxWidth: '300px' }}
                                >
                                    {msg.message}
                                </td>
                                <td className="table-cell">
                                    {msg.user ? (
                                        <span
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                color: 'green',
                                            }}
                                        >
                                            <FaUser /> {msg.user.name}
                                        </span>
                                    ) : (
                                        <span style={{ color: '#999' }}>
                                            Visitante
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {messages.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="empty-cell"
                                    style={{
                                        padding: '20px',
                                        textAlign: 'center',
                                    }}
                                >
                                    Nenhuma mensagem recebida.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminContactPage;
