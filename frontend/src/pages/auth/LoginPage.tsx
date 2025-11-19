import React, { useState } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { useNavigate } from 'react-router-dom';

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
        <div
            style={{
                maxWidth: '400px',
                margin: '50px auto',
                padding: '20px',
                border: '1px solid #ccc',
            }}
        >
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Futuramente, o widget do reCAPTCHA seria renderizado aqui */}

                <button type="submit" style={{ marginTop: '10px' }}>
                    Entrar
                </button>
            </form>
            {error && (
                <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
            )}
        </div>
    );
};

export default LoginPage;
