import { useState, useEffect } from 'react';
import { MapPin, Navigation, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Sesuaikan path ini

export default function LocationMap() {
  // 1. Siapkan Wadah Data (State)
  const [pengaturan, setPengaturan] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Ambil data dari Supabase saat komponen dirender (Effect)
  useEffect(() => {
    const fetchPengaturan = async () => {
      const { data, error } = await supabase
        .from('pengaturan')
        .select('*')
        .eq('id', 1) // Ambil settingan utama
        .single();

      if (!error && data) {
        setPengaturan(data);
      }
      setLoading(false);
    };

    fetchPengaturan();
  }, []);

  // 3. Ekstrak Link Arah (Maps URL) dari Link Embed (Iframe src)
  // Kalau admin naruh link embed iframe, tombol "Petunjuk Arah" bisa pakai trik ini
  // Kalau mau lebih rapi, di db bisa dibikin 2 kolom (1 embed, 1 URL klik)
  const directionUrl = pengaturan 
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pengaturan.alamat)}`
    : "https://maps.google.com/";

  // Jika data masih loading
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 mt-12 mb-20 relative z-10 flex justify-center py-20">
        <Loader2 className="animate-spin text-white/50" size={40} />
      </section>
    );
  }

  // Jika data kosong atau error
  if (!pengaturan) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-12 mb-20 relative z-10">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* INFORMASI LOKASI (Kiri) */}
          <div className="space-y-5 text-white">
            <div className="inline-flex items-center gap-2 bg-indigo-500/30 border border-indigo-400/40 px-3 py-1 rounded-full text-xs font-bold text-indigo-200">
              <MapPin size={14} /> Lokasi Strategis
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
              Akses Mudah Ke mana Saja
            </h2>

            {/* ALAMAT DINAMIS */}
            <p className="text-sm text-gray-200 leading-relaxed font-semibold">
              {pengaturan.alamat}
            </p>

            <ul className="space-y-2 text-xs text-gray-200">
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-400 shrink-0" />
                <span>5 Menit dari Kampus Utama</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-400 shrink-0" />
                <span>3 Menit ke Halte Bus / Stasiun</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-400 shrink-0" />
                <span>Dekat Minimarket & Area Kuliner 24 Jam</span>
              </li>
            </ul>

            <div className="pt-2">
              <a 
                href={directionUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition"
              >
                <Navigation size={16} /> Buka Petunjuk Arah
              </a>
            </div>
          </div>

          {/* GOOGLE MAPS EMBED DINAMIS (Kanan - 2 Kolom) */}
          <div className="lg:col-span-2 h-72 md:h-80 rounded-2xl overflow-hidden border border-white/30 shadow-inner bg-white/5 relative">
            
            {pengaturan.link_maps ? (
               <iframe
                 title={`Lokasi ${pengaturan.nama_kost}`}
                 src={pengaturan.link_maps}
                 width="100%"
                 height="100%"
                 style={{ border: 0 }}
                 allowFullScreen=""
                 loading="lazy"
                 referrerPolicy="no-referrer-when-downgrade"
               ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
                Peta belum diatur oleh admin.
              </div>
            )}
            
          </div>

        </div>

      </div>
    </section>
  );
}