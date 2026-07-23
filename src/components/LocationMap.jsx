import { MapPin, Navigation, Phone, ShieldCheck } from 'lucide-react';

export default function LocationMap() {
  const googleMapsUrl = "https://maps.google.com/?q=-6.2088,106.8456"; // Ganti dengan titik koordinat / link Google Maps Kost-mu

  return (
    <section className="max-w-7xl mx-auto px-4 mt-12 mb-20 relative z-10">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* INFORMASI LOKASI (Kiri) */}
          <div className="space-y-5 text-white">
            <div className="inline-flex items-center gap-2 bg-indigo-500/30 border border-indigo-400/40 px-3 py-1 rounded-full text-xs font-bold text-indigo-200">
              <MapPin size={14} /> Lokasi Strategis
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
              Akses Mudah Ke mana Saja
            </h2>

            <p className="text-sm text-gray-200 leading-relaxed">
              Jl. Mawar Indah No. 45, Kecamatan Sukajadi, Kota Bandung, Jawa Barat 40161.
            </p>

            <ul className="space-y-2 text-xs text-gray-200">
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-400 shrink-0" />
                <span>5 Menit dari Kampus Utama</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-400 shrink-0" />
                <span>3 Menit ke Halte Bus / Stasiun</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-400 shrink-0" />
                <span>Dekat Minimarket, Minimarket & Area Kuliner 24 Jam</span>
              </li>
            </ul>

            <div className="pt-2">
              <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition"
              >
                <Navigation size={16} /> Buka Petunjuk Arah
              </a>
            </div>
          </div>

          {/* GOOGLE MAPS EMBED (Kanan - 2 Kolom) */}
          <div className="lg:col-span-2 h-72 md:h-80 rounded-2xl overflow-hidden border border-white/30 shadow-inner">
            <iframe
              title="Lokasi Kost"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31597.731672210186!2d113.21167307807046!3d-8.130322396914984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd65dab51496717%3A0x31d756cd65c75b98!2sLumajang%2C%20Kec.%20Lumajang%2C%20Kabupaten%20Lumajang%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1784817007257!5m2!1sid!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>

      </div>
    </section>
  );
}
