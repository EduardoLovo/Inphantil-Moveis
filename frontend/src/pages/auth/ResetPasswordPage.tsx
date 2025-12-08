import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return alert('Token inválido.');

        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                token,
                newPassword: password,
            });
            alert('Senha alterada com sucesso!');
            navigate('/login');
        } catch (error) {
            alert('Erro ao alterar senha. O link pode ter expirado.');
        } finally {
            setLoading(false);
        }
    };

    if (!token)
        return (
            <div className="calculator-container">
                <h1>Link inválido.</h1>
            </div>
        );

    return (
        <div className="calculator-container">
            <div className="calculator-card" style={{ maxWidth: '400px' }}>
                <h1>Nova Senha</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Digite sua nova senha:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            required
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        className="calculate-button"
                        disabled={loading}
                    >
                        {loading ? 'Alterando...' : 'Alterar Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
