import { useState, useEffect } from 'react';
import { Star, Quote, Loader2, MessageSquareOff } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Pastikan path ini benar sesuai struktur foldermu

export default function Testimonials() {
  // 1. SIAPKAN WADAH DATA (STATE)
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. AMBIL DATA DARI SUPABASE (EFFECT)
  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('testimoni')
        .select('*')
        .eq('tampil', true) // KUNCI UTAMA: Hanya ambil yang sudah di-approve admin!
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTestimonials(data);
      }
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  // 3. KALKULASI DATA DINAMIS (Rata-rata bintang & jumlah ulasan)
  const totalReviews = testimonials.length;
  // Rumus: Total semua bintang dibagi jumlah ulasan. Kalau kosong, jadikan 0.
  const averageRating = totalReviews > 0 
    ? (testimonials.reduce((total, item) => total + item.rating, 0) / totalReviews).toFixed(1) 
    : 0;

  // Duplikasi data agar animasi marquee (berjalan) mulus tanpa jeda
  const doubledTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="max-w-7xl mx-auto px-4 mt-20 relative z-10">
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

          {/* AKUMULASI BINTANG DINAMIS */}
          <div className="bg-white/15 border border-white/30 backdrop-blur-lg px-4 py-2 rounded-2xl flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={18} fill="currentColor" />
              <span className="text-lg font-extrabold text-white">{averageRating}</span>
            </div>
            <div className="h-6 w-[1px] bg-white/20"></div>
            <div className="text-xs text-gray-200">
              <p className="font-bold text-white">{totalReviews} Ulasan Asli</p>
              <p className="text-[10px] text-gray-300">Terverifikasi</p>
            </div>
          </div>
        </div>

        {/* AREA KONTEN (LOADING / KOSONG / MARQUEE) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-white/70">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p className="text-sm">Memuat ulasan penghuni...</p>
          </div>
        ) : totalReviews === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-white/50 text-center">
            <MessageSquareOff size={48} className="mb-4 opacity-50" />
            <p className="font-bold text-lg text-white/80">Belum ada ulasan</p>
            <p className="text-sm">Jadilah yang pertama merasakan kenyamanan kos kami!</p>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]">
              
              {/* KITA MAP DATA DARI SUPABASE DI SINI */}
              {doubledTestimonials.map((item, index) => (
                <div 
                  key={`${item.id}-${index}`}
                  className="w-80 md:w-96 bg-white/90 backdrop-blur-md text-gray-800 p-5 rounded-2xl shadow-lg border border-white/40 flex flex-col justify-between shrink-0 hover:scale-[1.02] transition"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex text-yellow-500 gap-0.5">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                      <Quote size={18} className="text-indigo-400 opacity-50" />
                    </div>

                    <p className="text-xs md:text-sm text-gray-600 italic mb-4 leading-relaxed line-clamp-3">
                      "{item.ulasan}" {/* Di database namaya 'ulasan', bukan 'comment' */}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    {/* AVATAR OTOMATIS DARI INISIAL NAMA */}
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.nama)}&background=random&color=fff&rounded=true`} 
                      alt={item.nama} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 shadow-sm" 
                    />
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 leading-tight">{item.nama}</h4>
                      <p className="text-[10px] text-indigo-500 font-medium">No. Order: {item.no_order}</p>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        )}

      </div>
    </section>
  );
}