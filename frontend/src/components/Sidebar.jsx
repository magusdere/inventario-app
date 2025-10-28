import { NavLink } from "react-router-dom";

const linkBase =
  "flex items-center gap-3 px-3 py-2 rounded-lg transition";
const linkActive =
  "bg-primary text-white";
const linkInactive =
  "text-gray-700 hover:bg-primary/10 hover:text-primary";

function Item({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? linkActive : linkInactive}`
      }
    >
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside
      className="hidden md:block border-r bg-white p-4"
      style={{ width: "var(--sidebar-width)" }}
    >
      <div className="mb-2 px-1 text-xs uppercase tracking-wide text-gray-500">
        Menú
      </div>
      <nav className="flex flex-col gap-1">
        <Item to="/" label="Dashboard" />
        <Item to="/productos" label="Productos" />
        <Item to="/categorias" label="Categorías" />
        <Item to="/proveedores" label="Proveedores" />
        <Item to="/usuarios" label="Usuarios" />
        <Item to="/movimientos" label="Movimientos" />
        <Item to="/reportes" label="Reportes" />
      </nav>
    </aside>
  );
}
