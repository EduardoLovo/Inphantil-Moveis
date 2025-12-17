import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'; // Importar// import '../components/Calculadoras.css';
import { useAuthStore } from '../../store/AuthStore';
import './RegisterPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage: React.FC = () => {
    // Estados do formulário
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        fone: '',
        password: '',
        confirmPassword: '',
    });

    // const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const register = useAuthStore((state) => state.register);
    const { executeRecaptcha } = useGoogleReCaptcha();
    // Manipula mudanças nos inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validações básicas
        if (formData.password !== formData.confirmPassword) {
            return setError('As senhas não coincidem.');
        }

        if (!executeRecaptcha) {
            setError('Aguarde o carregamento do sistema de segurança.');
            return;
        }

        setLoading(true);

        try {
            const token = await executeRecaptcha('register');
            console.log(token);

            await register({
                name: formData.name,
                email: formData.email,
                fone: formData.fone,
                password: formData.password,
                gRecaptchaResponse: token,
            });

            alert('Cadastro realizado com sucesso!');
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(
                err.response?.data?.message || 'Erro ao realizar cadastro.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Criar Conta</h2>

                {error && (
                    <div
                        style={{
                            color: 'red',
                            marginBottom: '15px',
                            textAlign: 'center',
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form ">
                    <div className="form-group-register">
                        <label>Nome Completo:</label>
                        <input
                            name="name"
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group-register">
                        <label>E-mail:</label>
                        <input
                            name="email"
                            type="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group-register">
                        <label>Telefone (WhatsApp):</label>
                        <input
                            name="fone"
                            type="text"
                            className="form-input"
                            value={formData.fone}
                            onChange={handleChange}
                            placeholder="(00) 00000-0000"
                            required
                        />
                    </div>

                    <div className="form-group-register">
                        <label htmlFor="password">Senha:</label>
                        <div className="password-input-container">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                            <button
                                type="button" // Importante: type="button" para não submeter o form
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <div className="form-group-register">
                        <label htmlFor="password">Confirmar Senha:</label>
                        <div className="password-input-container">
                            <input
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
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
                        className="register-button"
                        disabled={!executeRecaptcha}
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p>
                        Já tem uma conta?{' '}
                        <Link to="/login" style={{ fontWeight: 'bold' }}>
                            Faça Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
