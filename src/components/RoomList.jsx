import { Star, BedDouble, Wind, Coffee, Wifi } from 'lucide-react';
import GlassCard from './GlassCard';

export default function RoomList({ whatsappLink }) {
  return (
    <section id="kamar" className="max-w-7xl mx-auto px-4 mt-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2 drop-shadow-md">Pilihan Kamar</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Tipe 1 */}
        <GlassCard className="p-0 overflow-hidden flex flex-col">
          <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80" alt="Kamar Standar" className="w-full h-48 object-cover" />
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold mb-1">Kamar Standar</h3>
            <div className="flex gap-1 text-yellow-400 mb-3"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
            <ul className="text-sm text-gray-200 mb-4 space-y-2 flex-1">
              <li className="flex items-center gap-2"><BedDouble size={16} /> Kasur Single</li>
              <li className="flex items-center gap-2"><Coffee size={16} /> Dapur Luar</li>
              <li className="flex items-center gap-2"><Wifi size={16} /> Free WiFi</li>
            </ul>
            <div className="text-2xl font-bold mb-4">Rp 800 Rb</div>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="block text-center bg-white/20 hover:bg-white/30 py-2 rounded-lg transition font-medium border border-white/50">Booking Sekarang</a>
          </div>
        </GlassCard>

        {/* Tipe 2 */}
        <GlassCard className="p-0 overflow-hidden flex flex-col border-blue-400 border-2">
          <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80" alt="Kamar Premium" className="w-full h-48 object-cover" />
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold mb-1">Kamar Premium</h3>
            <div className="flex gap-1 text-yellow-400 mb-3"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
            <ul className="text-sm text-gray-200 mb-4 space-y-2 flex-1">
              <li className="flex items-center gap-2"><BedDouble size={16} /> Springbed Double</li>
              <li className="flex items-center gap-2"><Wind size={16} /> AC, KM Dalam</li>
              <li className="flex items-center gap-2"><Wifi size={16} /> Free WiFi</li>
            </ul>
            <div className="text-2xl font-bold mb-4">Rp 1.5 Jt</div>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="block text-center bg-blue-500 hover:bg-blue-600 py-2 rounded-lg transition font-bold text-white">Booking Sekarang</a>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}