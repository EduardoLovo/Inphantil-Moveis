
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';
//Rotas
import { Home } from './pages/Home';
import { Login } from "./pages/Login";
import { ListaApliques } from "./components/ComponentsCatalogo/ListaApliques";
import { ApliquesParaCliente } from "./pages/ApliquesParaCliente";
import { ApliquesParaCortar } from "./pages/ApliquesParaCortar";
import { ApliquesParaComprar } from "./pages/ApliquesParaComprar";
import { CalculadoraParaLencois } from "./pages/CalculadoraParaLencois";
import { Calculadora6040 } from "./pages/Calculadora6040";
import { Info } from "./pages/Info";
import { ApliquesEstoque } from "./pages/ApliquesEstoque";
import { ApliquesEdit } from "./pages/ApliquesEdit";
import { JwtHandler } from "./jwt.handler/jwt_handler";

function App() {
  const PrivateRoute = ({ children, redirectTo }) => {
    const isAuthenticated = JwtHandler.isJwtValid();
    // console.log("isAuh:", isAuthenticated);
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
  };

  return (
    <div className='App'>
      <Sidebar/>
      <div className='bodyApp'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/apliques-adm" element={<ListaApliques />} />
          <Route path="/catalogo-cliente" element={<ApliquesParaCliente />} />
         
          <Route path="/apliques-estoque" element={<ApliquesEstoque />} />
          
          <Route path="/info" element={<Info />} />

          <Route
          path="/apliques-para-cortar"
          element={
            <PrivateRoute redirectTo="/">
              <ApliquesParaCortar />
            </PrivateRoute>
          }
          />
          <Route
          path="/apliques-para-comprar"
          element={
            <PrivateRoute redirectTo="/">
              <ApliquesParaComprar />
            </PrivateRoute>
          }
          />
          <Route
          path="/apliques-para-comprar"
          element={
            <PrivateRoute redirectTo="/">
              <ApliquesParaComprar />
            </PrivateRoute>
          }
          />

          <Route
          path="/CalculadoraParaLencois"
          element={
            <PrivateRoute redirectTo="/">
              <CalculadoraParaLencois />
            </PrivateRoute>
          }
          />

          <Route
          path="/calculadora-60-40"
          element={
            <PrivateRoute redirectTo="/">
              <Calculadora6040 />
            </PrivateRoute>
          }
          />

          <Route
          path="/editar-aplique/:id/"
          element={
            <PrivateRoute redirectTo="/">
              <ApliquesEdit />
            </PrivateRoute>
          }
          />

        </Routes>
      </div>
    </div>
  );
}

export default App;
