import React, { useState, useRef } from 'react'; // Adicionado useRef
import { api } from '../services/api';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import './AddressForm.css';

interface AddressFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [cepLoading, setCepLoading] = useState(false);
    const [error, setError] = useState('');

    // Referência para o container do modal
    const overlayRef = useRef<HTMLDivElement>(null);

    // Estados do Formulário
    const [zipCode, setZipCode] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [recipientName, setRecipientName] = useState('');

    // Função para fechar ao clicar fora
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Se o clique foi exatamente no overlay (fundo) e não nos seus filhos (formulário)
        if (e.target === overlayRef.current) {
            onCancel();
        }
    };

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
            await api.post('/addresses', {
                recipientName,
                zipCode,
                street,
                number,
                complement,
                neighborhood,
                city,
                state,
                isDefault: false,
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao salvar endereço.');
        } finally {
            setLoading(false);
        }
    };

    // Função para formatar o CEP enquanto o usuário digita
    const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // 1. Remove tudo que não é número
        value = value.replace(/\D/g, '');

        // 2. Limita a 8 dígitos numéricos
        if (value.length > 8) {
            value = value.slice(0, 8);
        }

        // 3. Adiciona o hífen depois do 5º dígito
        // A regex captura os primeiros 5 números ($1) e o restante ($2), colocando o hífen no meio
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');

        setZipCode(value);
    };

    return (
        <div
            className="addr-modal-overlay"
            ref={overlayRef}
            onClick={handleOverlayClick}
        >
            <div className="addr-modal-container">
                <h3>Novo Endereço de Entrega</h3>

                <form onSubmit={handleSubmit} className="addr-modal-form">
                    <div className="addr-modal-group">
                        <label>Quem vai receber?</label>
                        <input
                            type="text"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="Ex: Maria Silva"
                            required
                            className="addr-modal-input"
                        />
                    </div>

                    <div className="addr-modal-group">
                        <label>CEP:</label>
                        <div className="addr-modal-cep-wrapper">
                            <input
                                type="text"
                                value={zipCode}
                                onChange={handleZipCodeChange} // Usando a nova função aqui
                                onBlur={handleBlurCep}
                                placeholder="00000-000"
                                maxLength={9}
                                required
                                className="addr-modal-input"
                            />
                            {cepLoading && (
                                <FaSpinner className="addr-modal-spinner" />
                            )}
                        </div>
                    </div>

                    <div className="addr-modal-row">
                        <div className="addr-modal-group addr-modal-flex-2">
                            <label>Rua/Logradouro:</label>
                            <input
                                type="text"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                required
                                className="addr-modal-input"
                            />
                        </div>
                        <div className="addr-modal-group addr-modal-flex-1">
                            <label>Número:</label>
                            <input
                                type="text"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                required
                                className="addr-modal-input"
                            />
                        </div>
                    </div>

                    <div className="addr-modal-row">
                        <div className="addr-modal-group addr-modal-flex-1">
                            <label>Complemento:</label>
                            <input
                                type="text"
                                value={complement}
                                onChange={(e) => setComplement(e.target.value)}
                                placeholder="Apto, Bloco..."
                                className="addr-modal-input"
                            />
                        </div>
                        <div className="addr-modal-group addr-modal-flex-1">
                            <label>Bairro:</label>
                            <input
                                type="text"
                                value={neighborhood}
                                onChange={(e) =>
                                    setNeighborhood(e.target.value)
                                }
                                required
                                className="addr-modal-input"
                            />
                        </div>
                    </div>

                    <div className="addr-modal-row">
                        <div className="addr-modal-group addr-modal-flex-2">
                            <label>Cidade:</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                                className="addr-modal-input"
                            />
                        </div>
                        <div className="addr-modal-group addr-modal-flex-1">
                            <label>UF:</label>
                            <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                maxLength={2}
                                required
                                className="addr-modal-input"
                            />
                        </div>
                    </div>

                    {error && <p className="addr-modal-error">{error}</p>}

                    <div className="addr-modal-actions">
                        <button
                            type="button"
                            className="addr-modal-btn-cancel"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="addr-modal-btn-save"
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : 'Salvar Endereço'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressForm;
