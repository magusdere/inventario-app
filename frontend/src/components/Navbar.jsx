export default function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">InventarioPro</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 text-sm">Administrador</span>
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>
    </header>
  );
}
