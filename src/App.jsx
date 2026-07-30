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
import Ulasan from './pages/Ulasan';
import DataTestimoni from './pages/admin/DataTestimoni';
import Pengaturan from './pages/admin/Pengaturan';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginAdmin />} />
        <Route path="/cek-pesanan" element={<CekPesanan />} />
        <Route path="/kamar" element={<SemuaKamar />} />
        <Route path="/ulasan" element={<Ulasan />} />
        
        {/* Induk Rute Admin */}
        <Route element={<Security/>}>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="booking" element={<DataBooking />} />
          <Route path="kamar" element={<DataKamar />} />
          <Route path="banner" element={<Banner />} />
          <Route path="testimoni" element={<DataTestimoni />} />
          <Route path="pengaturan" element={<Pengaturan />} />
        </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}