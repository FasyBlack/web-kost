import GlassCard from './GlassCard';
import { supabase } from '../supabaseClient';
import { useState, useEffect } from 'react';

export default function Hero() {


  const [promoRoom, setPromoRoom] = useState(null);

  useEffect(() => {
    const fetchPromoRoom = async () => {
      // Mengambil 1 kamar paling baru yang masih tersedia
      const { data, error } = await supabase
        .from('kamar')
        .select('*')
        .eq('status', 'Tersedia')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setPromoRoom(data);
      }
    };

    fetchPromoRoom();
  }, []);

  // Helper format uang
  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka);

  return (
    <header className="max-w-7xl mx-auto px-4 mt-12 md:mt-24 text-center md:text-left grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg mb-6">
          Kost Eksklusif <br /> Nyaman & Aman
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow">
          Fasilitas lengkap, keamanan 24 jam, dan lingkungan tenang untuk kenyamanan istirahat Anda.
        </p>
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <a href="#kamar" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-semibold transition shadow-lg">
            Lihat Kamar
          </a>
        </div>
      </div>

      <div className="hidden md:flex justify-end">
        {/* CARD PROMO (DINAMIS DARI DATABASE) */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-2xl relative overflow-hidden">

          {/* Kalau data masih loading, tampilkan skeleton/teks loading */}
          {!promoRoom ? (
            <div className="animate-pulse flex flex-col gap-3">
              <div className="h-4 bg-white/30 rounded w-1/2"></div>
              <div className="h-8 bg-white/30 rounded w-3/4"></div>
              <div className="h-10 bg-white/30 rounded w-full mt-2"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-white font-bold text-lg">{promoRoom.nama}</h3>
                  <p className="text-gray-200 text-xs mt-1">
                    Fasilitas Lengkap • Tipe {promoRoom.tipe}
                  </p>
                </div>
                <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded shadow-lg animate-pulse">
                  HOT
                </span>
              </div>

              <div className="mt-4 mb-5">
                <span className="text-3xl font-extrabold text-white drop-shadow-md">
                  Rp {formatRupiah(promoRoom.harga)}
                </span>
                <span className="text-gray-200 text-sm"> / {promoRoom.periode_sewa || 'Bulan'}</span>
              </div>

              {/* Tombol diarahkan ke halaman /kamar */}
              <a
                href="/kamar"
                className="block w-full bg-white text-indigo-900 text-center font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-50 transition transform hover:scale-[1.02]"
              >
                Lihat Detail & Pesan
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}