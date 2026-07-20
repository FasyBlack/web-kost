import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 
import { Image as ImageIcon, Upload, Trash2, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; // Import Toast

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('banner') 
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Gagal mengambil data banner');
    } else {
      setBanners(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      toast.error('Judul dan file gambar wajib diisi bro!');
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading('Mengupload banner...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('banner') 
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('banner')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('banner')
        .insert([
          { 
            title: title, 
            image: publicUrlData.publicUrl, 
            is_active: true 
          }
        ]);

      if (insertError) throw insertError;

      toast.dismiss(loadingToast);
      toast.success('Banner berhasil diupload!');
      setTitle('');
      setFile(null);
      document.getElementById('file-upload').value = ''; 
      fetchBanners();

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    const confirmDelete = window.confirm('Yakin mau hapus banner ini bro?');
    if (!confirmDelete) return;

    const loadingToast = toast.loading('Menghapus banner...');
    try {
      const fileName = imageUrl.split('/').pop();
      await supabase.storage.from('banner').remove([fileName]);

      const { error } = await supabase.from('banner').delete().eq('id', id);
      if (error) throw error;
      
      toast.dismiss(loadingToast);
      toast.success('Banner sukses dihapus!');
      fetchBanners();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal menghapus: ' + error.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Komponen wadah untuk memunculkan animasi toast */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
          <ImageIcon size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengaturan Banner</h1>
          <p className="text-gray-500 text-sm">Kelola gambar banner yang tampil di halaman depan website.</p>
        </div>
      </div>

      {/* FORM UPLOAD */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Tambah Banner Baru</h2>
        <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Banner</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cth: Promo Kost Awal Tahun" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">File Gambar</label>
            <input 
              id="file-upload"
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-4 py-1.5 focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <button 
            type="submit" 
            disabled={uploading}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 px-6 rounded-lg transition flex items-center justify-center gap-2"
          >
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
            {uploading ? 'Mengupload...' : 'Upload'}
          </button>
        </form>
      </div>

      {/* DAFTAR BANNER */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Daftar Banner Aktif</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-10 text-gray-500 gap-2">
            <Loader2 className="animate-spin" size={24} /> Memuat data...
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl">
            Belum ada banner yang diupload.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden group hover:shadow-md transition">
                <div className="h-40 w-full overflow-hidden bg-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-4 flex justify-between items-center bg-white">
                  <div>
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id, item.image)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Hapus Banner"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}