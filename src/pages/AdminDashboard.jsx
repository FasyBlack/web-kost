import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { Outlet } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-indigo-50 font-sans text-gray-800">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-y-hidden">
        <AdminHeader />
        
        {/* Tempat Layar TV-nya */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>

      </main>
    </div>
  );
}