import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../store/ProductStore";
import { useCategoryStore } from "../../store/CategoryStore";
import {
  FaSave,
  FaArrowLeft,
  FaImages,
  FaTrash,
  FaPlus,
  FaImage,
  FaBoxOpen,
  FaTag,
  FaDollarSign,
  FaLayerGroup,
  FaSpinner,
} from "react-icons/fa";

const AdminCreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { createProduct, isLoading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  // Estados do Formulário
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Estados de Imagem
  const [mainImage, setMainImage] = useState("");
  const [galleryInput, setGalleryInput] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddGalleryImage = () => {
    if (galleryInput.trim()) {
      setGalleryImages([...galleryImages, galleryInput.trim()]);
      setGalleryInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    const newGallery = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newGallery);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      alert("Por favor, selecione uma categoria.");
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
    navigate("/admin/products");
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 pt-24 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#313b2f] flex items-center gap-3">
            <FaBoxOpen className="text-[#ffd639]" /> Novo Produto
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Adicione um novo item ao catálogo.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold shadow-sm self-start md:self-auto"
        >
          <FaArrowLeft /> Voltar
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* --- COLUNA ESQUERDA: DADOS PRINCIPAIS --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#313b2f] mb-4 flex items-center gap-2 pb-2 border-b border-gray-50">
              <FaTag className="text-gray-400" /> Informações Básicas
            </h2>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ex: Cama Casinha"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Descrição Detalhada
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Descreva os materiais, dimensões e detalhes..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all resize-y"
                />
              </div>

              {/* Preço e Estoque */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {/* CORREÇÃO AQUI: removido 'block', mantido 'flex' */}
                  <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <FaDollarSign className="text-gray-400" /> Preço (R$)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all"
                  />
                </div>
                <div>
                  {/* CORREÇÃO AQUI: removido 'block', mantido 'flex' */}
                  <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <FaLayerGroup className="text-gray-400" /> Estoque Inicial
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Categoria
                </label>
                <div className="relative">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all appearance-none bg-white cursor-pointer"
                  >
                    <option value="">Selecione uma categoria...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- COLUNA DIREITA: IMAGENS --- */}
        <div className="space-y-6">
          {/* Imagem de Capa */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#313b2f] mb-4 flex items-center gap-2">
              <FaImage className="text-gray-400" /> Foto de Capa
            </h2>

            <div className="mb-4">
              {mainImage ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group">
                  <img
                    src={mainImage}
                    alt="Capa"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setMainImage("")}
                    className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <div className="aspect-video rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                  <FaImage className="text-4xl mb-2 opacity-50" />
                  <span className="text-xs">Cole a URL abaixo</span>
                </div>
              )}
            </div>

            <input
              type="text"
              value={mainImage}
              onChange={(e) => setMainImage(e.target.value)}
              placeholder="URL da imagem principal..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all text-sm"
            />
          </div>

          {/* Galeria */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#313b2f] flex items-center gap-2">
                <FaImages className="text-gray-400" /> Galeria
              </h2>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded font-bold text-gray-500">
                {galleryImages.length} fotos
              </span>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                placeholder="URL da foto extra..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffd639] outline-none transition-all text-sm"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), handleAddGalleryImage())
                }
              />
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaPlus />
              </button>
            </div>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {galleryImages.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                  >
                    <img
                      src={url}
                      alt={`Galeria ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 text-xs py-4 italic">
                Nenhuma foto extra.
              </p>
            )}
          </div>

          {/* Botão Salvar */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#ffd639] text-[#313b2f] font-bold rounded-xl hover:bg-[#e6c235] hover:-translate-y-1 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" /> Salvando...
              </>
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

export default AdminCreateProductPage;
