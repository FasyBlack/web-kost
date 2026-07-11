
import { MapPin, Wifi, ShieldCheck, Wind, Star, BedDouble, Coffee, MessageCircle } from 'lucide-react';

// Ini dia yang error tadi (Komponen Reusable untuk Efek Kaca)
const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg ${className}`}>
    {children}
  </div>
);

export default function App() {
  // Nanti ganti nomornya dengan WA saudaramu
  const whatsappLink = "https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20kost%20ini.";

  return (
    <div 
      className="min-h-screen font-sans text-white bg-cover bg-center bg-fixed relative"
      // Nanti URL gambar ini diganti dengan foto depan kost saudaramu
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000')" }}
    >
      {/* Overlay hitam transparan supaya tulisan putih tetap terbaca */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Konten Utama */}
      <div className="relative z-10 pb-20">
        
        {/* NAVBAR */}
        <nav className="p-4 md:px-8 pt-6 w-full max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold tracking-wider drop-shadow-md">
            KOST<span className="text-blue-300">KU</span>
          </div>
          <a href={whatsappLink} target="_blank" rel="noreferrer">
            <GlassCard className="px-5 py-2 rounded-full flex items-center gap-2 hover:bg-white/30 transition cursor-pointer">
              <MessageCircle size={18} />
              <span className="text-sm font-medium">Tanya Admin</span>
            </GlassCard>
          </a>
        </nav>

        {/* HERO SECTION (Atas) */}
        <header className="max-w-7xl mx-auto px-4 mt-12 md:mt-24 text-center md:text-left grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg mb-6">
              Kost Eksklusif <br/> Nyaman & Aman
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
            <GlassCard className="p-6 max-w-sm w-full">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="font-bold text-lg text-white">Kamar Premium</h3>
                    <p className="text-sm text-gray-200">Sisa 2 Kamar!</p>
                 </div>
                 <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">HOT</span>
              </div>
              <div className="text-3xl font-bold mb-4">Rp 1.5 Jt<span className="text-sm font-normal text-gray-200"> / bulan</span></div>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="block w-full bg-white text-blue-900 text-center py-2 rounded-lg font-bold hover:bg-gray-100 transition">
                Pesan Sekarang
              </a>
            </GlassCard>
          </div>
        </header>

        {/* FASILITAS SECTION */}
        <section className="max-w-7xl mx-auto px-4 mt-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 drop-shadow-md">Fasilitas Kost</h2>
            <p className="text-gray-200">Kenyamanan Anda adalah prioritas kami</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="flex flex-col items-center justify-center p-6 text-center hover:-translate-y-1 transition duration-300">
              <Wifi size={40} className="mb-3 text-blue-300" />
              <h3 className="font-bold">WiFi Ngebut</h3>
              <p className="text-xs text-gray-200 mt-1">Up to 100 Mbps</p>
            </GlassCard>
            <GlassCard className="flex flex-col items-center justify-center p-6 text-center hover:-translate-y-1 transition duration-300">
              <Wind size={40} className="mb-3 text-blue-300" />
              <h3 className="font-bold">Full AC</h3>
              <p className="text-xs text-gray-200 mt-1">Setiap kamar dingin</p>
            </GlassCard>
            <GlassCard className="flex flex-col items-center justify-center p-6 text-center hover:-translate-y-1 transition duration-300">
              <ShieldCheck size={40} className="mb-3 text-blue-300" />
              <h3 className="font-bold">Aman 24 Jam</h3>
              <p className="text-xs text-gray-200 mt-1">CCTV & Akses Kunci</p>
            </GlassCard>
            <GlassCard className="flex flex-col items-center justify-center p-6 text-center hover:-translate-y-1 transition duration-300">
              <MapPin size={40} className="mb-3 text-blue-300" />
              <h3 className="font-bold">Lokasi Strategis</h3>
              <p className="text-xs text-gray-200 mt-1">Dekat kampus & mall</p>
            </GlassCard>
          </div>
        </section>

        {/* DAFTAR KAMAR SECTION */}
        <section id="kamar" className="max-w-7xl mx-auto px-4 mt-24">
           <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 drop-shadow-md">Pilihan Kamar</h2>
            <p className="text-gray-200">Pilih sesuai kebutuhan dan budget Anda</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Tipe 1 */}
            <GlassCard className="p-0 overflow-hidden flex flex-col">
              <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80" alt="Kamar Standar" className="w-full h-48 object-cover" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-1">Kamar Standar</h3>
                <div className="flex gap-1 text-yellow-400 mb-3">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} /><Star size={16} />
                </div>
                <ul className="text-sm text-gray-200 mb-4 space-y-2 flex-1">
                  <li className="flex items-center gap-2"><BedDouble size={16} /> Kasur Single</li>
                  <li className="flex items-center gap-2"><Wind size={16} /> Kipas Angin</li>
                  <li className="flex items-center gap-2"><Coffee size={16} /> Dapur Luar</li>
                </ul>
                <div className="text-2xl font-bold mb-4">Rp 800 Rb<span className="text-sm font-normal text-gray-300">/bln</span></div>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="block text-center bg-white/20 hover:bg-white/30 border border-white/50 py-2 rounded-lg transition font-medium">Booking Sekarang</a>
              </div>
            </GlassCard>

            {/* Tipe 2 */}
            <GlassCard className="p-0 overflow-hidden flex flex-col border-blue-400 border-2 relative">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">FAVORIT</div>
              <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80" alt="Kamar Premium" className="w-full h-48 object-cover" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-1">Kamar Premium</h3>
                <div className="flex gap-1 text-yellow-400 mb-3">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <ul className="text-sm text-gray-200 mb-4 space-y-2 flex-1">
                  <li className="flex items-center gap-2"><BedDouble size={16} /> Springbed Double</li>
                  <li className="flex items-center gap-2"><Wind size={16} /> AC & KM Dalam</li>
                  <li className="flex items-center gap-2"><Wifi size={16} /> Free WiFi</li>
                </ul>
                <div className="text-2xl font-bold mb-4">Rp 1.5 Jt<span className="text-sm font-normal text-gray-300">/bln</span></div>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="block text-center bg-blue-500 hover:bg-blue-600 py-2 rounded-lg transition font-bold text-white shadow-lg">Booking Sekarang</a>
              </div>
            </GlassCard>
            
            {/* Tipe 3 (Bisa ditambah nanti) */}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="max-w-7xl mx-auto px-4 mt-24 text-center text-sm text-gray-300 border-t border-white/20 pt-8">
          <p>&copy; 2026 Web Kost. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
}