import { LayoutDashboard, Users, Calendar, LogOut, ImageIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  // useLocation buat ngecek kita lagi di halaman mana
  const location = useLocation();

  // Logika buat ngubah warna menu aktif
  const menuStyle = (path) => {
    return location.pathname === path 
      ? "flex items-center gap-3 bg-indigo-50 text-indigo-600 px-4 py-3 rounded-xl font-semibold transition" 
      : "flex items-center gap-3 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 px-4 py-3 rounded-xl font-medium transition";
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between h-screen sticky top-0">
      <div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 tracking-wider">MA<span className="text-gray-800">KOS</span></h1>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          
          <Link to="/admin" className={menuStyle('/admin')}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>

          <Link to="/admin/banner" className={menuStyle('/admin/banner')}>
            <ImageIcon size={20} /> Banner
          </Link>
          
          <Link to="/admin/booking" className={menuStyle('/admin/booking')}>
            <Users size={20} /> Data Booking
          </Link>
          
          <Link to="/admin/kamar" className={menuStyle('/admin/kamar')}>
            <Calendar size={20} /> Kamar
          </Link>

        </nav>
      </div>
      <div className="p-4">
        <button className="flex items-center gap-3 text-gray-500 hover:text-red-500 px-4 py-3 font-medium transition w-full">
          <Link to="/"
           > Logout
           </Link>
        </button>
      </div>
    </aside>
  );
}