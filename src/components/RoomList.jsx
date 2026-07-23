import { useState, useEffect } from 'react';
import { BedDouble, LayoutGrid, Users, CheckCircle2, Loader2 } from 'lucide-react';
import GlassCard from './GlassCard'; // Tetap pakai GlassCard kebanggaanmu!
import { supabase } from '../supabaseClient';

export default function RoomList() {
  // 1. State untuk menampung data dari Supabase
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Tarik data dari Supabase (Backend) saat komponen pertama dimuat
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('kamar')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRooms(data);
      }
      setLoading(false);
    };

    fetchRooms();
  }, []);

  // Helper Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID').format(angka);
  };

  // Helper Bikin Link WA Otomatis sesuai Kamar yang Dipilih
  const getWhatsAppLink = (room) => {
    const nomorWA = "6281234567890"; // Ganti nomor WA Admin kamu di sini
    const text = `Halo Admin, saya tertarik untuk booking kamar *${room.nama}* (${room.tipe}) dengan harga Rp ${formatRupiah(room.harga)} / ${room.periode_sewa || 'Bulan'}. Apakah masih tersedia?`;
    return `https://wa.me/${nomorWA}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="kamar" className="max-w-7xl mx-auto px-4 mt-24 relative z-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2 drop-shadow-md text-white">Pilihan Kamar</h2>
        <p className="text-gray-200 text-sm">Temukan tipe kamar yang sesuai dengan kenyamanan Anda</p>
      </div>

      {/* JIKA MASIH LOADING */}
      {loading ? (
        <div className="flex justify-center items-center py-12 text-white gap-2">
          <Loader2 className="animate-spin" size={20} /> Memuat daftar kamar...
        </div>
      ) : rooms.length === 0 ? (
        /* JIKA DATA KOSONG */
        <GlassCard className="p-8 text-center text-gray-200">
          Belum ada data kamar yang tersedia saat ini.
        </GlassCard>
      ) : (
        /* GRID DAFTAR KAMAR DARI SUPABASE */
        <div className="grid md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <GlassCard 
              key={room.id} 
              className={`p-0 overflow-hidden flex flex-col justify-between relative transition duration-300 hover:scale-[1.02] ${
                room.tipe === 'Premium' ? 'border-blue-400 border-2' : ''
              }`}
            >
              <div>
                {/* Foto Kamar & Status Badge */}
                <div className="relative">
                  <img 
                    src={room.image} 
                    alt={room.nama} 
                    className="w-full h-48 object-cover" 
                  />
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow ${
                    room.status === 'Tersedia' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {room.status}
                  </span>
                </div>

                {/* Info Utama */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{room.nama}</h3>
                    <span className="text-xs bg-white/20 text-white px-2 py-1 rounded border border-white/30">
                      {room.tipe}
                    </span>
                  </div>

                  {/* Spesifikasi (Ukuran, Kasur, Kapasitas) */}
                  <div className="flex gap-3 text-xs text-gray-200 mb-4 pb-3 border-b border-white/10">
                    <span className="flex items-center gap-1"><LayoutGrid size={14} /> {room.ukuran || '-'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><BedDouble size={14} /> {room.kasur || '-'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Users size={14} /> {room.kapasitas || '-'}</span>
                  </div>

                  {/* List Fasilitas */}
                  <ul className="text-sm text-gray-200 mb-6 space-y-2">
                    {room.fasilitas && room.fasilitas.split(',').slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 size={14} className="text-green-400 shrink-0" />
                        <span className="truncate">{feat.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Harga & Tombol Booking */}
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold text-white mb-4">
                  Rp {formatRupiah(room.harga)}
                  <span className="text-xs font-normal text-gray-300"> / {room.periode_sewa || 'Bulan'}</span>
                </div>

                <a 
                  href={getWhatsAppLink(room)} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`block text-center py-2.5 rounded-lg transition font-bold text-sm ${
                    room.status === 'Tersedia' 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg border border-blue-400' 
                      : 'bg-gray-500/50 text-gray-300 cursor-not-allowed pointer-events-none'
                  }`}
                >
                  {room.status === 'Tersedia' ? 'Booking Sekarang' : 'Kamar Penuh'}
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </section>
  );
}