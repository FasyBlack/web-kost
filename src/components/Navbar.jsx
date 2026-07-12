import { MessageCircle } from 'lucide-react';
import GlassCard from './GlassCard';

export default function Navbar({ whatsappLink }) {
  return (
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
  );
}