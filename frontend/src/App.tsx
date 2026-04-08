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
import ApliquesPage from "./pages/catalogs/ApliquesPage";
import TecidosPage from "./pages/catalogs/TecidosPage";
import SinteticosPageTapetes from "./pages/catalogs/SinteticosPageTapetes";
import ComposicaoLencolPage from "./pages/catalogs/ComposicaoLencolPage";
import ComposicaoSinteticoPage from "./pages/catalogs/ComposicaoSinteticoPage";
import SinteticosPage from "./pages/catalogs/SinteticosPage";
import EnvironmentPage from "./pages/EnvironmentPage";
// ROTAS PUBLICAS
import ContactPage from "./pages/ContactPage";
// ROTAS LOGADO
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductsPage from "./pages/ProductsPage";
import PosCompraPage from "./pages/PosCompraPage";
// ROTAS LOJA
import ProductDetailsPage from "./pages/ProductDetailsPage";
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
import AdminCreateProductPage from "./pages/pagesAdmin/AdminCreateProductPage";
import LowStockApliquesPage from "./pages/pagesAdmin/AdminLowStockApliquesPage";
import RestockApliquesPage from "./pages/pagesAdmin/AdminRestockApliquesPage";
import AdminEditProductPage from "./pages/pagesAdmin/AdminEditProductPage";
import UnderConstructionPage from "./pages/UnderConstructionPage";
import LencoisPage from "./pages/catalogs/LencoisPage";
import AdminCreateLencolPage from "./pages/pagesAdmin/AdminCreateLencolPage";
import ShippingQuoteRequestPage from "./pages/pagesAdmin/ShippingQuoteRequestPage";
import AdminShippingQuotePage from "./pages/pagesAdmin/AdminShippingQuotePage";
import SearchShippingQuotePage from "./pages/pagesAdmin/AdminSearchShippingQuotePage";
import EditEnvironmentPage from "./pages/pagesAdmin/AdminEditEnvironmentPage";
import PosCompraInformationPage from "./pages/PosCompraInformationPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import DetalhesPedidoPage from "./pages/OrderDetailPage";
import { AdminReportsPage } from "./pages/AdminReportsPage";
import CookieConsent from "./components/CookieConsent";
import ProtetorDeParedeProductPage from "./pages/ProtetorDeParede";
import PagamentoPendentePage from "./pages/PagamentoPendentePage";

function App() {
  const location = useLocation();
  // Verifica se a rota atual começa com "/admin" ou "/calculadora"
  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/calculadora");
  return (
    <>
      <GoogleAnalytics />
      <VersionCheck />
      <InternalAnalytics />
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
        <Route path="/loja" element={<UnderConstructionPage />} />
        {/* <Route path="/checkout" element={<UnderConstructionPage />} /> */}
        <Route path="/catalogo/apliques" element={<ApliquesPage />} />
        <Route path="/apliques" element={<ApliquesPage />} />
        <Route path="/tecidos-lencol" element={<TecidosPage />} />
        <Route path="/lencois" element={<LencoisPage />} />
        <Route path="/sinteticos/tapetes" element={<SinteticosPageTapetes />} />
        <Route path="/sinteticos" element={<SinteticosPage />} />
        <Route
          path="/pos-compra-informacoes"
          element={<PosCompraInformationPage />}
        />
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
        <Route path="/loja-teste" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/monte-seu-protetor"
          element={<ProtetorDeParedeProductPage />}
        />
        <Route
          path="/checkout/pagamento/:orderId"
          element={<PagamentoPendentePage />}
        />
        <Route element={<AuthGuard />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* <Route path="/cart" element={<UnderConstructionPage />} /> */}
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/pos-compra" element={<PosCompraPage />} />
          <Route path="/meus-pedidos" element={<MyOrdersPage />} />
          <Route path="/pedidos/:id" element={<DetalhesPedidoPage />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminPage />} />
            {/* Sub-rotas */}
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route
              path="/admin/lencol/new"
              element={<AdminCreateLencolPage />}
            />
            <Route
              path="/admin/products/new"
              element={<AdminCreateProductPage />}
            />
            <Route
              path="/admin/products/edit/:id"
              element={<AdminEditProductPage />}
            />
            <Route path="/admin/categories" element={<AdminCategoryPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
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
              path="/admin/low-stock-apliques"
              element={<LowStockApliquesPage />}
            />

            <Route
              path="/admin/composicao/protetores"
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
            <Route
              path="/admin/ambientes/edit/:id"
              element={<EditEnvironmentPage />}
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
            <Route
              path="/admin/cotacao-frete"
              element={<ShippingQuoteRequestPage />}
            />
            <Route
              path="/admin/cotacoes"
              element={<AdminShippingQuotePage />}
            />
            <Route
              path="/admin/cotacoes/pesquisa"
              element={<SearchShippingQuotePage />}
            />
            <Route path="/admin/relatorios" element={<AdminReportsPage />} />
          </Route>
        </Route>
        <Route path="/restock-apliques" element={<RestockApliquesPage />} />
      </Routes>
      {!isAdminRoute && <Footer />}
      <CookieConsent />
    </>
  );
}

export default App;
