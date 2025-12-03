import React, { useEffect, useState, type FormEvent } from 'react';
import { useCategoryStore } from '../store/CategoryStore';
import { Link, useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import axios from 'axios'; // Importante para tratamento de erro

// 1. Interface atualizada para bater com o Schema do Prisma
interface ProductFormData {
    name: string;
    sku: string; // Antes era 'code'
    price: string;
    stock: number;
    categoryId: string;
    description: string;
    mainImage: string; // Antes era 'imageUrl'
    images: string[];
    size: string;
    color: string;
    slug: string;
    isAvailable: boolean;
    isFeatured: boolean;
}

interface Props {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    title: string;
}

const ProductForm: React.FC<Props> = ({ initialData, onSubmit, title }) => {
    const navigate = useNavigate();
    const { categories, fetchCategories } = useCategoryStore();

    // Estado separado para o input de texto das imagens (facilita a digitação)
    const [imagesInput, setImagesInput] = useState('');

    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        sku: '', // Corrigido
        price: '',
        stock: 0,
        categoryId: '',
        description: '',
        mainImage: '', // Corrigido
        images: [],
        size: '',
        color: '',
        slug: '',
        isAvailable: true,
        isFeatured: false,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();

        if (initialData) {
            setFormData({
                name: initialData.name || '',
                sku: initialData.sku || '', // Mapeia direto
                price: initialData.price
                    ? initialData.price.toString().replace('.', ',')
                    : '',
                stock: initialData.stock || 0,
                categoryId: initialData.categoryId
                    ? initialData.categoryId.toString()
                    : '',
                description: initialData.description || '',
                mainImage: initialData.mainImage || '', // Mapeia direto

                // Se vier do banco como objetos {id, url}, extrai só a url
                images:
                    initialData.images && Array.isArray(initialData.images)
                        ? initialData.images.map((img: any) =>
                              typeof img === 'string' ? img : img.url
                          )
                        : [],

                size: initialData.size || '',
                color: initialData.color || '',
                slug: initialData.slug || '',
                isAvailable: initialData.isAvailable ?? true,
                isFeatured: initialData.isFeatured ?? false,
            });

            // Popula o campo de texto das imagens extras
            if (initialData.images && Array.isArray(initialData.images)) {
                const urls = initialData.images.map((img: any) =>
                    typeof img === 'string' ? img : img.url
                );
                setImagesInput(urls.join(', '));
            }
        }
    }, [fetchCategories, initialData]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const imagesArray = imagesInput
                .split(',')
                .map((url) => url.trim())
                .filter((url) => url !== '');

            // Como renomeamos o estado para 'sku' e 'mainImage',
            // não precisamos mais fazer renomeação manual aqui.
            const payload = {
                ...formData,
                price: parseFloat(
                    formData.price.replace('.', '').replace(',', '.')
                ),
                stock: Number(formData.stock),
                categoryId: formData.categoryId
                    ? Number(formData.categoryId)
                    : null,
                images: imagesArray,
            };

            if (isNaN(payload.price)) {
                alert('Preço inválido.');
                setLoading(false);
                return;
            }

            await onSubmit(payload);
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            let msg = 'Erro ao salvar produto.';

            if (axios.isAxiosError(error) && error.response) {
                // Se for erro de validação (array de mensagens), junta elas
                const responseMsg = error.response.data.message;
                msg = Array.isArray(responseMsg)
                    ? responseMsg.join('\n')
                    : responseMsg;
            }

            alert(`Erro:\n${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="calculator-container">
            <div className="calculator-card">
                <h1>{title}</h1>

                <form onSubmit={handleSubmit} className="calculator-form">
                    {/* Linha 1 */}
                    <div className="form-row">
                        <div className="form-group flex-2">
                            <label>Nome do Produto:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label>Preço (R$):</label>
                            <input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="0,00"
                                required
                            />
                        </div>
                    </div>

                    {/* Linha 2 - Agora usando 'sku' */}
                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>SKU / Código:</label>
                            <input
                                type="text"
                                name="sku" // Alterado de 'code' para 'sku'
                                value={formData.sku}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label>Estoque:</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label>Categoria:</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">Selecione...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Imagem Principal - Agora usando 'mainImage' */}
                    <div className="form-group">
                        <label>URL da Imagem Principal:</label>
                        <input
                            type="text"
                            name="mainImage" // Alterado de 'imageUrl' para 'mainImage'
                            value={formData.mainImage}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="https://..."
                        />
                    </div>

                    {/* Galeria de Imagens */}
                    <div className="form-group">
                        <label>Galeria de Imagens (URLs):</label>
                        <p
                            style={{
                                fontSize: '0.8em',
                                color: '#666',
                                margin: '0 0 5px 0',
                            }}
                        >
                            Separe os links por vírgula
                        </p>
                        <textarea
                            name="imagesInput"
                            value={imagesInput}
                            onChange={(e) => setImagesInput(e.target.value)}
                            rows={3}
                            className="form-input"
                            placeholder="https://imagem1.com, https://imagem2.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrição:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="form-input"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>Tamanho:</label>
                            <input
                                type="text"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Ex: Solteiro"
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label>Cor:</label>
                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Ex: Natural"
                            />
                        </div>
                    </div>

                    <div className="form-row checkboxes-row">
                        <div className="form-group checkbox-group">
                            <label>Disponível para Venda:</label>
                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={handleCheck}
                                className="form-checkbox"
                            />
                        </div>
                        <div className="form-group checkbox-group">
                            <label>Destaque (Home):</label>
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleCheck}
                                className="form-checkbox"
                            />
                        </div>
                    </div>

                    <div
                        className="form-actions"
                        style={{
                            marginTop: '30px',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '15px',
                        }}
                    >
                        <Link
                            to="/admin/products"
                            style={{
                                textDecoration: 'none',
                                color: '#666',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '10px 20px',
                                border: '1px solid #ccc',
                                borderRadius: '6px',
                            }}
                        >
                            <FaTimes /> Cancelar
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="calculate-button"
                            style={{
                                width: 'auto',
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            {loading ? (
                                <FaSpinner className="spin" />
                            ) : (
                                <>
                                    <FaSave /> Salvar Produto
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
