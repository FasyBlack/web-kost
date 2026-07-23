import { Star, Quote } from 'lucide-react';

const testimonialsData = [
  {
    id: 1,
    name: "Rizky Febrian",
    roomType: "Penghuni Kamar Premium A",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
    rating: 5,
    comment: "Kost-nya bersih banget, ibu kost ramah. WiFi kenceng buat nugas malam-malam!"
  },
  {
    id: 2,
    name: "Siti Rahmawati",
    roomType: "Penghuni Kamar Standar B",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    rating: 5,
    comment: "Lingkungannya tenang, cocok banget buat mahasiswa yang butuh fokus belajar."
  },
  {
    id: 3,
    name: "Budi Santoso",
    roomType: "Penghuni Kamar Eksklusif C",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
    rating: 5,
    comment: "Fasilitas lengkap setara apartemen. Kasurnya empuk, AC dingin, air mandi panas joss!"
  },
  {
    id: 4,
    name: "Andini Putri",
    roomType: "Penghuni Harian C",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    rating: 4,
    comment: "Sangat recomended buat transit harian. Pelayanan cepat dan kamarnya wangi."
  }
];

export default function Testimonials() {
  // Duplikasi data agar animasi marquee berjalan mulus tanpa jeda (seamless loop)
  const doubledTestimonials = [...testimonialsData, ...testimonialsData];

  return (
    <section className="max-w-7xl mx-auto px-4 mt-20 relative z-10">
      
      {/* WADAH UTAMA TESTIMONI */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* HEADER & AKUMULASI BINTANG DI POJOK KANAN */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow">
              Apa Kata Penghuni?
            </h2>
            <p className="text-xs md:text-sm text-gray-200 mt-1">
              Pengalaman nyata dari mereka yang pernah menetap di kost kami.
            </p>
          </div>

          {/* AKUMULASI BINTANG (POJOK KANAN ATAS) */}
          <div className="bg-white/15 border border-white/30 backdrop-blur-lg px-4 py-2 rounded-2xl flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={18} fill="currentColor" />
              <span className="text-lg font-extrabold text-white">4.9</span>
            </div>
            <div className="h-6 w-[1px] bg-white/20"></div>
            <div className="text-xs text-gray-200">
              <p className="font-bold text-white">48+ Ulasan</p>
              <p className="text-[10px] text-gray-300">Kepuasan 98%</p>
            </div>
          </div>
        </div>

        {/* CONTAINER RUNNING SLIDER (MARQUEE) */}
        <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]">
            {doubledTestimonials.map((item, index) => (
              <div 
                key={`${item.id}-${index}`}
                className="w-80 md:w-96 bg-white/90 backdrop-blur-md text-gray-800 p-5 rounded-2xl shadow-lg border border-white/40 flex flex-col justify-between shrink-0 hover:scale-[1.02] transition"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    {/* Bintang Review */}
                    <div className="flex text-yellow-500 gap-0.5">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <Quote size={18} className="text-indigo-400 opacity-50" />
                  </div>

                  <p className="text-xs md:text-sm text-gray-600 italic mb-4 leading-relaxed line-clamp-3">
                    "{item.comment}"
                  </p>
                </div>

                {/* Profil Penghuni */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500" 
                  />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 leading-tight">{item.name}</h4>
                    <p className="text-[11px] text-indigo-600 font-medium">{item.roomType}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}