import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Star, RefreshCcw } from 'lucide-react';
import { supabase } from '../../supabaseClient'; // Pastikan path-nya sesuai
import toast from 'react-hot-toast'; // Pakai toast notifikasi andalanmu

function BookingRow({ booking, refreshData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fungsi 1: Ubah Status Booking ke Database
  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    const { error } = await supabase
      .from('booking')
      .update({ status: newStatus })
      .eq('id', booking.id);

    setIsUpdating(false);
    
    if (error) {
      toast.error('Gagal mengubah status!');
    } else {
      toast.success(`Status pesanan ${booking.nama_pemesan} menjadi ${newStatus}`);
      refreshData(); // Panggil data terbaru setelah sukses update
    }
  };

  // Fungsi 2: Chat WA Biasa (Basa-basi konfirmasi)
  const handleHubungiWA = () => {
    const pesan = `Halo kak ${booking.nama_pemesan}, saya Admin Kos.\nTerkait pesanan kamar *${booking.nama_kamar}* (No. Order: ${booking.no_order})...`;
    window.open(`https://wa.me/${booking.no_wa}?text=${encodeURIComponent(pesan)}`, '_blank');
  };

  // Fungsi 3: Tombol Sakti "Minta Ulasan"
  const handleMintaUlasan = () => {
    const linkKuesioner = `https://web-kost.vercel.app/ulasan?kode=${booking.no_order}`; // Ganti dengan domain aslimu nanti
    const pesan = `Halo kak ${booking.nama_pemesan}, terima kasih telah mempercayakan Kos kami! 🙏\n\nUntuk membantu kami meningkatkan pelayanan, yuk luangkan waktu 1 menit untuk mengisi ulasan dan pengalaman kakak selama ngekos di sini:\n\n👉 ${linkKuesioner}\n\nTerima kasih dan sukses selalu!`;
    window.open(`https://wa.me/${booking.no_wa}?text=${encodeURIComponent(pesan)}`, '_blank');
  };

  // Fungsi Helper: Tentukan Warna Badge sesuai Status
  const getBadgeColor = (status) => {
    switch (status) {
      case 'Menunggu': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Dikonfirmasi': return 'bg-green-100 text-green-700 border-green-200';
      case 'Selesai': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Dibatalkan': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Format Rupiah
  const formatRupiah = (angka) => {
    return angka ? new Intl.NumberFormat('id-ID').format(angka) : '-';
  };

  return (
    <>
      <tr 
        className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <td className="py-4 font-bold text-gray-700">{booking.no_order}</td>
        <td className="py-4 text-gray-700 font-medium">{booking.nama_pemesan}</td>
        <td className="py-4 text-gray-500">{booking.nama_kamar}</td>
        <td className="py-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getBadgeColor(booking.status)}`}>
            {booking.status}
          </span>
        </td>
        <td className="py-4 text-right pr-4">
          <button className="text-gray-400 hover:text-indigo-600 transition bg-gray-100 p-1.5 rounded-full">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </td>
      </tr>

      {/* TAMPILAN DETAIL SAAT BARIS DI-KLIK (EXPANDED) */}
      {isOpen && (
        <tr className="bg-indigo-50/40 border-b border-indigo-100">
          <td colSpan="5" className="p-6 text-sm text-gray-700">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Info Kiri */}
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-[11px] uppercase text-indigo-400 tracking-wider mb-1">No. WhatsApp</p>
                  <p className="font-medium text-gray-800">{booking.no_wa}</p>
                </div>
                <div>
                  <p className="font-bold text-[11px] uppercase text-indigo-400 tracking-wider mb-1">Rencana Check-in</p>
                  <p className="font-medium text-gray-800">{booking.tanggal_masuk || '-'}</p>
                </div>
              </div>

              {/* Info Tengah */}
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-[11px] uppercase text-indigo-400 tracking-wider mb-1">Durasi Sewa</p>
                  <p className="font-medium text-gray-800">{booking.durasi || '-'}</p>
                </div>
                <div>
                  <p className="font-bold text-[11px] uppercase text-indigo-400 tracking-wider mb-1">Total Biaya</p>
                  <p className="font-bold text-indigo-600">Rp {formatRupiah(booking.total_harga)}</p>
                </div>
              </div>

              {/* Aksi Ubah Status (Kanan) */}
              <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                <p className="font-bold text-[11px] uppercase text-gray-400 tracking-wider mb-2">Ubah Status Pesanan</p>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 cursor-pointer outline-none transition"
                  value={booking.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdating}
                >
                  <option value="Menunggu">🟡 Menunggu</option>
                  <option value="Dikonfirmasi">🟢 Dikonfirmasi</option>
                  <option value="Selesai">🔵 Selesai (Check-out)</option>
                  <option value="Dibatalkan">🔴 Dibatalkan</option>
                </select>
              </div>
            </div>

            {/* TOMBOL AKSI WHATSAPP */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-indigo-100/50">
               <button 
                onClick={handleHubungiWA}
                className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-green-600 shadow-md transition"
               >
                 <MessageCircle size={16} /> Hubungi Pemesan
               </button>
               
               {/* Tombol Minta Ulasan HANYA muncul kalau statusnya Selesai */}
               {booking.status === 'Selesai' && (
                 <button 
                  onClick={handleMintaUlasan}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md transition animate-pulse"
                 >
                   <Star size={16} /> Minta Ulasan (WA)
                 </button>
               )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function ExpandableBookingTable() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('booking')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-extrabold text-2xl text-gray-800">Data Booking Lengkap</h3>
          <p className="text-gray-500 text-sm mt-1">Kelola semua pesanan yang masuk dari Landing Page</p>
        </div>
        <button 
          onClick={fetchBookings} 
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-xl font-bold transition"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="py-4 pl-4 font-bold">No Order</th>
              <th className="py-4 font-bold">Nama Pemesan</th>
              <th className="py-4 font-bold">Tipe Kamar</th>
              <th className="py-4 font-bold">Status</th>
              <th className="py-4 pr-4 font-bold text-right">Detail</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Memuat data booking...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Belum ada data pesanan yang masuk.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <BookingRow key={b.id} booking={b} refreshData={fetchBookings} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}