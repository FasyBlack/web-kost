import { Search, Bell } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="bg-white/50 backdrop-blur-md sticky top-0 px-8 py-4 flex justify-between items-center z-10">
      <div className="relative w-64">
        {/* <Search className="absolute left-3 top-2.5 text-gray-400" size={18} /> */}
        {/* <input type="text" placeholder="Cari nama pemesan..." className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /> */}
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-indigo-600 transition">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 border-l pl-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-700">Admin Utama</p>
            <p className="text-xs text-gray-400">Pemilik Kost</p>
          </div>
          <div className="w-10 h-10 bg-indigo-200 rounded-full border-2 border-indigo-500"></div>
        </div>
      </div>
    </header>
  );
}