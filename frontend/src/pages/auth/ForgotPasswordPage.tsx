import React, { useState } from 'react';
import { api } from '../../services/api';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
        } catch (error) {
            alert('Erro ao solicitar recuperação.');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="calculator-container">
                <div
                    className="calculator-card"
                    style={{ textAlign: 'center', maxWidth: '400px' }}
                >
                    <h2>Verifique seu E-mail</h2>
                    <p>
                        Enviamos um link de recuperação para{' '}
                        <strong>{email}</strong>.
                    </p>
                    <p style={{ fontSize: '0.9em', color: '#666' }}>
                        (Como é um teste local, verifique o terminal do backend
                        para ver o link)
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="calculator-container">
            <div className="calculator-card" style={{ maxWidth: '400px' }}>
                <h1>Recuperar Senha</h1>
                <p style={{ marginBottom: '20px' }}>
                    Digite seu e-mail para receber o link de redefinição.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="calculate-button"
                        disabled={loading}
                    >
                        {loading ? 'Enviando...' : 'Enviar Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
