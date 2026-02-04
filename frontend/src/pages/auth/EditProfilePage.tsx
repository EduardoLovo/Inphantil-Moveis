import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/AuthStore";
import { api } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FaUserEdit, FaArrowLeft, FaSave, FaSpinner } from "react-icons/fa";

const EditProfilePage: React.FC = () => {
  const { user, initialize } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    fone: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        fone: user.fone || "",
        password: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = { ...formData };
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

            {/* Senha */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-sm font-bold text-[#313b2f] mb-1">
                Nova Senha{" "}
                <span className="text-gray-400 font-normal">(Opcional)</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all text-gray-700"
                placeholder="Deixe em branco para manter a atual"
              />
              <p className="text-xs text-gray-400 mt-1">
                Preencha apenas se desejar alterar sua senha de acesso.
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
