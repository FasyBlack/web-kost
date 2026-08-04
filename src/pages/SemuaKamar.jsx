import { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Search, Loader2, X, LayoutGrid, BedDouble, Users, CheckCircle2, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import GlassCard from '../components/GlassCard';
import toast from 'react-hot-toast';

export default function SemuaKamar() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Filter & Search
  const [filterTipe, setFilterTipe] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  // State Modal, View & Booking
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState('detail'); // 'detail' atau 'form'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nama: '', wa: '', tanggal: '', durasi: '1 Bulan' });

  // State untuk Galeri & Lightbox
  const [activeImage, setActiveImage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [noWaAdmin, setNoWaAdmin] = useState('085732942241');

  useEffect(() => {
    const fetchNomorWa = async () => {
      const { data, error } = await supabase.from('pengaturan').select('nomor_wa').eq('id', 1).single();
      if (!error && data) setNoWaAdmin(data.nomor_wa);
    };
    fetchNomorWa();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('kamar').select('*').order('created_at', { ascending: false });
      if (!error && data) setRooms(data);
      
      {
        const searchParams = new URLSearchParams(window.location.search);
        const roomId = searchParams.get('id');
        
        if (roomId) {
          // Cari data kamar yang ID-nya cocok dengan di URL
          const targetRoom = data.find(r => r.id == roomId); 
          
          if (targetRoom) {
            // Langsung eksekusi buka modal
            setSelectedRoom(targetRoom);
            setActiveImage(targetRoom.image);
            setModalView('detail');
            setIsModalOpen(true);
            setFormData({ nama: '', wa: '', tanggal: '', durasi: '1 Bulan' });
          }
        }
      }
      setLoading(false);
    };
    fetchRooms();
  }, []);

  const getUniqueOptions = (field) => {
    if (!rooms.length) return ['Semua'];
    const options = rooms.map(item => item[field]).filter(Boolean);
    return ['Semua', ...new Set(options)];
  };
  const opsiTipeKamar = getUniqueOptions('tipe');
  const opsiStatusKamar = getUniqueOptions('status');

  const filteredRooms = rooms.filter((room) => {
    const matchTipe = filterTipe === 'Semua' || room.tipe === filterTipe;
    const matchStatus = filterStatus === 'Semua' || room.status === filterStatus;
    const matchSearch = room.nama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTipe && matchStatus && matchSearch;
  });

  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka);

  // Fungsi Modal
  const handleOpenDetail = (room) => {
    setSelectedRoom(room);
    setActiveImage(room.image);
    setModalView('detail');
    setIsModalOpen(true);
    setFormData({ nama: '', wa: '', tanggal: '', durasi: '1 Bulan' });
  };

  const handleCloseDetail = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  // Fungsi Lightbox
  const getAllImages = () => {
    if (!selectedRoom) return [];
    const images = [selectedRoom.image];
    if (selectedRoom.galeri_foto) {
      const gallery = selectedRoom.galeri_foto.split(',').map(url => url.trim()).filter(Boolean);
      images.push(...gallery);
    }
    return images;
  };
  const allImages = getAllImages();
  const handlePrevImage = () => setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  const handleNextImage = () => setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));

  // Fungsi Submit Booking (Menyamai Landing Page)
  const generateNoOrder = () => `MKS-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const noOrder = generateNoOrder();
    let nomorBersih = noWaAdmin.replace(/\D/g, '');
    if (nomorBersih.startsWith('0')) nomorBersih = '62' + nomorBersih.substring(1);

    const { error } = await supabase.from('booking').insert([{
      no_order: noOrder,
      nama_pemesan: formData.nama,
      no_wa: formData.wa,
      kamar_id: selectedRoom.id,
      nama_kamar: selectedRoom.nama,
      tanggal_masuk: formData.tanggal,
      durasi: formData.durasi,
      total_harga: selectedRoom.harga,
      status: 'Menunggu'
    }]);

    setIsSubmitting(false);

    if (error) {
      toast.error('Gagal membuat pesanan, silakan coba lagi.');
    } else {
      toast.success('Pesanan berhasil dibuat!');
      handleCloseDetail();
      const pesanWA = `Halo Admin Kos, saya ingin booking kamar dari website.\n\n*KODE BOOKING: ${noOrder}*\n\n📝 *Data Pesanan:*\n- Nama: ${formData.nama}\n- Kamar: ${selectedRoom.nama}\n- Rencana Masuk: ${formData.tanggal}\n- Durasi: ${formData.durasi}\n\nMohon konfirmasi ketersediaan kamarnya ya. Terima kasih!`;
      window.open(`https://wa.me/${nomorBersih}?text=${encodeURIComponent(pesanWA)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 pb-20 font-sans">
      <div className="pt-12 pb-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <a href="/" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white mb-6 font-medium transition"><ArrowLeft size={18} /> Kembali ke Beranda</a>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">Eksplorasi Semua Kamar</h1>
          <p className="text-indigo-200 text-sm md:text-base">Temukan kenyamanan yang sesuai dengan kebutuhan dan anggaranmu.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-5 mb-10 border border-white/20 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Filter className="text-indigo-300" size={24} />
            <span className="font-bold text-white hidden sm:block">Filter:</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1 justify-end">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Cari nama kamar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/20 transition" />
            </div>
            <select className="bg-white border border-gray-300 text-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto cursor-pointer" value={filterTipe} onChange={(e) => setFilterTipe(e.target.value)}>
              {opsiTipeKamar.map((tipe, idx) => (<option key={idx} value={tipe}>{tipe === 'Semua' ? 'Semua Tipe Kamar' : `Tipe ${tipe}`}</option>))}
            </select>
            <select className="bg-white border border-gray-300 text-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto cursor-pointer" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              {opsiStatusKamar.map((status, idx) => (<option key={idx} value={status}>{status === 'Semua' ? 'Semua Ketersediaan' : status}</option>))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-indigo-300 gap-3"><Loader2 className="animate-spin" size={28} /> Memuat data kamar...</div>
        ) : filteredRooms.length === 0 ? (
          <GlassCard className="p-12 text-center text-gray-200 flex flex-col items-center justify-center">
            <Search className="text-gray-400 mb-4 opacity-50" size={64} /><h3 className="text-xl font-bold text-white">Kamar Tidak Ditemukan</h3><p className="text-sm mt-2 opacity-75">Coba ubah kata kunci atau kombinasi filter Anda.</p>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRooms.map((room) => (
              <GlassCard key={room.id} className={`p-0 overflow-hidden flex flex-col justify-between relative transition duration-300 hover:scale-[1.02] ${room.tipe === 'Premium' ? 'border-blue-400 border-2' : ''}`}>
                <div>
                  <div className="relative">
                    <img src={room.image} loading="lazy" alt={room.nama} className="w-full h-48 object-cover" />
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow ${room.status === 'Tersedia' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{room.status}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2"><h3 className="text-xl font-bold text-white">{room.nama}</h3><span className="text-xs bg-white/20 text-white px-2 py-1 rounded border border-white/30">{room.tipe}</span></div>
                    <div className="flex gap-3 text-xs text-gray-200 mb-4 pb-3 border-b border-white/10"><span className="flex items-center gap-1"><LayoutGrid size={14} /> {room.ukuran || '-'}</span><span>•</span><span className="flex items-center gap-1"><BedDouble size={14} /> {room.kasur || '-'}</span><span>•</span><span className="flex items-center gap-1"><Users size={14} /> {room.kapasitas || '-'}</span></div>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <div className="text-2xl font-bold text-white mb-4">Rp {formatRupiah(room.harga)}<span className="text-xs font-normal text-gray-300"> / {room.periode_sewa || 'Bulan'}</span></div>
                  <button onClick={() => handleOpenDetail(room)} className="w-full block text-center py-2.5 rounded-lg transition font-bold text-sm bg-white/20 hover:bg-white/30 text-white shadow-lg border border-white/30">Lihat Detail</button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODAL DETAIL & BOOKING ================= */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
            <button onClick={handleCloseDetail} className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-800 hover:bg-red-50 hover:text-red-600 transition shadow-md"><X size={20} /></button>

            {/* Sisi Kiri: Galeri Foto (Tetap diam) */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100 flex flex-col">
              <div className="flex-1 w-full h-full relative group cursor-pointer" onClick={() => { setCurrentIndex(allImages.indexOf(activeImage) !== -1 ? allImages.indexOf(activeImage) : 0); setIsFullscreen(true); }}>
                <img src={activeImage} alt={selectedRoom.nama} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white font-bold bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">Lihat Fullscreen</span></div>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent flex justify-center gap-3 overflow-x-auto no-scrollbar">
                <img src={selectedRoom.image} onClick={() => setActiveImage(selectedRoom.image)} className={`w-14 h-14 rounded-lg object-cover shadow-lg cursor-pointer transition-all duration-200 ${activeImage === selectedRoom.image ? 'border-2 border-indigo-400 scale-110' : 'border border-white/50 opacity-70 hover:opacity-100'}`} />
                {selectedRoom.galeri_foto && selectedRoom.galeri_foto.split(',').map((url, idx) => {
                  const cleanUrl = url.trim();
                  if (!cleanUrl) return null;
                  return <img key={idx} src={cleanUrl} onClick={() => setActiveImage(cleanUrl)} className={`w-14 h-14 rounded-lg object-cover shadow-lg cursor-pointer transition-all duration-200 ${activeImage === cleanUrl ? 'border-2 border-indigo-400 scale-110' : 'border border-white/50 opacity-70 hover:opacity-100'}`} />
                })}
              </div>
            </div>

            {/* Sisi Kanan: BISA SWITCH ANTARA DETAIL DAN FORM */}
            <div className="w-full md:w-1/2 bg-white flex flex-col h-full max-h-[90vh] overflow-y-auto">

              {modalView === 'detail' ? (
                // --- TAMPILAN 1: DETAIL KAMAR ---
                <>
                  <div className="p-6 md:p-8 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${selectedRoom.status === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selectedRoom.status}</span>
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">{selectedRoom.tipe}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">{selectedRoom.nama}</h2>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center"><LayoutGrid size={20} className="text-indigo-500 mb-1" /><span className="text-[10px] text-gray-500 font-bold uppercase">Ukuran</span><span className="text-sm font-semibold text-gray-800">{selectedRoom.ukuran || '-'}</span></div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center"><BedDouble size={20} className="text-indigo-500 mb-1" /><span className="text-[10px] text-gray-500 font-bold uppercase">Kasur</span><span className="text-sm font-semibold text-gray-800 text-center leading-tight">{selectedRoom.kasur || '-'}</span></div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center"><Users size={20} className="text-indigo-500 mb-1" /><span className="text-[10px] text-gray-500 font-bold uppercase">Kapasitas</span><span className="text-sm font-semibold text-gray-800">{selectedRoom.kapasitas || '-'}</span></div>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Fasilitas Kamar</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {selectedRoom.fasilitas && selectedRoom.fasilitas.split(',').map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /><span>{feat.trim()}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Harga Sewa</p>
                      <p className="text-2xl font-extrabold text-indigo-700">Rp {formatRupiah(selectedRoom.harga)}<span className="text-sm font-normal text-gray-500"> / {selectedRoom.periode_sewa || 'Bulan'}</span></p>
                    </div>
                    <button onClick={() => setModalView('form')} disabled={selectedRoom.status !== 'Tersedia'} className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold transition w-full sm:w-auto shadow-lg ${selectedRoom.status === 'Tersedia' ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                      {selectedRoom.status === 'Tersedia' ? 'Booking Sekarang' : 'Kamar Penuh'}
                    </button>
                  </div>
                </>
              ) : (
                // --- TAMPILAN 2: FORM BOOKING ---
                <div className="p-6 md:p-8 flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
                  <button onClick={() => setModalView('detail')} className="flex items-center gap-2 text-indigo-600 font-bold mb-6 hover:text-indigo-800 transition w-fit"><ArrowLeft size={16} /> Kembali ke Detail</button>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Form Booking</h2>
                  <p className="text-sm text-gray-500 mb-6">Pesan kamar <span className="font-bold text-indigo-600">{selectedRoom.nama}</span></p>

                  <form onSubmit={handleSubmitBooking} className="space-y-4 flex-1 flex flex-col">
                    <div><label className="block text-xs font-bold text-gray-600 mb-1">Nama Lengkap</label><input type="text" required value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} className="w-full border rounded-lg p-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: Budi Santoso" /></div>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1">Nomor WhatsApp Aktif</label><input type="number" required value={formData.wa} onChange={(e) => setFormData({ ...formData, wa: e.target.value })} className="w-full border rounded-lg p-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: 628123..." /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-bold text-gray-600 mb-1">Tgl Check-in</label><input type="date" required value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} className="w-full border rounded-lg p-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Durasi Sewa</label>
                        <select value={formData.durasi} onChange={(e) => setFormData({ ...formData, durasi: e.target.value })} className="w-full border rounded-lg p-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                          <option value="1 Hari">1 Hari</option><option value="1 Minggu">1 Minggu</option><option value="1 Bulan">1 Bulan</option><option value="3 Bulan">3 Bulan</option><option value="6 Bulan">6 Bulan</option><option value="1 Tahun">1 Tahun</option>
                        </select>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 mt-auto">
                      <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition shadow-md disabled:bg-indigo-400">
                        {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Memproses...</> : 'Kirim & Hubungi WA'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX GALLERY */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
          <button onClick={() => setIsFullscreen(false)} className="absolute top-6 right-6 text-white/70 hover:text-red-500 hover:bg-white/10 p-2 rounded-full transition z-50"><X size={32} /></button>
          <button onClick={handlePrevImage} className="absolute left-4 md:left-10 text-white/70 hover:text-white bg-black/50 hover:bg-indigo-600 p-3 rounded-full transition z-50 shadow-lg"><ChevronLeft size={36} /></button>
          <img src={allImages[currentIndex]} alt="Fullscreen Gallery" className="max-w-[90vw] max-h-[90vh] object-contain select-none transition-transform duration-300" />
          <button onClick={handleNextImage} className="absolute right-4 md:right-10 text-white/70 hover:text-white bg-black/50 hover:bg-indigo-600 p-3 rounded-full transition z-50 shadow-lg"><ChevronRight size={36} /></button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-bold bg-black/60 px-4 py-1.5 rounded-full text-sm tracking-widest backdrop-blur-sm">{currentIndex + 1} / {allImages.length}</div>
        </div>
      )}
    </div>
  );
}