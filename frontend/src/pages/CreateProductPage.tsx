import ProductForm from '../components/ProductForm';
import { useProductStore } from '../store/ProductStore';

const CreateProductPage = () => {
    const createProduct = useProductStore((state) => state.createProduct);

    return (
        <ProductForm title="Cadastrar Novo Produto" onSubmit={createProduct} />
    );
};

export default CreateProductPage;
