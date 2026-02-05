import React, { useState } from "react";
import { useAuthStore } from "../../store/AuthStore";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!executeRecaptcha) {
      setError(
        "O serviço de segurança ainda não foi carregado. Tente novamente.",
      );
      return;
    }

    try {
      const token = await executeRecaptcha("login");
      await login({
        email,
        password,
        gRecaptchaResponse: token,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha desconhecida no login.",
      );
    }
  };

  return (
    <div className="min-h-screen flex pt-28 items-center justify-center bg-gray-50 py-64 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* Cabeçalho */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#313b2f] ">
            Acesso do Cliente
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Bem-vindo de volta! Por favor, insira seus dados.
          </p>
        </div>

        {/* Botão Google */}
        <button
          type="button"
          onClick={() => (window.location.href = `${API_URL}/auth/google`)}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google Logo"
            className="w-5 h-5"
          />
          Entrar com Google
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-4 text-sm text-gray-500 absolute">
            ou entre com e-mail
          </span>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Campo Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd639] focus:border-transparent sm:text-sm transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd639] focus:border-transparent sm:text-sm transition-all"
                  placeholder="••••••••"
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
          </div>

          {/* Esqueci minha senha */}
          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-[#313b2f] hover:text-[#ffd639] transition-colors"
            >
              Esqueci minha senha
            </Link>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <span className="font-bold">Erro:</span> {error}
            </div>
          )}

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={!executeRecaptcha}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-[#313b2f] bg-[#ffd639] hover:bg-[#e6c235] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffd639] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
          >
            Entrar
          </button>

          {/* Link Cadastro */}
          <div className="text-center text-sm">
            <span className="text-gray-600">Não tem uma conta? </span>
            <Link
              to="/register"
              className="font-bold text-[#313b2f] hover:text-[#ffd639] transition-colors underline"
            >
              Cadastre-se aqui
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
