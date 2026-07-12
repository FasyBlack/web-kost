import { MapPin, Wifi, ShieldCheck, Wind } from 'lucide-react';
import GlassCard from './GlassCard';

export default function Facilities() {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2 drop-shadow-md">Fasilitas Kost</h2>
        <p className="text-gray-200">Kenyamanan Anda adalah prioritas kami</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="flex flex-col items-center justify-center p-6 text-center hover:-translate-y-1 transition duration-300">
          <Wifi size={40} className="mb-3 text-blue-300" />
          <h3 className="font-bold">WiFi Ngebut</h3>
        </GlassCard>
        <GlassCard className="flex flex-col items-center justify-center p-6 text-center hover:-translate-y-1 transition duration-300">
          <Wind size={40} className="mb-3 text-blue-300" />
          <h3 className="font-bold">Full AC</h3>
        </GlassCard>
        <GlassCard className="flex flex-col items-center justify-center p-6 text-center hover:-translate-y-1 transition duration-300">
          <ShieldCheck size={40} className="mb-3 text-blue-300" />
          <h3 className="font-bold">Aman 24 Jam</h3>
        </GlassCard>
        <GlassCard className="flex flex-col items-center justify-center p-6 text-center hover:-translate-y-1 transition duration-300">
          <MapPin size={40} className="mb-3 text-blue-300" />
          <h3 className="font-bold">Lokasi Strategis</h3>
        </GlassCard>
      </div>
    </section>
  );
}