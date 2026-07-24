import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Sesuaikan path jika berbeda
import { Home, CheckCircle2, XCircle, Clock } from 'lucide-react';
import BookingTable from '../../components/admin/BookingTable';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalKamar: 0,
    tersedia: 0,
    terisi: 0,
    menunggu: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    // 1. Ambil data status kamar
    const { data: dataKamar } = await supabase
      .from('kamar')
      .select('status');

    // 2. Ambil JUMLAH booking yang statusnya 'Menunggu'
    const { count: countMenunggu } = await supabase
      .from('booking')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Menunggu');

    if (dataKamar) {
      const total = dataKamar.length;
      const tersedia = dataKamar.filter(k => k.status === 'Tersedia').length;
      const terisi = dataKamar.filter(k => k.status === 'Penuh').length;

      setStats({
        totalKamar: total,
        tersedia: tersedia,
        terisi: terisi,
        menunggu: countMenunggu || 0
      });
    }
  };

  return (
    <>
      {/* BANNER SAPAAN DINAMIS */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg shadow-indigo-200 mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Selamat Pagi, Admin!</h2>
          <p className="text-indigo-100">
            {stats.menunggu > 0 
              ? `Ada ${stats.menunggu} bookingan kamar baru hari ini yang perlu dicek.` 
              : 'Belum ada bookingan baru yang menunggu konfirmasi saat ini.'}
          </p>
        </div>
        {stats.menunggu > 0 && (
          <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-bold shadow hover:bg-gray-50 transition">
            Cek Sekarang
          </button>
        )}
      </div>

      {/* 4 KARTU STATISTIK RINGKASAN */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Home size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Kamar</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalKamar}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Kamar Tersedia</p>
            <p className="text-2xl font-bold text-gray-800">{stats.tersedia}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><XCircle size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Kamar Terisi</p>
            <p className="text-2xl font-bold text-gray-800">{stats.terisi}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Booking Menunggu</p>
            <p className="text-2xl font-bold text-gray-800">{stats.menunggu}</p>
          </div>
        </div>
      </div>

      {/* TABEL 5 BOOKING TERBARU */}
      <BookingTable />
    </>
  );
}