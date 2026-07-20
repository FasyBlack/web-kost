import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Facilities from '../components/Facilities';
import RoomList from '../components/RoomList';
import { supabase } from '../supabaseClient';

export default function LandingPage() {
  const whatsappLink = "https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20kost%20ini.";
  
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from('banner')
        .select('image')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const imageUrls = data.map(item => item.image);
        setBanners(imageUrls);
      } else {
        setBanners(["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000"]);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return; 

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]);

  return (
    // Tambahkan overflow-hidden di bungkus paling luar supaya gambar yang digeser ke samping tidak bikin web-nya bisa di-scroll ke kanan/kiri
    <div className="min-h-screen font-sans text-white relative overflow-hidden">
      
      {/* WADAH SLIDER BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {banners.map((img, index) => (
          <div
            key={index}
            // transition-transform adalah kunci animasi gesernya
            className="fixed inset-0 bg-cover bg-center  bg-fixed transition-transform duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${img})`,
              // Logika geser: 0% (tampil), 100% (sembunyi di kanan), -100% (sembunyi di kiri)
              transform: `translateX(${(index - currentIndex) * 100}%)`,
            }}
          />
        ))}
        {/* Overlay hitam kita pindah ke dalam sini, menutupi semua gambar biar teks tetap terbaca */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* KONTEN WEBSITE (Hero, Fasilitas, dll) */}
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