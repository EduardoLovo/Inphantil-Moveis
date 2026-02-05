import React, { useState } from "react";
import { api } from "../../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaLock,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Token inválido ou ausente.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });
      alert(
        "Senha alterada com sucesso! Você será redirecionado para o login.",
      );
      navigate("/login");
    } catch (err) {
      setError(
        "Erro ao alterar senha. O link pode ter expirado ou é inválido.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Link Inválido
          </h1>
          <p className="text-gray-500 mb-6">
            O link de recuperação de senha não foi encontrado ou está
            incompleto.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 px-4 bg-[#313b2f] text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4 border border-yellow-100">
            <FaKey className="text-[#ffd639] text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#313b2f] ">
            Nova Senha
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Defina sua nova senha de acesso abaixo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <span className="font-bold">Erro:</span> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Digite sua nova senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd639] focus:border-transparent sm:text-sm transition-all"
                required
                minLength={6}
                placeholder="Mínimo de 6 caracteres"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-[#313b2f] bg-[#ffd639] hover:bg-[#e6c235] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffd639] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin" /> Alterando...
              </span>
            ) : (
              "Alterar Senha"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
