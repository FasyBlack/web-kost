import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Phone, MapPin, Map, Building, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Pengaturan() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State untuk form
  const [formData, setFormData] = useState({
    nama_kost: '',
    nomor_wa: '',
    alamat: '',
    link_maps: ''
  });

  // Ambil data pengaturan saat komponen dimuat
  useEffect(() => {
    const fetchPengaturan = async () => {
      const { data, error } = await supabase
        .from('pengaturan')
        .select('*')
        .eq('id', 1) // Kita selalu ambil data baris pertama
        .single();

      if (data) {
        setFormData(data);
      }
      setLoading(false);
    };
    fetchPengaturan();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // --- LOGIKA EKSTRAKSI OTOMATIS MULAI ---
    let finalMapLink = formData.link_maps;

    // Jika admin mem-paste seluruh kode <iframe...
    if (finalMapLink.includes('<iframe') && finalMapLink.includes('src=')) {
      // Kita suruh sistem "mencuri" link di dalam tanda kutip src="" menggunakan Regex
      const match = finalMapLink.match(/src="([^"]+)"/);
      if (match && match[1]) {
        finalMapLink = match[1]; 
      }
    }
    // --- LOGIKA EKSTRAKSI SELESAI ---

    // Gabungkan data form dengan link map yang sudah dibersihkan
    const dataToSave = {
      ...formData,
      link_maps: finalMapLink
    };

    const { error } = await supabase
      .from('pengaturan')
      .update(dataToSave)
      .eq('id', 1);

    setIsSaving(false);

    if (error) {
      toast.error('Gagal menyimpan pengaturan!');
    } else {
      setFormData(dataToSave); // Update tampilan form dengan link yang sudah bersih
      toast.success('Pengaturan berhasil diperbarui!');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat data pengaturan...</div>;
  }

  return (
    <div className=" bg-white rounded-3xl shadow-lg border border-gray-100 p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h3 className="font-extrabold text-2xl text-gray-800">Pengaturan Website</h3>
        <p className="text-gray-500 text-sm mt-1">Ubah identitas kos, nomor kontak, dan lokasi Maps di sini.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Nama Kos */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <Building size={16} className="text-indigo-500"/> Nama Kos / Cabang
          </label>
          <input 
            type="text" 
            name="nama_kost"
            value={formData.nama_kost}
            onChange={handleChange}
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        {/* Nomor WA */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <Phone size={16} className="text-indigo-500"/> Nomor WhatsApp Admin
          </label>
          <input 
            type="text" 
            name="nomor_wa"
            value={formData.nomor_wa}
            onChange={handleChange}
            placeholder="Awali dengan 62, contoh: 6281234..."
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
          <p className="text-xs text-gray-400 mt-1">Nomor ini akan digunakan untuk fitur "Tanya via WA" dan konfirmasi booking.</p>
        </div>

        {/* Alamat Lengkap */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <MapPin size={16} className="text-indigo-500"/> Alamat Lengkap
          </label>
          <textarea 
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            rows="2"
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition"
          ></textarea>
        </div>

        {/* Link Gmaps */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <Map size={16} className="text-indigo-500"/> Link Embed Google Maps
          </label>
          <textarea 
            name="link_maps"
            value={formData.link_maps}
            onChange={handleChange}
            rows="3"
            required
            placeholder="Paste link src dari iframe Google Maps di sini..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition font-mono text-xs"
          ></textarea>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18} />} 
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}