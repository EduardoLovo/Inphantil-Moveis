import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/AuthStore";
import { api } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUserEdit,
  FaArrowLeft,
  FaSave,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const EditProfilePage: React.FC = () => {
  const { user, initialize } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estados para controlar a visibilidade das senhas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    fone: "",
    password: "",
    confirmPassword: "", // Novo campo
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        fone: user.fone || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validação: Senhas iguais
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("As senhas não conferem! Por favor, verifique.");
      setLoading(false);
      return;
    }

    try {
      // Cria uma cópia e remove o confirmPassword antes de enviar
      const payload: any = { ...formData };
      delete payload.confirmPassword; // Não enviamos este campo para o backend

      if (!payload.password) delete payload.password;

      await api.patch("/auth/profile", payload);
      await initialize();

      alert("Perfil atualizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      alert("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:pt-32 pb-20">
      {/* Botão Voltar */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#313b2f] mb-6 font-medium transition-colors"
      >
        <FaArrowLeft className="text-sm" /> Voltar ao Painel
      </Link>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#313b2f] p-6 text-center md:text-left flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-full">
            <FaUserEdit className="text-[#ffd639] text-2xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white ">Editar Meus Dados</h1>
            <p className="text-gray-300 text-sm">
              Atualize suas informações pessoais.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div>
              <label className="block text-sm font-bold text-[#313b2f] mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all text-gray-700"
                required
                placeholder="Seu nome"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-[#313b2f] mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all text-gray-700"
                required
                placeholder="seu@email.com"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-bold text-[#313b2f] mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                value={formData.fone}
                onChange={(e) =>
                  setFormData({ ...formData, fone: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all text-gray-700"
                required
                placeholder="(00) 00000-0000"
              />
            </div>

            {/* SEÇÃO DE SENHA */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              {/* Nova Senha */}
              <div>
                <label className="block text-sm font-bold text-[#313b2f] mb-1">
                  Nova Senha{" "}
                  <span className="text-gray-400 font-normal">(Opcional)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all text-gray-700 pr-12"
                    placeholder="Deixe em branco para manter a atual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#313b2f] transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar Nova Senha (Só aparece se digitar senha) */}
              {formData.password.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold text-[#313b2f] mb-1">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all text-gray-700 pr-12 ${
                        formData.confirmPassword &&
                        formData.password !== formData.confirmPassword
                          ? "border-red-300 focus:ring-red-200"
                          : "border-gray-200"
                      }`}
                      placeholder="Repita a nova senha"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#313b2f] transition-colors"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        As senhas não coincidem.
                      </p>
                    )}
                </div>
              )}

              <p className="text-xs text-gray-400">
                Preencha os campos de senha apenas se desejar alterar seu
                acesso.
              </p>
            </div>

            {/* Botão Salvar */}
            <button
              type="submit"
              className="w-full mt-4 py-3 bg-[#ffd639] text-[#313b2f] font-bold rounded-xl hover:bg-[#e6c235] hover:-translate-y-1 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <FaSave /> Salvar Alterações
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
