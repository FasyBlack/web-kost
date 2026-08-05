import { useState, useEffect, useRef } from 'react';
import { Bell, BedDouble, Star, Info } from 'lucide-react';
import { supabase } from '../../supabaseClient';

export default function AdminHeader() {
  const [notifs, setNotifs] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      let combined = [];

      // 1. Ambil data pesanan kamar yang baru masuk (Status: Menunggu)
      const { data: bookings } = await supabase
        .from('booking')
        .select('*')
        .eq('status', 'Menunggu')
        .order('created_at', { ascending: false })
        .limit(5);

      if (bookings && bookings.length > 0) {
        const bookingNotifs = bookings.map(b => ({
          id: `book_${b.id}`,
          type: 'booking',
          title: 'Pesanan Kamar Baru',
          desc: `${b.nama_pemesan} memesan ${b.nama_kamar}`,
          time: b.created_at
        }));
        combined = [...combined, ...bookingNotifs];
      }

      // 2. Ambil ulasan terbaru (Dari tabel testimoni)
      // Catatan: Jika namamu di database beda, sesuaikan field 'nama_pengirim'-nya
      const { data: testimonis, error } = await supabase
        .from('testimoni')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && testimonis && testimonis.length > 0) {
        const testiNotifs = testimonis.map(t => ({
          id: `testi_${t.id}`,
          type: 'review',
          title: 'Ulasan Baru Masuk',
          desc: `${t.nama || t.nama_pengirim || 'Seseorang'} memberikan ulasan bintang.`,
          time: t.created_at
        }));
        combined = [...combined, ...testiNotifs];
      }

      // Urutkan semua notifikasi dari yang paling baru
      combined.sort((a, b) => new Date(b.time) - new Date(a.time));
      
      setNotifs(combined);
      if (combined.length > 0) {
        setHasUnread(true);
      }
    };

    fetchNotifs();
  }, []);

  // Fungsi untuk menutup dropdown kalau user klik di luar kotak
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    setHasUnread(false); // Hilangkan titik merah ketika dibuka
  };

  // Helper format tanggal menjadi (misal: 12 Agt, 14:30)
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 px-8 py-4 flex justify-between items-center z-50 border-b border-gray-100 shadow-sm transition-all">
      <div className="relative w-64">
        {/* Bisa diisi fitur Search Global nanti */}
      </div>
      
      <div className="flex items-center gap-5">
        
        {/* ========================================= */}
        {/* WADAH LONCENG & DROPDOWN NOTIFIKASI */}
        {/* ========================================= */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={handleBellClick}
            className="relative p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
          >
            {/* Animate-pulse bikin loncengnya nyala kalau ada notif baru */}
            <Bell size={22} className={hasUnread ? "animate-pulse" : ""} />
            
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          {/* DROPDOWN POP-UP NOTIFIKASI */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2">
              
              <div className="bg-indigo-600 px-4 py-3 flex justify-between items-center">
                <h4 className="text-white font-bold text-sm">Notifikasi</h4>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {notifs.length} Baru
                </span>
              </div>
              
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifs.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 flex flex-col items-center">
                    <Info size={24} className="mb-2 opacity-50" />
                    <p className="text-sm">Belum ada notifikasi baru.</p>
                  </div>
                ) : (
                  notifs.map((notif) => (
                    <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-indigo-50/50 transition cursor-pointer flex gap-3">
                      {/* Icon Notifikasi (Bed untuk booking, Star untuk ulasan) */}
                      <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${notif.type === 'booking' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {notif.type === 'booking' ? <BedDouble size={14} /> : <Star size={14} />}
                      </div>
                      
                      {/* Teks Notifikasi */}
                      <div>
                        <h5 className="text-sm font-bold text-gray-800 mb-0.5">{notif.title}</h5>
                        <p className="text-xs text-gray-600 mb-1 leading-relaxed">{notif.desc}</p>
                        <p className="text-[10px] font-bold text-gray-400">{formatTime(notif.time)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                <button 
                  onClick={() => setShowDropdown(false)} 
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                >
                  Tutup Notifikasi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================= */}
        {/* PROFIL ADMIN (Lebih Elegan) */}
        {/* ========================================= */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-5">
          <div className="text-right hidden md:block">
            <p className="text-sm font-extrabold text-gray-800">Admin Utama</p>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Pemilik Kost</p>
          </div>
          {/* Menggunakan API Avatar dinamis biar kelihatan lebih real */}
          <img 
            src="https://ui-avatars.com/api/?name=Admin+Utama&background=6366f1&color=fff&bold=true" 
            alt="Profile Admin" 
            className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-105 transition cursor-pointer"
          />
        </div>

      </div>
    </header>
  );
}