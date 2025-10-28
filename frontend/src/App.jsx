import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import DashboardPage from "./pages/Dashboard";
import ProductosPage from "./pages/Productos";
import CategoriasPage from "./pages/Categorias";
import ProveedoresPage from "./pages/Proveedores";
import UsuariosPage from "./pages/Usuarios";
import MovimientosPage from "./pages/Movimientos";
import ReportesPage from "./pages/Reportes";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/proveedores" element={<ProveedoresPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/movimientos" element={<MovimientosPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
