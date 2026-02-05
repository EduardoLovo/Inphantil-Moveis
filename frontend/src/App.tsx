import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthGuard from "./components/AuthGuard";
import AuthCallbackPage from "./pages/auth/AuthCallbackPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ScrollToTop from "./components/ScrollToTop";
import GoogleAnalytics from "./components/GoogleAnalytics";
// ROTAS USERS
import DashboardPage from "./pages/DashboardPage";
import EditProfilePage from "./pages/auth/EditProfilePage";
// ROTAS CATALOGOS
import ApliquesPage from "./pages/ApliquesPage";
import TecidosPage from "./pages/TecidosPage";
import SinteticosPageTapetes from "./pages/SinteticosPageTapetes";
import ComposicaoLencolPage from "./pages/ComposicaoLencolPage";
import ComposicaoSinteticoPage from "./pages/ComposicaoSinteticoPage";
import SinteticosPage from "./pages/SinteticosPage";
import EnvironmentPage from "./pages/EnvironmentPage";
// ROTAS PUBLICAS
import ContactPage from "./pages/ContactPage";
import PosCompraPage from "./pages/PosCompraPage";
// ROTAS LOJA
import ProductDetailsPage from "./pages/ProductDetailsPage";
import UnderConstructionPage from "./pages/UnderConstructionPage";
import InternalAnalytics from "./components/InternalAnalytics";
import VersionCheck from "./components/VersionCheck";
// ROTAS ADMIN
import AdminLayout from "./components/layouts/AdminLayout";
import AdminOrdersPage from "./pages/pagesAdmin/AdminOrdersPage";
import AdminProductsPage from "./pages/pagesAdmin/AdminProductsPage";
import AdminUsersPage from "./pages/pagesAdmin/AdminUsersPage";
import AdminUserDetailsPage from "./pages/pagesAdmin/AdminUserDetailsPage";
import AdminCreateEnvironmentPage from "./pages/pagesAdmin/AdminCreateEnvironmentPage";
import AdminCreateApliquePage from "./pages/pagesAdmin/AdminCreateApliquePage";
import AdminCategoryPage from "./pages/pagesAdmin/AdminCategoryPage";
import AdminCreateTecidoPage from "./pages/pagesAdmin/AdminCreateTecidoPage";
import AdminCreateSinteticoPage from "./pages/pagesAdmin/AdminCreateSinteticoPage";
import AdminPage from "./pages/pagesAdmin/AdminPage";
import AdminLogsPage from "./pages/pagesAdmin/AdminLogsPage";
import AdminContactPage from "./pages/pagesAdmin/AdminContactPage";
import AdminCreateItemPage from "./pages/pagesAdmin/AdminCreateItemPage";
import AdminProtetoresDeParedePage from "./pages/pagesAdmin/AdminProtetoresDeParede";
import CalculadoraPagamento6040 from "./pages/pagesAdmin/AdminCalculadora6040";
import CalculadoraSobMedida from "./pages/pagesAdmin/AdminCalculadoraSobMedidaCama";
import CalculadoraSobMedidaColchao from "./pages/pagesAdmin/AdminCalculadoraSobMedidaColchao";
import EditProductPage from "./pages/EditProductPage";
import CreateProductPage from "./pages/CreateProductPage";

function App() {
  const location = useLocation();
  // Verifica se a rota atual começa com "/admin" ou "/calculadora"
  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/calculadora");
  return (
    <>
      <VersionCheck />
      <InternalAnalytics />
      <GoogleAnalytics />
      <ScrollToTop />
      <div className="md:hidden">
        <Header />
      </div>{" "}
      <div className="hidden md:block">
        <Header />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<UnderConstructionPage />} />
        <Route path="/cart" element={<UnderConstructionPage />} />
        <Route path="/catalogo/apliques" element={<ApliquesPage />} />
        <Route path="/apliques" element={<ApliquesPage />} />
        <Route path="/tecidos-lencol" element={<TecidosPage />} />
        <Route path="/sinteticos/tapetes" element={<SinteticosPageTapetes />} />
        <Route path="/sinteticos" element={<SinteticosPage />} />
        <Route path="/pos-compra" element={<PosCompraPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/composicao-lencol" element={<ComposicaoLencolPage />} />
        <Route
          path="/composicao-sintetico"
          element={<ComposicaoSinteticoPage />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/showroom" element={<EnvironmentPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route element={<AuthGuard />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route element={<AdminLayout />}>
            {/* A rota index é o /admin (Dashboard principal) */}
            <Route path="/admin" element={<AdminPage />} />

            {/* Sub-rotas */}
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/products/new" element={<CreateProductPage />} />
            <Route
              path="/admin/products/edit/:id"
              element={<EditProductPage />}
            />

            <Route path="/admin/categories" element={<AdminCategoryPage />} />
            <Route
              path="/admin/create/item"
              element={<AdminCreateItemPage />}
            />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/:id" element={<AdminUserDetailsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/logs" element={<AdminLogsPage />} />
            <Route
              path="/admin/visuals"
              element={<h1>Gerenciamento de Visuais</h1>}
            />
            <Route path="/admin/contacts" element={<AdminContactPage />} />

            <Route
              path="/composicao/protetores"
              element={<AdminProtetoresDeParedePage />}
            />
            {/* Criar itens */}
            <Route
              path="/admin/apliques/new"
              element={<AdminCreateApliquePage />}
            />
            <Route
              path="/admin/tecidos/new"
              element={<AdminCreateTecidoPage />}
            />
            <Route
              path="/admin/sinteticos/new"
              element={<AdminCreateSinteticoPage />}
            />
            <Route
              path="/admin/ambientes/new"
              element={<AdminCreateEnvironmentPage />}
            />
            {/* Calculadoras dentro do Admin */}
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
          </Route>
        </Route>
        <Route path="/profile/edit" element={<EditProfilePage />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
