import React, { useState } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { useNavigate, Link } from 'react-router-dom';
import type { RegisterDto } from '../../types/auth'; // Usando import type

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
        <div
            style={{
                maxWidth: '400px',
                margin: '50px auto',
                padding: '20px',
                border: '1px solid #ccc',
            }}
        >
            <h2>Crie sua Conta</h2>
            <form onSubmit={handleSubmit}>
                {/* Campo Nome */}
                <div>
                    <label>Nome Completo:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Campo Email */}
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Campo Telefone */}
                <div>
                    <label>Telefone:</label>
                    <input
                        type="text"
                        name="fone"
                        value={formData.fone}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Campo Senha */}
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* O gRecaptchaResponse está mockado no estado */}

                <button type="submit" style={{ marginTop: '15px' }}>
                    Cadastrar
                </button>
            </form>
            {error && (
                <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
            )}

            <p style={{ marginTop: '15px' }}>
                Já tem conta? <Link to="/login">Faça Login</Link>
            </p>
        </div>
    );
};

export default RegisterPage;
