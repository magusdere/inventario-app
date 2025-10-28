import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Páginas
import ProductoList from "./components/Productos/ProductoList";
import MovimientosPage from "./pages/Movimientos";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<h2 className="text-2xl font-semibold text-gray-700">Dashboard</h2>}
          />
          <Route path="/productos" element={<ProductoList />} />
          <Route
            path="/categorias"
            element={<h2 className="text-xl font-semibold text-gray-700">Gestión de Categorías</h2>}
          />
          <Route
            path="/proveedores"
            element={<h2 className="text-xl font-semibold text-gray-700">Gestión de Proveedores</h2>}
          />
          <Route path="/movimientos" element={<MovimientosPage />} />
          <Route
            path="/usuarios"
            element={<h2 className="text-xl font-semibold text-gray-700">Usuarios</h2>}
          />
          <Route
            path="/reportes"
            element={<h2 className="text-xl font-semibold text-gray-700">Reportes</h2>}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
