import GlassCard from './GlassCard';

export default function Hero({ whatsappLink }) {
  return (
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
  );
}