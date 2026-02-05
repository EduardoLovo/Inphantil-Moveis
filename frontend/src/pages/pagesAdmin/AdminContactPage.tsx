import React, { useEffect } from "react";
import { useContactStore } from "../../store/ContactStore";
import { useAuthStore } from "../../store/AuthStore";
import { Navigate } from "react-router-dom";
import {
  FaEnvelopeOpenText,
  FaUser,
  FaSpinner,
  FaPaperPlane,
  FaUserSecret,
  FaInbox,
} from "react-icons/fa";

const AdminContactPage: React.FC = () => {
  const { messages, isLoading, error, fetchMessages } = useContactStore();
  const { user } = useAuthStore();

  const canAccess =
    user &&
    (user.role === "ADMIN" || user.role === "DEV" || user.role === "SELLER");

  if (!canAccess) return <Navigate to="/dashboard" replace />;

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 animate-pulse">
        <FaSpinner className="animate-spin text-4xl text-[#ffd639] mb-4" />
        <p className="text-lg font-medium">Carregando Mensagens...</p>
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#313b2f] ">
            <FaEnvelopeOpenText className="text-[#ffd639]" /> Mensagens
          </h1>
          <p className="text-gray-500 mt-1 ml-1">
            Gerencie as dúvidas e solicitações enviadas pelos clientes.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 self-start">
          <FaInbox /> {messages.length} Recebidas
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* --- VERSÃO MOBILE (CARDS) --- */}
      <div className="md:hidden space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {new Date(msg.createdAt).toLocaleDateString("pt-BR")}
                <span className="text-xs">
                  •{" "}
                  {new Date(msg.createdAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {msg.user ? (
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                  <FaUser /> Cliente
                </span>
              ) : (
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                  <FaUserSecret /> Visitante
                </span>
              )}
            </div>

            <div>
              <h3 className="font-bold text-[#313b2f] text-lg">{msg.name}</h3>
              <p className="text-sm text-blue-600 font-medium mb-2">
                {msg.email}
              </p>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="font-bold text-gray-700 text-sm mb-1">
                  {msg.subject}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {msg.message}
                </p>
              </div>
            </div>

            <a
              href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
              className="mt-2 w-full py-2 bg-[#313b2f] text-white rounded-lg flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              <FaPaperPlane /> Responder
            </a>
          </div>
        ))}
      </div>

      {/* --- VERSÃO DESKTOP (TABELA) --- */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
              <th className="p-5 w-32">Data</th>
              <th className="p-5 w-48">Remetente</th>
              <th className="p-5">Mensagem</th>
              <th className="p-5 w-40">Vínculo</th>
              <th className="p-5 w-32 text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {messages.map((msg) => (
              <tr
                key={msg.id}
                className="hover:bg-yellow-50/30 transition-colors group"
              >
                <td className="p-5 text-sm text-gray-600">
                  <div className="font-medium text-gray-800">
                    {new Date(msg.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>

                <td className="p-5">
                  <div className="font-bold text-[#313b2f] text-sm">
                    {msg.name}
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    {msg.email}
                  </a>
                </td>

                <td className="p-5">
                  <div className="max-w-lg">
                    <span className="block font-bold text-gray-700 text-sm mb-1">
                      {msg.subject}
                    </span>
                    <p className="text-sm text-gray-600 line-clamp-2 hover:line-clamp-none transition-all duration-300">
                      {msg.message}
                    </p>
                  </div>
                </td>

                <td className="p-5">
                  {msg.user ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold text-green-700 bg-green-50 border border-green-100">
                      <FaUser className="text-[10px]" />{" "}
                      {msg.user.name.split(" ")[0]}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200">
                      <FaUserSecret /> Visitante
                    </span>
                  )}
                </td>

                <td className="p-5 text-center">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center border border-transparent hover:border-blue-100"
                    title="Responder por Email"
                  >
                    <FaPaperPlane />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {messages.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mt-4">
          <FaInbox className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            Nenhuma mensagem recebida.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminContactPage;
