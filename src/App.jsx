import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import DashboardHome from './pages/admin/DashboardHome';
import DataBooking from './pages/admin/DataBooking';
import DataKamar from './pages/admin/DataKamar';
import Banner from './pages/admin/Banner';
import LoginAdmin from './pages/LoginAdmin';
import Security from './components/Security';
import CekPesanan from './pages/CekPesanan';
import SemuaKamar from './pages/SemuaKamar';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginAdmin />} />
        <Route path="/cek-pesanan" element={<CekPesanan />} />
        <Route path="/kamar" element={<SemuaKamar />} />
        
        {/* Induk Rute Admin */}
        <Route element={<Security/>}>
        <Route path="/admin" element={<AdminDashboard />}>
          {/* Anak-anak rute yang tayang di dalam Outlet */}
          <Route index element={<DashboardHome />} />
          <Route path="booking" element={<DataBooking />} />
          <Route path="kamar" element={<DataKamar />} />
          <Route path="banner" element={<Banner />} />
        </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}