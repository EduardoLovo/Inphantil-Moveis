import React, { useState } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'; // Importar o hook
import './LoginPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Obtém o método login da Store
    const login = useAuthStore((state) => state.login);
    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Verificação de segurança: se o script não carregou, não permita o envio
        if (!executeRecaptcha) {
            setError(
                'O serviço de segurança ainda não foi carregado. Tente novamente.'
            );
            return;
        }

        try {
            const token = await executeRecaptcha('login');
            await login({
                email,
                password,
                gRecaptchaResponse: token,
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
            <div className="login-card">
                <h2>Acesso do Cliente</h2>
                <form onSubmit={handleSubmit} className="login-form">
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
                        <div className="password-input-container">
                            {' '}
                            {/* Container relativo */}
                            <input
                                id="password"
                                // Alterna entre 'text' e 'password'
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-input"
                            />
                            {/* Ícone clicável */}
                            <button
                                type="button" // Importante: type="button" para não submeter o form
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={!executeRecaptcha}
                    >
                        Entrar
                    </button>
                </form>
                <Link to="/forgot-password" className="link-esqueci-senha">
                    Esqueci minha senha
                </Link>
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
