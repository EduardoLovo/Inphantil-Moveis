import React, { useEffect } from "react";
import { useLogStore } from "../../store/LogStore";
import { useAuthStore } from "../../store/AuthStore";
import { Navigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaSpinner,
  FaHistory,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const AdminLogsPage: React.FC = () => {
  const { logs, isLoading, error, fetchLogs } = useLogStore();
  const { user } = useAuthStore();

  // Check de permissão: Apenas DEV pode estar nesta página
  if (user?.role !== "DEV") {
    return <Navigate to="/admin" replace />;
  }

  useEffect(() => {
    // Carrega logs apenas se ainda não tiver carregado (opcional, pode remover o if para recarregar sempre)
    if (logs.length === 0) {
      fetchLogs();
    }
  }, [fetchLogs, logs.length]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <p className="text-lg font-medium">Carregando Histórico...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#313b2f] ">
            <FaShieldAlt className="text-[#ffd639]" /> Logs de Sistema
          </h1>
          <p className="text-gray-500 mt-1 ml-1">
            Histórico de acessos e tentativas de autenticação (Área Restrita
            DEV).
          </p>
        </div>
        <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 self-start">
          <FaHistory /> {logs.length} Registros
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <strong>Erro:</strong> {error}
        </div>
      )}

      <div className=" bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold tracking-wider">
                <th className="p-4 w-16">ID</th>
                <th className="p-4">Data / Hora</th>
                <th className="p-4">Ação</th>
                <th className="p-4 text-center">Resultado</th>
                <th className="p-4">IP</th>
                <th className="p-4">Usuário</th>
                <th className="p-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-yellow-50/30 transition-colors"
                >
                  <td className="p-4 font-mono text-gray-400 text-xs">
                    #{log.id}
                  </td>
                  <td className="p-4 text-gray-700">
                    {new Date(log.createdAt).toLocaleString("pt-BR")}
                  </td>
                  <td className="p-4 font-medium text-[#313b2f]">
                    {log.message}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                        log.success
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}
                    >
                      {log.success ? <FaCheckCircle /> : <FaTimesCircle />}
                      {log.success ? "Sucesso" : "Falha"}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-gray-500">
                    {log.ipAddress}
                  </td>
                  <td className="p-4">
                    {log.user ? (
                      <div>
                        <div className="font-bold text-gray-800">
                          {log.user.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {log.user.id}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Anônimo</span>
                    )}
                  </td>
                  <td className="p-4">
                    {log.user?.role ? (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold border border-gray-200">
                        {log.user.role}
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {logs.length === 0 && !error && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <FaHistory className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhum log encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default AdminLogsPage;
