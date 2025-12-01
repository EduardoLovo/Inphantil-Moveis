import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AuthGuard from './components/AuthGuard';
import ProductsPage from './pages/ProductsPage';
import Header from './components/Header';
import AdminPage from './pages/AdminPage';
import AdminLogsPage from './pages/AdminLogsPage';
import CalculadoraPagamento6040 from './components/Calculadora6040';
import CalculadoraSobMedida from './components/CalculadoraSobMedida';
import CalculadoraSobMedidaColchao from './components/CalculadoraSobMedidaColchao';
import ApliquesPage from './pages/ApliquesPage';
import Footer from './components/Footer';
import TecidosPage from './pages/TecidosPage';
import CreateApliquePage from './pages/CreateApliquePage';
import AdminCategoryPage from './pages/AdminCategoryPage';
import CreateTecidoPage from './pages/CreateTecidoPage';
import CreateSinteticoPage from './pages/CreateSinteticoPage';
import SinteticosPage from './pages/SinteticosPage';
import PageCreateItem from './pages/PageCreateItem';
import PosCompraPage from './pages/PosCompraPage';
import ContactPage from './pages/ContactPage';
import AdminContactPage from './pages/AdminContactPage';
import ComposicaoPage from './pages/ComposicaoLencolPage';
import ComposicaoSinteticoPage from './pages/ComposicaoSinteticoPage';
import { Desenhos } from './pages/Desenhos';

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/catalogo/apliques" element={<ApliquesPage />} />
                <Route path="/apliques" element={<ApliquesPage />} />
                <Route path="/tecidos-lencol" element={<TecidosPage />} />
                <Route path="/sinteticos" element={<SinteticosPage />} />
                <Route path="/pos-compra" element={<PosCompraPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/composicao-lencol" element={<ComposicaoPage />} />
                <Route
                    path="/composicao-sintetico"
                    element={<ComposicaoSinteticoPage />}
                />
                <Route element={<AuthGuard />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route
                        path="/admin/products"
                        element={<h1>Gerenciamento de Produtos</h1>}
                    />
                    <Route
                        path="/admin/categories"
                        element={<AdminCategoryPage />}
                    />{' '}
                    {/* NOVO: Rota de Categorias */}
                    <Route
                        path="/admin/orders"
                        element={<h1>Gerenciamento de Pedidos</h1>}
                    />
                    <Route path="/admin/logs" element={<AdminLogsPage />} />
                    <Route
                        path="/admin/visuals"
                        element={<h1>Gerenciamento de Visuais</h1>}
                    />
                    <Route
                        path="/calculadora-cama-sob-medida"
                        element={<CalculadoraSobMedida />}
                    />
                    <Route
                        path="/calculadora-medida-do-colchao"
                        element={<CalculadoraSobMedidaColchao />}
                    />
                    <Route
                        path="/calculadora-6040"
                        element={<CalculadoraPagamento6040 />}
                    />
                    <Route
                        path="/admin/apliques/new"
                        element={
                            // SUGESTAO: Use seu componente de rota protegida aqui (ex: <PrivateRoute roles={['ADMIN', 'DEV']}>)
                            <CreateApliquePage />
                        }
                    />
                    <Route
                        path="/admin/tecidos/new"
                        element={<CreateTecidoPage />}
                    />
                    <Route
                        path="/admin/sinteticos/new"
                        element={<CreateSinteticoPage />}
                    />
                    <Route
                        path="/admin/create/item"
                        element={<PageCreateItem />}
                    />
                    <Route
                        path="/admin/contacts"
                        element={<AdminContactPage />}
                    />{' '}
                    <Route
                        path="/composicao-protetores"
                        element={<Desenhos />}
                    />{' '}
                    {/* NOVO */}
                </Route>
            </Routes>
            <Footer />
        </>
    );
}

export default App;
