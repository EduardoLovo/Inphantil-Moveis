import React, { useState } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { useNavigate, Link } from 'react-router-dom';
import type { RegisterDto } from '../../types/auth'; // Usando import type
import './RegisterPage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState<RegisterDto>({
        name: '',
        email: '',
        fone: '',
        password: '',
        // Mock do token de segurança
        gRecaptchaResponse: 'teste',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Obtém o método register da Store
    const register = useAuthStore((state) => state.register);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Chama o método register da store
            await register(formData);

            // Se o registro for bem-sucedido, redireciona para o dashboard
            navigate('/dashboard');
        } catch (err) {
            // Exibe a mensagem de erro (ex: Conflito de Email)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Falha desconhecida no registro.'
            );
        }
    };

    return (
        <div className="register-container">
            {' '}
            {/* Container Principal */}
            <div className="register-card">
                {' '}
                {/* Card com Sombra */}
                <h2>Crie sua Conta</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    {/* Campo Nome */}
                    <div className="form-group-login">
                        <label htmlFor="name">Nome Completo:</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    {/* Campo Email */}
                    <div className="form-group-login">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    {/* Campo Telefone */}
                    <div className="form-group-login">
                        <label htmlFor="fone">Telefone:</label>
                        <input
                            id="fone"
                            type="text"
                            name="fone"
                            value={formData.fone}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    {/* Campo Senha */}
                    <div className="form-group-login">
                        <label htmlFor="password">Senha:</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <button type="submit" className="register-button">
                        Cadastrar
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p className="login-link-text">
                    Já tem conta?{' '}
                    <Link to="/login" className="login-link">
                        Faça Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
