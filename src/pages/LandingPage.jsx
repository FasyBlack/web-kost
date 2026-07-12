import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Facilities from '../components/Facilities';
import RoomList from '../components/RoomList';

export default function LandingPage() {
  // Data dikumpulkan di sini, lalu dilempar (sebagai Props) ke komponen yang butuh
  const whatsappLink = "https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20kost%20ini.";
  const backgroundImages = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=2000&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=2000&q=80"
  ];

  // 2. State untuk mengingat gambar mana yang lagi tampil (dimulai dari index 0)
  const [currentIndex, setCurrentIndex] = useState(0);

  // 3. Mesin Waktu (useEffect) untuk mengganti gambar otomatis
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        // Kalau udah gambar terakhir, balik ke 0. Kalau belum, lanjut ke gambar berikutnya (+1)
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // 5000 ms = ganti setiap 5 detik

    // Bersihkan interval kalau pindah halaman biar browser nggak nge-lag
    return () => clearInterval(interval);
  }, []);
  return (
    <div 
      className="min-h-screen font-sans text-white bg-cover bg-center bg-fixed relative transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url(${backgroundImages[currentIndex]})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 pb-20">
        <Navbar whatsappLink={whatsappLink} />
        <Hero whatsappLink={whatsappLink} />
        <Facilities />
        <RoomList whatsappLink={whatsappLink} />
        
        <footer className="max-w-7xl mx-auto px-4 mt-24 text-center text-sm text-gray-300 border-t border-white/20 pt-8">
          <p>&copy; 2026 Web Kost. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}