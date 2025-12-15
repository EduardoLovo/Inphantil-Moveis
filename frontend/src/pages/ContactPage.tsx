import React, { useState, type FormEvent } from 'react';
import { api } from '../services/api';
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaPaperPlane,
} from 'react-icons/fa';
import './ContactPage.css';
import { useAuthStore } from '../store/AuthStore';

const ContactPage: React.FC = () => {
    const { user } = useAuthStore(); // 2. Pegue o usuário logado
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            await api.post('/contact', formData);
            setStatus({
                type: 'success',
                text: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
            });
            setFormData({ name: '', email: '', subject: '', message: '' }); // Limpa formulário
        } catch (error) {
            setStatus({
                type: 'error',
                text: 'Erro ao enviar mensagem. Tente novamente.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page-container">
            <h1>Fale Conosco</h1>
            <p className="contact-intro">
                Estamos aqui para ajudar! Tire suas dúvidas sobre camas
                montessorianas, entregas ou projetos especiais.
            </p>

            <div className="contact-wrapper">
                {/* Coluna 1: Informações de Contato */}
                <div className="contact-info-card">
                    <h3>Canais de Atendimento</h3>

                    <div className="info-item">
                        <FaPhone className="info-icon" />
                        <div>
                            <h4>WhatsApp / Telefone</h4>
                            <p>(61) 98238-8828</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <FaEnvelope className="info-icon" />
                        <div>
                            <h4>E-mail</h4>
                            <p>contato@inphantil.com.br</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <FaMapMarkerAlt className="info-icon" />
                        <div>
                            <h4>Endereço</h4>
                            <p>Jandaia do Sul - PR</p>
                            <p>Enviamos para todo o Brasil</p>
                        </div>
                    </div>
                </div>

                {/* Coluna 2: Formulário */}
                <div className="contact-form-card">
                    <h3>Envie uma Mensagem</h3>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label>Nome:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Seu nome completo"
                            />
                        </div>

                        <div className="form-group">
                            <label>E-mail:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>Assunto:</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Dúvida, Orçamento, etc."
                            />
                        </div>

                        <div className="form-group">
                            <label>Mensagem:</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="form-input"
                                rows={5}
                                placeholder="Como podemos ajudar?"
                            />
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                'Enviando...'
                            ) : (
                                <>
                                    <FaPaperPlane /> Enviar Mensagem
                                </>
                            )}
                        </button>

                        {status && (
                            <div className={`status-message ${status.type}`}>
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
