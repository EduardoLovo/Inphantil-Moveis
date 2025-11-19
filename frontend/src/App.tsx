import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AuthGuard from './components/AuthGuard';
import ProductsPage from './pages/ProductsPage';
import Header from './components/Header';
import AdminPage from './pages/AdminPage';

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductsPage />} />

                <Route element={<AuthGuard />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/admin" element={<AdminPage />} />

                    {/* NOVAS ROTAS DE ADMINISTRAÇÃO (MESMO QUE SEJAM PLACEHOLDERS POR AGORA) */}
                    {/* Criaremos os componentes depois */}
                    <Route
                        path="/admin/products"
                        element={<h1>Gerenciamento de Produtos</h1>}
                    />
                    <Route
                        path="/admin/categories"
                        element={<h1>Gerenciamento de Categorias</h1>}
                    />
                    <Route
                        path="/admin/orders"
                        element={<h1>Gerenciamento de Pedidos</h1>}
                    />
                    <Route
                        path="/admin/logs"
                        element={<h1>Logs de Acesso</h1>}
                    />
                    <Route
                        path="/admin/visuals"
                        element={<h1>Gerenciamento de Visuais</h1>}
                    />
                </Route>
            </Routes>
        </>
    );
}

export default App;
