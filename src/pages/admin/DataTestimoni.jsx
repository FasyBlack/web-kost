import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { RefreshCcw, Star, CheckCircle2, XCircle, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DataTestimoni() {
  const [testimonis, setTestimonis] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonis = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimoni')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTestimonis(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonis();
  }, []);

  // Fungsi untuk Approve/Hide ulasan
  const handleToggleTampil = async (id, statusSekarang) => {
    const statusBaru = !statusSekarang;
    
    const { error } = await supabase
      .from('testimoni')
      .update({ tampil: statusBaru })
      .eq('id', id);

    if (error) {
      toast.error('Gagal mengubah status testimoni.');
    } else {
      toast.success(statusBaru ? 'Testimoni ditampilkan di Web!' : 'Testimoni disembunyikan.');
      fetchTestimonis(); // Refresh data
    }
  };

  // Fungsi untuk hapus permanen ulasan (kalau spam)
  const handleHapus = async (id) => {
    if (!window.confirm('Yakin ingin menghapus ulasan ini secara permanen?')) return;

    const { error } = await supabase
      .from('testimoni')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Gagal menghapus testimoni.');
    } else {
      toast.success('Testimoni berhasil dihapus.');
      fetchTestimonis();
    }
  };

  // Helper untuk render bintang
  const renderBintang = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={14} 
            fill={star <= rating ? "#F59E0B" : "transparent"} 
            className={star <= rating ? "text-yellow-500" : "text-gray-300"} 
          />
        ))}
      </div>
    );
  };

  // Helper format tanggal
  const formatTanggal = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="font-extrabold text-2xl text-gray-800">Manajemen Testimoni</h3>
          <p className="text-gray-500 text-sm mt-1">Kelola ulasan dari penghuni untuk ditampilkan di Landing Page</p>
        </div>
        <button 
          onClick={fetchTestimonis} 
          className="flex justify-center items-center gap-2 text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-xl font-bold transition"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* TABEL DATA */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="py-4 pl-6 font-bold w-48">Info Pemesan</th>
              <th className="py-4 font-bold w-32">Rating</th>
              <th className="py-4 font-bold">Isi Ulasan</th>
              <th className="py-4 font-bold w-32 text-center">Status Web</th>
              <th className="py-4 pr-6 font-bold text-right w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">
                  <RefreshCcw className="animate-spin mx-auto mb-2 text-indigo-500" size={24} />
                  Memuat data testimoni...
                </td>
              </tr>
            ) : testimonis.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">
                  Belum ada ulasan yang masuk dari penghuni.
                </td>
              </tr>
            ) : (
              testimonis.map((testi) => (
                <tr key={testi.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  {/* Kolom Info */}
                  <td className="py-4 pl-6">
                    <p className="font-bold text-gray-800">{testi.nama}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{testi.no_order}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{formatTanggal(testi.created_at)}</p>
                  </td>
                  
                  {/* Kolom Rating */}
                  <td className="py-4">
                    {renderBintang(testi.rating)}
                  </td>
                  
                  {/* Kolom Ulasan */}
                  <td className="py-4 pr-4 text-gray-600 italic">
                    "{testi.ulasan}"
                  </td>
                  
                  {/* Kolom Status */}
                  <td className="py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      testi.tampil ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                      {testi.tampil ? <><CheckCircle2 size={12}/> Tampil</> : <><XCircle size={12}/> Disembunyikan</>}
                    </span>
                  </td>

                  {/* Kolom Aksi */}
                  <td className="py-4 pr-6">
                    <div className="flex justify-end gap-2">
                      {/* Tombol Toggle Tampil/Sembunyi */}
                      <button 
                        onClick={() => handleToggleTampil(testi.id, testi.tampil)}
                        title={testi.tampil ? "Sembunyikan dari Web" : "Tampilkan di Web"}
                        className={`p-2 rounded-lg transition ${
                          testi.tampil 
                          ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' 
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {testi.tampil ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>

                      {/* Tombol Hapus */}
                      <button 
                        onClick={() => handleHapus(testi.id)}
                        title="Hapus Ulasan"
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}