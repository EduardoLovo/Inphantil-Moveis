import React, { useState } from "react";
import { api } from "../../services/api";
import {
  FaEnvelope,
  FaPaperPlane,
  FaSpinner,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (error) {
      setError(
        "Erro ao solicitar recuperação. Verifique se o e-mail está correto.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-green-100 text-center animate-in fade-in zoom-in duration-300">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <FaCheckCircle className="text-green-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-[#313b2f] mb-2 ">
            Verifique seu E-mail
          </h2>
          <p className="text-gray-600 mb-6">
            Enviamos um link de recuperação para <br />
            <strong className="text-[#313b2f]">{email}</strong>.
          </p>
          <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 mb-6 border border-gray-200">
            (Como é um teste local, verifique o terminal do backend para ver o
            link)
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[#313b2f] font-bold hover:underline"
          >
            <FaArrowLeft /> Voltar para o Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100">
            <FaEnvelope className="text-blue-500 text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#313b2f] ">
            Recuperar Senha
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Digite seu e-mail para receber o link de redefinição.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Campo Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Cadastrado
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd639] focus:border-transparent sm:text-sm transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Botão Enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-[#313b2f] bg-[#ffd639] hover:bg-[#e6c235] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffd639] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin" /> Enviando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FaPaperPlane /> Enviar Link
              </span>
            )}
          </button>

          {/* Link Voltar */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-500 hover:text-[#313b2f] transition-colors flex items-center justify-center gap-2"
            >
              <FaArrowLeft size={12} /> Voltar para o Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
