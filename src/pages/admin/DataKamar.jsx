import { useState, useEffect } from 'react';
import { Search, Plus, Edit, BedDouble, Users, CheckCircle2, LayoutGrid, X, Loader2, Trash2, AlertTriangle, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { supabase } from '../../supabaseClient'; 
import toast, { Toaster } from 'react-hot-toast';

export default function DataKamar() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState(null); 
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, imageUrl: null });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('Semua Tipe');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const [formData, setFormData] = useState({
    nama: '', tipe: 'Premium', harga: '', 
    periode_sewa: 'Bulan', // STATE BARU UNTUK PERIODE
    kapasitas: '', kasur: '', ukuran: '', deskripsi: '', fasilitas: '',
  });
  const [file, setFile] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('kamar').select('*').order('created_at', { ascending: false });

    if (error) {
      toast.error('Gagal mengambil data kamar!');
    } else {
      setRooms(data);
      if (data.length > 0 && !selectedRoom) setSelectedRoom(data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType]);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          room.tipe.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'Semua Tipe' || room.tipe === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentRooms = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);

  const handleEditClick = () => {
    setEditId(selectedRoom.id);
    setFormData({
      nama: selectedRoom.nama, 
      tipe: selectedRoom.tipe, 
      harga: selectedRoom.harga.toString(),
      periode_sewa: selectedRoom.periode_sewa || 'Bulan', // Tarik data periode sewa lama
      kapasitas: selectedRoom.kapasitas, 
      kasur: selectedRoom.kasur, 
      ukuran: selectedRoom.ukuran,
      deskripsi: selectedRoom.deskripsi, 
      fasilitas: selectedRoom.fasilitas,
    });
    setFile(null);
    setIsModalOpen(true);
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!editId && !file) { toast.error('Foto kamar wajib diupload untuk kamar baru!'); return; }

    setUploading(true);
    const loadingToast = toast.loading(editId ? 'Menyimpan perubahan...' : 'Menyimpan data kamar...');

    try {
      let finalImageUrl = selectedRoom?.image; 
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('kamar').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('kamar').getPublicUrl(fileName);
        finalImageUrl = publicUrlData.publicUrl; 
      }

      const payload = {
        nama: formData.nama, 
        tipe: formData.tipe, 
        harga: Number(formData.harga),
        periode_sewa: formData.periode_sewa, // Masukkan periode sewa ke payload
        kapasitas: formData.kapasitas, 
        kasur: formData.kasur, 
        ukuran: formData.ukuran,
        deskripsi: formData.deskripsi, 
        fasilitas: formData.fasilitas, 
        image: finalImageUrl,
      };

      if (editId) {
        const { error: updateError } = await supabase.from('kamar').update(payload).eq('id', editId);
        if (updateError) throw updateError;
        setSelectedRoom({ ...selectedRoom, ...payload });
      } else {
        const { error: insertError } = await supabase.from('kamar').insert([{ ...payload, status: 'Tersedia' }]);
        if (insertError) throw insertError;
      }

      toast.dismiss(loadingToast);
      toast.success(editId ? 'Perubahan berhasil disimpan!' : 'Kamar berhasil ditambahkan!');
      
      closeModal();
      fetchRooms();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal menyimpan: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ nama: '', tipe: 'Premium', harga: '', periode_sewa: 'Bulan', kapasitas: '', kasur: '', ukuran: '', deskripsi: '', fasilitas: '' });
    setFile(null);
  };

  const executeDelete = async () => {
    const { id, imageUrl } = deleteConfirm;
    setDeleteConfirm({ isOpen: false, id: null, imageUrl: null });
    const loadingToast = toast.loading('Menghapus data...');
    try {
      const fileName = imageUrl.split('/').pop();
      await supabase.storage.from('kamar').remove([fileName]);
      const { error } = await supabase.from('kamar').delete().eq('id', id);
      if (error) throw error;

      toast.dismiss(loadingToast);
      toast.success('Kamar sukses dihapus!');
      setSelectedRoom(null); 
      fetchRooms();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal menghapus: ' + error.message);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Tersedia' ? 'Penuh' : 'Tersedia';
    const { error } = await supabase.from('kamar').update({ status: newStatus }).eq('id', id);
    if (error) { toast.error('Gagal merubah status!'); } 
    else {
      toast.success(`Status diubah menjadi ${newStatus}`);
      fetchRooms();
      setSelectedRoom({ ...selectedRoom, status: newStatus }); 
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka);

  return (
    // Tambahkan h-full dan overflow-hidden di bungkus paling luar agar halaman utama terkunci
   <div className="min-h-screen flex flex-col relative pb-10">
      <Toaster position="top-right" />

      {/* POPUP HAPUS */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-7 w-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Data Kamar?</h3>
            <p className="text-sm text-gray-500 mb-6">Data dihapus permanen. Lanjutkan?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm({ isOpen: false, id: null, imageUrl: null })} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200">Batal</button>
              <button onClick={executeDelete} className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700">Ya, Hapus!</button>
            </div>
          </div>
        </div>
      )}
      
      {/* MODAL FORM TAMBAH/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">{editId ? 'Edit Data Kamar' : 'Tambah Kamar Baru'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <form onSubmit={handleSumbit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Kamar</label><input type="text" required value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Kamar</label>
                  <select value={formData.tipe} onChange={(e) => setFormData({...formData, tipe: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="Premium">Premium</option><option value="Standar">Standar</option><option value="Eksklusif">Eksklusif</option>
                  </select>
                </div>

                {/* GABUNGAN HARGA & PERIODE SEWA */}
                <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Angka saja)</label>
                    <input type="number" required value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Periode Sewa</label>
                    <select value={formData.periode_sewa} onChange={(e) => setFormData({...formData, periode_sewa: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="Bulan">Per Bulan</option>
                      <option value="Hari">Per Hari</option>
                      <option value="Jam">Per Jam</option>
                    </select>
                  </div>
                </div>

                <div><label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label><input type="text" value={formData.kapasitas} onChange={(e) => setFormData({...formData, kapasitas: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tipe Kasur</label><input type="text" value={formData.kasur} onChange={(e) => setFormData({...formData, kasur: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Ukuran Kamar</label><input type="text" value={formData.ukuran} onChange={(e) => setFormData({...formData, ukuran: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Fasilitas (Pisahkan dengan koma)</label><input type="text" value={formData.fasilitas} onChange={(e) => setFormData({...formData, fasilitas: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label><textarea rows="3" value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Kamar Utama {editId && <span className="text-red-500 text-xs ml-2">(Kosongkan jika tidak ingin mengubah foto)</span>}</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full border rounded-lg px-3 py-1.5 focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button type="button" onClick={closeModal} className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">Batal</button>
                <button type="submit" disabled={uploading} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-indigo-700 disabled:bg-indigo-400">
                  {uploading ? <Loader2 className="animate-spin" size={18} /> : null} {uploading ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Simpan Kamar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER PENCARIAN (FIXED DI ATAS) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 shrink-0">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input type="text" placeholder="Cari nama atau tipe kamar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600 outline-none">
            <option value="Semua Tipe">Semua Tipe</option><option value="Premium">Premium</option><option value="Standar">Standar</option><option value="Eksklusif">Eksklusif</option>
          </select>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold shadow-md hover:bg-indigo-700 transition w-full md:w-auto justify-center">
            <Plus size={18} /> Tambah Kamar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start flex-1 overflow-hidden">
        
        {/* BAGIAN KIRI: DAFTAR KAMAR (INDEPENDENT SCROLL) */}
        {/* max-h-full dan overflow-y-auto bikin bagian kiri ini aja yang bisa discroll */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-20 text-gray-500"><Loader2 className="animate-spin mr-2" /> Memuat data...</div>
          ) : currentRooms.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border text-gray-400">{searchQuery ? 'Kamar yang dicari tidak ditemukan.' : 'Belum ada data kamar.'}</div>
          ) : (
            currentRooms.map((room) => (
              <div 
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`relative flex flex-col sm:flex-row bg-white rounded-2xl border p-3 gap-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:z-10
  ${selectedRoom?.id === room.id ? 'border-indigo-500 ring-2 ring-indigo-500 z-30 shadow-md' : 'border-gray-100 z-0'}`}
              >
                <img src={room.image} alt={room.nama} className="w-full sm:w-48 h-32 object-cover rounded-xl" />
                <div className="flex-1 py-2 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-gray-800">{room.nama}</h3>
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${room.status === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1"><LayoutGrid size={14} /> {room.ukuran}</span>
                      <span className="flex items-center gap-1"><BedDouble size={14} /> {room.kasur}</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {room.kapasitas}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-800">Rp {formatRupiah(room.harga)}</span>
                    {/* Nampilin Periode Sewa Dinamis */}
                    <span className="text-xs text-gray-400"> / {room.periode_sewa || 'Bulan'}</span>
                  </div>
                </div>
              </div>
            ))
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-4">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft size={16} /> Sebelumnya</button>
              <span className="text-sm text-gray-500 font-medium">Halaman <span className="font-bold text-gray-800">{currentPage}</span> dari {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">Selanjutnya <ChevronRight size={16} /></button>
            </div>
          )}
        </div>

        {/* PANEL KANAN DETAIL (FIXED) */}
        {/* Hapus efek sticky dan ubah jadi tinggi menyesuaikan agar tidak ikut scroll */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6 h-[calc(100vh-3rem)] flex flex-col overflow-y-auto custom-scrollbar">
          {selectedRoom ? (
            <>
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="font-bold text-gray-800 text-lg">Detail Kamar</h3>
                <div className="flex gap-2">
                  <button onClick={handleEditClick} className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition"><Edit size={14} /> Edit</button>
                  <button onClick={() => setDeleteConfirm({ isOpen: true, id: selectedRoom.id, imageUrl: selectedRoom.image })} className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-100 transition"><Trash2 size={14} /></button>
                </div>
              </div>
              
              <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{selectedRoom.nama}</h2>
                <div className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold mb-4">Tipe: {selectedRoom.tipe}</div>
                <img src={selectedRoom.image} alt={selectedRoom.nama} className="w-full h-48 object-cover rounded-xl mb-4 shrink-0" />
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">{selectedRoom.deskripsi}</p>
                <h4 className="font-bold text-sm text-gray-800 mb-3 border-b pb-2">Fasilitas Termasuk</h4>
                <ul className="space-y-2 mb-6">
                  {selectedRoom.fasilitas && selectedRoom.fasilitas.split(',').map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-green-500 min-w-4" /> {feat.trim()}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl flex justify-between items-center shrink-0 mt-2">
                <div>
                  <p className="text-xs text-indigo-400 font-bold uppercase flex items-center gap-1">
                    <Clock size={12} /> Harga / {selectedRoom.periode_sewa || 'Bulan'}
                  </p>
                  <p className="text-xl font-bold text-indigo-700">Rp {formatRupiah(selectedRoom.harga)}</p>
                </div>
                <button onClick={() => toggleStatus(selectedRoom.id, selectedRoom.status)} className={`${selectedRoom.status === 'Tersedia' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50'} px-4 py-2 rounded-lg text-sm font-bold shadow transition`}>
                  {selectedRoom.status === 'Tersedia' ? 'Set Jadi Penuh' : 'Set Tersedia'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-gray-400 m-auto">Pilih kamar untuk melihat detail.</div>
          )}
        </div>
      </div>
    </div>
  );
}