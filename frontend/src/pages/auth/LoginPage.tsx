import React, { useState } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Obtém o método login da Store
    const login = useAuthStore((state) => state.login);

    // 🚨 Nota: Como estamos no desenvolvimento, usaremos um token mockado
    // até que o widget do reCAPTCHA seja implementado.
    const RECAPTCHA_MOCK_TOKEN = 'teste';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login({
                email,
                password,
                gRecaptchaResponse: RECAPTCHA_MOCK_TOKEN,
            });
            // Se o login for bem-sucedido, redireciona para a página inicial ou dashboard
            navigate('/dashboard');
        } catch (err) {
            // Exibe a mensagem de erro da Store
            setError(
                err instanceof Error
                    ? err.message
                    : 'Falha desconhecida no login.'
            );
        }
    };

    return (
        <div className="login-container">
            {' '}
            {/* Container Principal */}
            <div className="login-card">
                {' '}
                {/* Card com Sombra */}
                <h2>Acesso do Cliente</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Campo Email */}
                    <div className="form-group-login">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Entrar
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p className="login-link-text">
                    Não tem conta?{' '}
                    <Link to="/register" className="login-link">
                        Cadastre-se aqui
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
