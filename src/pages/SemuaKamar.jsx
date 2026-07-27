import { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Search, Loader2, X, LayoutGrid, BedDouble, Users, CheckCircle2, MessageCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import GlassCard from '../components/GlassCard'; // Pastikan path ini benar sesuai struktur foldermu

export default function SemuaKamar() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Filter & Search
  const [filterTipe, setFilterTipe] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk Modal Detail
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('kamar')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRooms(data);
      }
      setLoading(false);
    };
    fetchRooms();
  }, []);

  // === GENERATE DROPDOWN DINAMIS DARI DATA BACKEND ===
  // Mengambil nilai unik dari array rooms untuk dijadikan opsi dropdown
  const getUniqueOptions = (field) => {
    if (!rooms.length) return ['Semua'];
    const options = rooms.map(item => item[field]).filter(Boolean); // Hapus nilai null/kosong
    return ['Semua', ...new Set(options)]; // Hapus duplikat pakai Set
  };

  const opsiTipeKamar = getUniqueOptions('tipe');
  const opsiStatusKamar = getUniqueOptions('status');

  // === LOGIKA FILTER & LIVE SEARCH ===
  const filteredRooms = rooms.filter((room) => {
    const matchTipe = filterTipe === 'Semua' || room.tipe === filterTipe;
    const matchStatus = filterStatus === 'Semua' || room.status === filterStatus;
    const matchSearch = room.nama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTipe && matchStatus && matchSearch;
  });

  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka);

  // === FUNGSI MODAL ===
  const handleOpenDetail = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const handleTanyaWA = () => {
    const nomorWaAdmin = "6283840546702";
    const pesan = `Halo Admin Kos, saya melihat dari website dan ingin bertanya lebih lanjut mengenai kamar *${selectedRoom.nama}* (Tipe: ${selectedRoom.tipe}). Apakah masih tersedia?`;
    window.open(`https://wa.me/${nomorWaAdmin}?text=${encodeURIComponent(pesan)}`, '_blank');
  };

  return (
    // Background dibuat gelap/gradient agar efek Glassmorphism dari GlassCard terlihat elegan
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 pb-20 font-sans">
      
      {/* HEADER EKSPLORASI */}
      <div className="pt-12 pb-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <a href="/" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white mb-6 font-medium transition">
            <ArrowLeft size={18} /> Kembali ke Beranda
          </a>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">Eksplorasi Semua Kamar</h1>
          <p className="text-indigo-200 text-sm md:text-base">Temukan kenyamanan yang sesuai dengan kebutuhan dan anggaranmu.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* PANEL FILTER & SEARCH (Bentuk Glassmorphism juga) */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-5 mb-10 border border-white/20 flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Filter className="text-indigo-300" size={24} />
            <span className="font-bold text-white hidden sm:block">Filter:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1 justify-end">
            {/* LIVE SEARCH */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari nama kamar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/20 transition"
              />
            </div>

            {/* DROPDOWN TIPE (DINAMIS) */}
            <select 
              className="bg-white border border-gray-300 text-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto cursor-pointer"
              value={filterTipe}
              onChange={(e) => setFilterTipe(e.target.value)}
            >
              {opsiTipeKamar.map((tipe, idx) => (
                <option key={idx} value={tipe}>
                  {tipe === 'Semua' ? 'Semua Tipe Kamar' : `Tipe ${tipe}`}
                </option>
              ))}
            </select>

            {/* DROPDOWN STATUS (DINAMIS) */}
            <select 
              className="bg-white border border-gray-300 text-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {opsiStatusKamar.map((status, idx) => (
                <option key={idx} value={status}>
                  {status === 'Semua' ? 'Semua Ketersediaan' : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* GRID HASIL PENCARIAN (MENGGUNAKAN GLASS CARD) */}
        {loading ? (
          <div className="flex justify-center py-20 text-indigo-300 gap-3">
            <Loader2 className="animate-spin" size={28} /> Memuat data kamar...
          </div>
        ) : filteredRooms.length === 0 ? (
          <GlassCard className="p-12 text-center text-gray-200 flex flex-col items-center justify-center">
            <Search className="text-gray-400 mb-4 opacity-50" size={64} />
            <h3 className="text-xl font-bold text-white">Kamar Tidak Ditemukan</h3>
            <p className="text-sm mt-2 opacity-75">Coba ubah kata kunci atau kombinasi filter Anda.</p>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRooms.map((room) => (
              <GlassCard 
                key={room.id} 
                className={`p-0 overflow-hidden flex flex-col justify-between relative transition duration-300 hover:scale-[1.02] ${
                  room.tipe === 'Premium' ? 'border-blue-400 border-2' : ''
                }`}
              >
                <div>
                  <div className="relative">
                    <img src={room.image} alt={room.nama} className="w-full h-48 object-cover" />
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow ${
                      room.status === 'Tersedia' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {room.status}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white">{room.nama}</h3>
                      <span className="text-xs bg-white/20 text-white px-2 py-1 rounded border border-white/30">
                        {room.tipe}
                      </span>
                    </div>

                    <div className="flex gap-3 text-xs text-gray-200 mb-4 pb-3 border-b border-white/10">
                      <span className="flex items-center gap-1"><LayoutGrid size={14} /> {room.ukuran || '-'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><BedDouble size={14} /> {room.kasur || '-'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {room.kapasitas || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="text-2xl font-bold text-white mb-4">
                    Rp {formatRupiah(room.harga)}
                    <span className="text-xs font-normal text-gray-300"> / {room.periode_sewa || 'Bulan'}</span>
                  </div>

                  <button 
                    onClick={() => handleOpenDetail(room)}
                    className="w-full block text-center py-2.5 rounded-lg transition font-bold text-sm bg-white/20 hover:bg-white/30 text-white shadow-lg border border-white/30"
                  >
                    Lihat Detail
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL POP-UP DETAIL KAMAR (Gaya Traveloka/Agoda) */}
      {/* ========================================================= */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
            
            {/* Tombol Close Mengambang */}
            <button 
              onClick={handleCloseDetail} 
              className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-800 hover:bg-red-50 hover:text-red-600 transition shadow-md"
            >
              <X size={20} />
            </button>

            {/* Sisi Kiri: Simulasi Galeri Foto */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100">
              <img src={selectedRoom.image} alt={selectedRoom.nama} className="w-full h-full object-cover" />
              
              {/* Simulasi Thumbnail Foto Lain (Bisa dihubungkan ke kolom database lain nanti) */}
              <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 px-4">
                <img src={selectedRoom.image} className="w-14 h-14 rounded-lg border-2 border-white object-cover shadow-md" />
                {/* Dummy Foto Kamar Mandi / Sudut Lain */}
                <div className="w-14 h-14 rounded-lg border-2 border-white bg-black/50 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-black/40 transition">
                   <span className="text-white text-[10px] font-bold text-center leading-tight">+3<br/>Foto</span>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Informasi Detail */}
            <div className="w-full md:w-1/2 bg-white flex flex-col h-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 md:p-8 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    selectedRoom.status === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedRoom.status}
                  </span>
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                    {selectedRoom.tipe}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">{selectedRoom.nama}</h2>

                {/* Grid Spesifikasi Utama */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                    <LayoutGrid size={20} className="text-indigo-500 mb-1" />
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Ukuran</span>
                    <span className="text-sm font-semibold text-gray-800">{selectedRoom.ukuran || '-'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                    <BedDouble size={20} className="text-indigo-500 mb-1" />
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Kasur</span>
                    <span className="text-sm font-semibold text-gray-800 text-center leading-tight">{selectedRoom.kasur || '-'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                    <Users size={20} className="text-indigo-500 mb-1" />
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Kapasitas</span>
                    <span className="text-sm font-semibold text-gray-800">{selectedRoom.kapasitas || '-'}</span>
                  </div>
                </div>

                {/* Fasilitas Lengkap */}
                <h4 className="font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Fasilitas Kamar</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {selectedRoom.fasilitas && selectedRoom.fasilitas.split(',').map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                      <span>{feat.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Area Footer (Harga & Tombol Pesan) - Selalu di bawah */}
              <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Harga Sewa</p>
                  <p className="text-2xl font-extrabold text-indigo-700">
                    Rp {formatRupiah(selectedRoom.harga)}
                    <span className="text-sm font-normal text-gray-500"> / {selectedRoom.periode_sewa || 'Bulan'}</span>
                  </p>
                </div>

                <button 
                  onClick={handleTanyaWA}
                  disabled={selectedRoom.status !== 'Tersedia'}
                  className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold transition w-full sm:w-auto shadow-lg ${
                    selectedRoom.status === 'Tersedia' 
                    ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedRoom.status === 'Tersedia' ? (
                    <><MessageCircle size={20} /> Tanya via WA</>
                  ) : (
                    'Kamar Penuh'
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}