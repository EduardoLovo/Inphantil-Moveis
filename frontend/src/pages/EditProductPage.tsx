import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductStore } from '../store/ProductStore';
import { useCategoryStore } from '../store/CategoryStore';
import {
    FaSave,
    FaArrowLeft,
    FaImages,
    FaTrash,
    FaPlus,
    FaImage,
} from 'react-icons/fa';
import './CreateProductPage.css';

const EditProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { products, fetchProducts, updateProduct, isLoading } =
        useProductStore();
    const { categories, fetchCategories } = useCategoryStore();

    // Estados do Formulário
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [categoryId, setCategoryId] = useState('');

    // Estados de Imagem
    const [mainImage, setMainImage] = useState('');
    const [galleryInput, setGalleryInput] = useState('');
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    // 1. Carregar Categorias e Produtos
    useEffect(() => {
        const loadData = async () => {
            await fetchCategories();
            if (products.length === 0) {
                await fetchProducts();
            }
        };
        loadData();
    }, [fetchCategories, fetchProducts, products.length]);

    // 2. Preencher o formulário
    useEffect(() => {
        if (id && products.length > 0) {
            const productToEdit = products.find((p) => p.id === Number(id));

            if (productToEdit) {
                setName(productToEdit.name);
                setDescription(productToEdit.description || '');
                setPrice(productToEdit.price.toString());
                setStock(productToEdit.stock.toString());

                if (productToEdit.category) {
                    setCategoryId(productToEdit.category.id.toString());
                } else if (productToEdit.categoryId) {
                    setCategoryId(productToEdit.categoryId.toString());
                }

                setMainImage(productToEdit.mainImage || '');

                // --- CORREÇÃO DO ARRAY DE IMAGENS ---
                if (
                    productToEdit.images &&
                    Array.isArray(productToEdit.images)
                ) {
                    const urls = productToEdit.images.map((img: any) => {
                        // Se for objeto, extrai a url. Se for string, usa ela mesma.
                        return typeof img === 'object' && img.url
                            ? img.url
                            : img;
                    });
                    setGalleryImages(urls);
                }
                // -------------------------------------
            }
        }
    }, [id, products]);

    const handleAddGalleryImage = () => {
        if (galleryInput.trim()) {
            setGalleryImages([...galleryImages, galleryInput.trim()]);
            setGalleryInput('');
        }
    };

    const handleRemoveImage = (index: number) => {
        const newGallery = galleryImages.filter((_, i) => i !== index);
        setGalleryImages(newGallery);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!categoryId) {
            alert('Por favor, selecione uma categoria.');
            return;
        }

        const priceNumber = parseFloat(price);
        const stockNumber = parseInt(stock);

        if (isNaN(priceNumber) || isNaN(stockNumber)) {
            alert('Preço e Estoque devem ser números válidos.');
            return;
        }

        // Prepara os dados limpos
        const productData = {
            name,
            description,
            price: Number(priceNumber.toFixed(2)),
            stock: stockNumber,
            categoryId: parseInt(categoryId),
            mainImage,
            images: galleryImages, // Agora garantimos que isso é string[]
        };

        try {
            await updateProduct(Number(id), productData);
            navigate('/admin/products');
        } catch (error: any) {
            console.error('Erro detalhado:', error);
            const serverMessage = error.response?.data?.message;

            let displayMessage = 'Erro ao atualizar produto.';
            if (Array.isArray(serverMessage)) {
                displayMessage = `Erros de validação:\n- ${serverMessage.join(
                    '\n- '
                )}`;
            } else if (typeof serverMessage === 'string') {
                displayMessage = serverMessage;
            }
            alert(displayMessage);
        }
    };

    return (
        <div className="admin-page-container">
            <div className="admin-header">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="back-button"
                >
                    <FaArrowLeft /> Voltar
                </button>
                <h1>Editar Produto</h1>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
                {/* INFORMAÇÕES BÁSICAS */}
                <div className="form-section">
                    <div className="form-group">
                        <label>Nome do Produto</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Preço (R$)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                step="0.01"
                            />
                        </div>
                        <div className="form-group">
                            <label>Estoque</label>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Categoria</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">Selecione uma categoria...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            style={{ resize: 'vertical' }}
                        />
                    </div>
                </div>

                {/* IMAGEM DE CAPA */}
                <div className="upload-section">
                    <div className="section-title">
                        <span>
                            <FaImage /> Foto de Capa
                        </span>
                    </div>
                    <div className="main-image-preview">
                        {mainImage ? (
                            <>
                                <img src={mainImage} alt="Capa" />
                                <button
                                    type="button"
                                    className="btn-remove-image"
                                    onClick={() => setMainImage('')}
                                    style={{ top: 10, right: 10 }}
                                >
                                    <FaTrash />
                                </button>
                            </>
                        ) : (
                            <div className="empty-preview">
                                <FaImage size={40} />
                                <span>Cole a URL da imagem abaixo</span>
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label>URL da Imagem Principal</label>
                        <input
                            type="text"
                            value={mainImage}
                            onChange={(e) => setMainImage(e.target.value)}
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {/* GALERIA */}
                <div className="upload-section">
                    <div className="section-title">
                        <span>
                            <FaImages /> Galeria de Fotos
                        </span>
                        <span
                            style={{ fontSize: '0.8rem', fontWeight: 'normal' }}
                        >
                            {galleryImages.length} fotos
                        </span>
                    </div>

                    <div
                        className="add-photo-row"
                        style={{ display: 'flex', gap: '10px' }}
                    >
                        <input
                            type="text"
                            value={galleryInput}
                            onChange={(e) => setGalleryInput(e.target.value)}
                            placeholder="Cole a URL da foto extra aqui..."
                            style={{ flex: 1 }}
                        />
                        <button
                            type="button"
                            className="btn-upload"
                            onClick={handleAddGalleryImage}
                        >
                            <FaPlus /> Adicionar
                        </button>
                    </div>

                    {galleryImages.length > 0 ? (
                        <div className="gallery-grid">
                            {galleryImages.map((url, index) => (
                                <div key={index} className="image-card">
                                    <img src={url} alt={`Galeria ${index}`} />
                                    <button
                                        type="button"
                                        className="btn-remove-image"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p
                            style={{
                                color: '#999',
                                marginTop: '20px',
                                textAlign: 'center',
                            }}
                        >
                            Nenhuma foto extra adicionada.
                        </p>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="save-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            'Salvando...'
                        ) : (
                            <>
                                <FaSave /> Atualizar Produto
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProductPage;
