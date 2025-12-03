import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { useProductStore } from '../store/ProductStore';

const EditProductPage = () => {
    const { id } = useParams();
    const { getProductById, updateProduct } = useProductStore();
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        if (id) {
            getProductById(Number(id)).then(setProduct);
        }
    }, [id, getProductById]);

    if (!product) return <div>Carregando...</div>;

    return (
        <ProductForm
            title={`Editar Produto: ${product.name}`}
            initialData={product}
            onSubmit={(data) => updateProduct(Number(id), data)}
        />
    );
};

export default EditProductPage;
