import React, { useState, type FormEvent } from "react";
import { api } from "../services/api";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaWhatsapp,
} from "react-icons/fa";
import { useAuthStore } from "../store/AuthStore";

const ContactPage: React.FC = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await api.post("/contact", formData);
      setStatus({
        type: "success",
        text: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        text: "Erro ao enviar mensagem. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-6 md:pt-32 pb-20 text-[#313b2f]">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
        Fale Conosco
      </h1>
      <p className="text-center text-gray-500 text-lg mb-10 max-w-2xl mx-auto">
        Estamos aqui para ajudar! Tire suas dúvidas sobre camas montessorianas,
        entregas ou projetos especiais.
      </p>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* --- Coluna 1: Informações de Contato --- */}
        <div className="w-full md:flex-1 bg-[#fdfdfd] p-8 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#313b2f] border-b-2 border-[#ffd639] pb-3 mb-6">
            Canais de Atendimento
          </h3>

          <div className="flex items-start mb-6">
            <FaPhone className="text-[#ffd639] text-2xl mt-1 mr-4" />
            <div>
              <h4 className="font-bold text-[#313b2f] mb-1">
                WhatsApp / Telefone
              </h4>
              <p className="text-gray-600">
                {" "}
                (61) 98238-8828
                <a
                  href="https://wa.me/5561982388828"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-2 py-2 ml-2 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#20bd5a] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <FaWhatsapp className="text-xl" />
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start mb-6">
            <FaEnvelope className="text-[#ffd639] text-2xl mt-1 mr-4" />
            <div>
              <h4 className="font-bold text-[#313b2f] mb-1">E-mail</h4>
              <p className="text-gray-600">contato@inphantil.com.br</p>
            </div>
          </div>

          <div className="flex items-start mb-6">
            <FaMapMarkerAlt className="text-[#ffd639] text-2xl mt-1 mr-4" />
            <div>
              <h4 className="font-bold text-[#313b2f] mb-1">Endereço</h4>
              <p className="text-gray-600">Jandaia do Sul - PR</p>
              <p className="text-gray-500 text-sm">
                Enviamos para todo o Brasil
              </p>
            </div>
          </div>
        </div>

        {/* --- Coluna 2: Formulário --- */}
        <div className="w-full md:flex-[1.5] bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
          <h3 className="text-xl font-bold text-[#313b2f] mb-6">
            Envie uma Mensagem
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-[#313b2f] mb-1">
                Nome:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="block font-bold text-[#313b2f] mb-1">
                E-mail:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block font-bold text-[#313b2f] mb-1">
                Assunto:
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all"
                placeholder="Dúvida, Orçamento, etc."
              />
            </div>

            <div>
              <label className="block font-bold text-[#313b2f] mb-1">
                Mensagem:
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffd639] focus:border-transparent outline-none transition-all resize-none"
                placeholder="Como podemos ajudar?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#ffd639] text-[#313b2f] font-bold py-3 px-6 rounded-lg hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <FaPaperPlane /> Enviar Mensagem
                </>
              )}
            </button>

            {status && (
              <div
                className={`mt-4 p-3 rounded-lg text-center font-bold ${
                  status.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {status.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
