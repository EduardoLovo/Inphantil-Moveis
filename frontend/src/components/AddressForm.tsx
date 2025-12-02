import React, { useState } from 'react';
import { api } from '../services/api';
import axios from 'axios';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import './AddressForm.css'; // Vamos criar a seguir

interface AddressFormProps {
    onSuccess: () => void; // Função para chamar quando o cadastro der certo
    onCancel: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [cepLoading, setCepLoading] = useState(false);
    const [error, setError] = useState('');

    // Estados do Formulário
    const [zipCode, setZipCode] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [recipientName, setRecipientName] = useState('');

    // Função para buscar o CEP (ViaCEP)
    const handleBlurCep = async () => {
        const cep = zipCode.replace(/\D/g, '');
        if (cep.length !== 8) return;

        setCepLoading(true);
        try {
            const response = await axios.get(
                `https://viacep.com.br/ws/${cep}/json/`
            );
            if (response.data.erro) {
                setError('CEP não encontrado.');
                return;
            }
            setStreet(response.data.logradouro);
            setNeighborhood(response.data.bairro);
            setCity(response.data.localidade);
            setState(response.data.uf);
            setError('');
        } catch (err) {
            setError('Erro ao buscar CEP.');
        } finally {
            setCepLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Envia para o SEU backend
            await api.post('/addresses', {
                recipientName,
                zipCode,
                street,
                number,
                complement,
                neighborhood,
                city,
                state,
                isDefault: false, // O backend já trata isso (se for o primeiro, vira padrão)
            });

            onSuccess(); // Fecha o modal e recarrega a lista
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao salvar endereço.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="address-form-container">
            <h3>Novo Endereço de Entrega</h3>

            <form onSubmit={handleSubmit} className="address-form">
                {/* Linha 1: Nome do Destinatário */}
                <div className="form-group">
                    <label>Quem vai receber?</label>
                    <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Ex: Maria Silva"
                        required
                        className="form-input"
                    />
                </div>

                {/* Linha 2: CEP */}
                <div className="form-group">
                    <label>CEP:</label>
                    <div className="cep-input-wrapper">
                        <input
                            type="text"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            onBlur={handleBlurCep} // Busca ao sair do campo
                            placeholder="00000-000"
                            maxLength={9}
                            required
                            className="form-input"
                        />
                        {cepLoading && (
                            <FaSpinner className="spin cep-spinner" />
                        )}
                    </div>
                </div>

                {/* Linha 3: Rua e Número */}
                <div className="form-row">
                    <div className="form-group flex-2">
                        <label>Rua/Logradouro:</label>
                        <input
                            type="text"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group flex-1">
                        <label>Número:</label>
                        <input
                            type="text"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                </div>

                {/* Linha 4: Complemento e Bairro */}
                <div className="form-row">
                    <div className="form-group flex-1">
                        <label>Complemento:</label>
                        <input
                            type="text"
                            value={complement}
                            onChange={(e) => setComplement(e.target.value)}
                            placeholder="Apto, Bloco..."
                            className="form-input"
                        />
                    </div>
                    <div className="form-group flex-1">
                        <label>Bairro:</label>
                        <input
                            type="text"
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                </div>

                {/* Linha 5: Cidade e Estado */}
                <div className="form-row">
                    <div className="form-group flex-2">
                        <label>Cidade:</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group flex-1">
                        <label>UF:</label>
                        <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            maxLength={2}
                            required
                            className="form-input"
                        />
                    </div>
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="form-actions">
                    <button type="button" onClick={onCancel} disabled={loading}>
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="save-btn"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar Endereço'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddressForm;
