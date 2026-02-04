import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AuthGuard from "./components/AuthGuard";
import Header from "./components/Header";
import AdminPage from "./pages/AdminPage";
import AdminLogsPage from "./pages/AdminLogsPage";
import CalculadoraPagamento6040 from "./components/Calculadora6040";
import CalculadoraSobMedida from "./components/CalculadoraSobMedida";
import CalculadoraSobMedidaColchao from "./components/CalculadoraSobMedidaColchao";
import ApliquesPage from "./pages/ApliquesPage";
import Footer from "./components/Footer";
import TecidosPage from "./pages/TecidosPage";
import CreateApliquePage from "./pages/CreateApliquePage";
import AdminCategoryPage from "./pages/AdminCategoryPage";
import CreateTecidoPage from "./pages/CreateTecidoPage";
import CreateSinteticoPage from "./pages/CreateSinteticoPage";
import SinteticosPageTapetes from "./pages/SinteticosPageTapetes";
import PageCreateItem from "./pages/PageCreateItem";
import PosCompraPage from "./pages/PosCompraPage";
import ContactPage from "./pages/ContactPage";
import AdminContactPage from "./pages/AdminContactPage";
import ComposicaoPage from "./pages/ComposicaoLencolPage";
import ComposicaoSinteticoPage from "./pages/ComposicaoSinteticoPage";
import { Desenhos } from "./pages/Desenhos";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import EditProductPage from "./pages/EditProductPage";
import CreateProductPage from "./pages/CreateProductPage";
import ScrollToTop from "./components/ScrollToTop";
import GoogleAnalytics from "./components/GoogleAnalytics";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import EditProfilePage from "./pages/auth/EditProfilePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import SinteticosPage from "./pages/SinteticosPage";
import EnvironmentPage from "./pages/EnvironmentPage";
import UnderConstructionPage from "./pages/UnderConstructionPage";
import InternalAnalytics from "./components/InternalAnalytics";
import AuthCallbackPage from "./pages/auth/AuthCallbackPage";
import AdminLayout from "./components/layouts/AdminLayout";
import VersionCheck from "./components/VersionCheck";

function App() {
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
        <Route path="/catalogo/apliques" element={<ApliquesPage />} />
        <Route path="/apliques" element={<ApliquesPage />} />
        <Route path="/tecidos-lencol" element={<TecidosPage />} />
        <Route path="/sinteticos/tapetes" element={<SinteticosPageTapetes />} />
        <Route path="/sinteticos" element={<SinteticosPage />} />
        <Route path="/pos-compra" element={<PosCompraPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/composicao-lencol" element={<ComposicaoPage />} />
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
            <Route path="/admin/create/item" element={<PageCreateItem />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/logs" element={<AdminLogsPage />} />
            <Route
              path="/admin/visuals"
              element={<h1>Gerenciamento de Visuais</h1>}
            />
            <Route path="/admin/contacts" element={<AdminContactPage />} />

            <Route path="/admin/apliques/new" element={<CreateApliquePage />} />
            <Route path="/admin/tecidos/new" element={<CreateTecidoPage />} />
            <Route
              path="/admin/sinteticos/new"
              element={<CreateSinteticoPage />}
            />
            <Route path="/composicao/protetores" element={<Desenhos />} />

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
      <Footer />
    </>
  );
}

export default App;
