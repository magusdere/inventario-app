export default function Navbar() {
  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-bold">I</span>
        </div>
        <h1 className="font-semibold text-gray-800">InventarioPro</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-sm text-gray-600">admin</span>
        <div className="h-8 w-8 rounded-full bg-gray-200" />
      </div>
    </header>
  );
}
