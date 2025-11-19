import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AuthGuard from './components/AuthGuard';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<AuthGuard />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                {/* Todas as rotas que exigirem login ficam dentro deste bloco */}
                {/* Ex: <Route path="/orders" element={<OrdersPage />} /> */}
            </Route>
        </Routes>
    );
}

export default App;
