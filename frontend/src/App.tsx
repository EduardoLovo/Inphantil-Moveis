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
                </Route>
            </Routes>
            <Footer />
        </>
    );
}

export default App;
