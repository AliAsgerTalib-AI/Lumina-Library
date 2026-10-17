import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1c1a]">
      <nav className="flex items-center gap-6 p-6 border-b border-gray-200">
        <Link data-path="scan-and-catalog" to="/" className="font-literata font-medium text-lg">Scan & Catalog</Link>
        <Link data-path="my-library" to="/library" className="font-literata font-medium text-lg">My Library</Link>
        <Link data-path="export-and-sync" to="/export" className="font-literata font-medium text-lg">Export & Sync</Link>
        <Link data-path="settings" to="/settings" className="font-literata font-medium text-lg">Settings</Link>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
