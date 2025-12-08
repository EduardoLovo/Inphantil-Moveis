import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const EditProfilePage: React.FC = () => {
    const { user, initialize } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        fone: '',
        password: '', // Opcional
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                fone: user.fone,
                password: '',
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Remove senha se estiver vazia para não sobrescrever
            const payload: any = { ...formData };
            if (!payload.password) delete payload.password;

            await api.patch('/auth/profile', payload);

            // Recarrega os dados do usuário na store
            await initialize();

            alert('Perfil atualizado com sucesso!');
            navigate('/dashboard');
        } catch (error) {
            alert('Erro ao atualizar perfil.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="calculator-container">
            <div className="calculator-card" style={{ maxWidth: '500px' }}>
                <h1>Editar Meus Dados</h1>
                <form onSubmit={handleSubmit} className="calculator-form">
                    <div className="form-group">
                        <label>Nome:</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Telefone:</label>
                        <input
                            type="text"
                            value={formData.fone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    fone: e.target.value,
                                })
                            }
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Nova Senha (Deixe em branco para manter):</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            className="form-input"
                            placeholder="******"
                        />
                    </div>

                    <button
                        type="submit"
                        className="calculate-button"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;
