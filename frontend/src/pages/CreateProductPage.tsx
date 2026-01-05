import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/ProductStore';
import { useCategoryStore } from '../store/CategoryStore'; // Importe a store de categorias
import {
    FaSave,
    FaArrowLeft,
    FaImages,
    FaTrash,
    FaPlus,
    FaImage,
} from 'react-icons/fa';
import './CreateProductPage.css'; // Ou AdminProductsPage.css dependendo do nome do seu arquivo

const CreateProductPage: React.FC = () => {
    const navigate = useNavigate();
    const { createProduct, isLoading } = useProductStore();

    // Busca as categorias para preencher o select
    const { categories, fetchCategories } = useCategoryStore();

    // Estados do Formulário
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [categoryId, setCategoryId] = useState('');

    // ESTADOS DE IMAGEM
    const [mainImage, setMainImage] = useState('');
    const [galleryInput, setGalleryInput] = useState('');
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    // Carrega as categorias ao abrir a página
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Adicionar imagem à galeria
    const handleAddGalleryImage = () => {
        if (galleryInput.trim()) {
            setGalleryImages([...galleryImages, galleryInput.trim()]);
            setGalleryInput('');
        }
    };

    // Remover imagem da galeria
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

        const productData = {
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            categoryId: parseInt(categoryId),
            mainImage,
            images: galleryImages,
        };

        await createProduct(productData);
        navigate('/admin/products');
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
                <h1>Novo Produto</h1>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
                {/* --- SEÇÃO 1: INFORMAÇÕES BÁSICAS --- */}
                <div className="form-section">
                    <div className="form-group">
                        <label>Nome do Produto</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Ex: Cama Casinha"
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
                                placeholder="0.00"
                            />
                        </div>
                        <div className="form-group">
                            <label>Estoque</label>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                required
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* --- CAMPO DE CATEGORIA ADICIONADO --- */}
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

                    {/* --- CAMPO DE DESCRIÇÃO CORRIGIDO --- */}
                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea
                            value={description} // Agora aponta para a variável correta
                            onChange={(e) => setDescription(e.target.value)} // Agora atualiza a variável correta
                            required
                            placeholder="Descreva os detalhes do produto..."
                            rows={4} // Deixa o campo maior
                            style={{ resize: 'vertical' }}
                        />
                    </div>
                </div>

                {/* --- SEÇÃO 2: IMAGEM DE CAPA (Grande) --- */}
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
                                <span>
                                    Cole a URL da imagem abaixo para visualizar
                                </span>
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

                {/* --- SEÇÃO 3: GALERIA --- */}
                <div className="upload-section">
                    <div className="section-title">
                        <span>
                            <FaImages /> Galeria de Fotos
                        </span>
                        <span
                            style={{ fontSize: '0.8rem', fontWeight: 'normal' }}
                        >
                            {galleryImages.length} fotos adicionadas
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
                                <FaSave /> Salvar Produto
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProductPage;
