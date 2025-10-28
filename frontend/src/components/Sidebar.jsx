import { Link, useLocation } from "react-router-dom";
import { Package, BarChart2, Users, Layers, Truck, MoveUp, Home } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/productos", label: "Productos", icon: Package },
  { to: "/categorias", label: "Categorías", icon: Layers },
  { to: "/proveedores", label: "Proveedores", icon: Truck },
  { to: "/movimientos", label: "Movimientos", icon: MoveUp },
  { to: "/usuarios", label: "Usuarios", icon: Users },
  { to: "/reportes", label: "Reportes", icon: BarChart2 },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 bg-white border-r border-gray-200 min-h-screen shadow-sm">
      <nav className="mt-6">
        <ul className="space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center px-5 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  location.pathname === to ? "bg-blue-50 text-blue-600 font-semibold" : ""
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
