import { Image as ImageIcon, Upload, Save, Trash2 } from 'lucide-react';

export default function Banner() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pengaturan Tampilan Depan</h2>

      {/* Grid Container: Membelah layar jadi 2 kolom saat di layar besar (lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* KOLOM KIRI: Teks Banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Ubah Teks Utama (Hero Section)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Judul Utama</label>
              <input 
                type="text" 
                defaultValue="Kost Eksklusif Nyaman & Aman"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Sub-judul (Deskripsi)</label>
              <textarea 
                rows="5"
                defaultValue="Fasilitas lengkap, keamanan 24 jam, dan lingkungan tenang untuk kenyamanan istirahat Anda."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              ></textarea>
            </div>
            <div className="text-right mt-2">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 ml-auto hover:bg-indigo-700 transition">
                <Save size={18} /> Simpan Teks
              </button>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Slider Gambar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="font-bold text-lg text-gray-800">Gambar Slider Banner</h3>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Maks 3 Gambar</span>
          </div>
          
          {/* Diubah jadi 2 kolom kecil di dalamnya biar gambar gak gepeng */}
          <div className="grid grid-cols-2 gap-4">
            {/* Gambar 1 */}
            <div className="relative group">
              <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500" alt="Slider 1" className="w-full h-32 object-cover rounded-xl border-2 border-indigo-100" />
              <button className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition shadow-lg">
                <Trash2 size={16} />
              </button>
              <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">Gambar 1</span>
            </div>

            {/* Gambar 2 */}
            <div className="relative group">
              <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80" alt="Slider 2" className="w-full h-32 object-cover rounded-xl border border-gray-200" />
              <button className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition shadow-lg">
                <Trash2 size={16} />
              </button>
              <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">Gambar 2</span>
            </div>

            {/* Upload Box ditaruh di bawah memanjang (col-span-2) */}
            <div className="col-span-2 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center h-32 text-gray-400 hover:bg-gray-50 hover:text-indigo-500 transition cursor-pointer mt-2">
              <Upload size={24} className="mb-2" />
              <span className="text-sm font-bold">Upload Gambar Baru</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}