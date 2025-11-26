import { useEffect } from 'react';
import { useLogStore } from '../store/LogStore';
import { useAuthStore } from '../store/AuthStore';
import { Navigate } from 'react-router-dom';
import './AdminLogsPage.css'; // 1. Importar o novo CSS

const AdminLogsPage = () => {
    const { logs, isLoading, error, fetchLogs } = useLogStore();
    const { user } = useAuthStore();

    // Check de permissão: Apenas DEV pode estar nesta página
    if (user?.role !== 'DEV') {
        return <Navigate to="/admin" replace />;
    }

    useEffect(() => {
        if (logs.length === 0) {
            fetchLogs();
        }
    }, [fetchLogs, logs.length]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <h1>Carregando Logs...</h1>
            </div>
        );
    }

    console.log(logs);

    return (
        <div className="logs-page-container">
            <h1>Logs de Autenticação (Acesso DEV)</h1>
            <p className="page-description">
                Histórico de todos os logins e tentativas de registro.
            </p>

            {error && <p className="error-log-message">Erro: {error}</p>}

            <div className="table-wrapper">
                <table className="logs-table">
                    <thead>
                        <tr>
                            <th className="table-header">ID Log</th>
                            <th className="table-header">Data / Hora</th>
                            <th className="table-header">Ação</th>
                            <th className="table-header">Resultado</th>
                            <th className="table-header">IP</th>
                            <th className="table-header">Usuário ID</th>
                            <th className="table-header">Email</th>
                            <th className="table-header">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id} className="log-row">
                                <td className="log-cell">{log.id}</td>
                                <td className="log-cell">
                                    {new Date(log.createdAt).toLocaleString(
                                        'pt-BR'
                                    )}
                                </td>
                                <td className="log-cell">{log.message}</td>
                                <td
                                    className={`log-cell ${
                                        log.success
                                            ? 'success-status'
                                            : 'failure-status'
                                    }`}
                                >
                                    {log.success ? 'SUCESSO' : 'FALHA'}
                                </td>
                                <td className="log-cell">{log.ipAddress}</td>
                                <td className="log-cell">
                                    {log.user?.id || 'N/A'}
                                </td>
                                <td className="log-cell">
                                    {log.user?.email || '-'}
                                </td>
                                <td className="log-cell">
                                    {log.user?.role || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {logs.length === 0 && !error && (
                <p className="no-logs-message">Nenhum log encontrado.</p>
            )}
        </div>
    );
};

export default AdminLogsPage;
