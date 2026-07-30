import { useState, useEffect } from 'react';
import { BedDouble, LayoutGrid, Users, CheckCircle2, Loader2, X, ArrowRight, ArrowRightCircle } from 'lucide-react';
import GlassCard from './GlassCard';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayedRooms = rooms.slice(0, 6);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    wa: '',
    tanggal: '',
    durasi: '1 Bulan'
  });

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

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID').format(angka);
  };

  const handleOpenModal = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
    setFormData({ nama: '', wa: '', tanggal: '', durasi: '1 Bulan' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const generateNoOrder = () => {
    const acak = Math.floor(1000 + Math.random() * 9000);
    return `MKS-${acak}`;
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const noOrder = generateNoOrder();
    const nomorWaAdmin = "6283840546702";

    const { error } = await supabase
      .from('booking')
      .insert([
        {
          no_order: noOrder,
          nama_pemesan: formData.nama,
          no_wa: formData.wa,
          kamar_id: selectedRoom.id,
          nama_kamar: selectedRoom.nama,
          tanggal_masuk: formData.tanggal,
          durasi: formData.durasi,
          total_harga: selectedRoom.harga,
          status: 'Menunggu'
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      toast.error('Gagal membuat pesanan, silakan coba lagi.');
      console.error(error);
    } else {
      toast.success('Pesanan berhasil dibuat!');
      handleCloseModal();

      const pesanWA = `Halo Admin Kos, saya ingin booking kamar dari website.\n\n*KODE BOOKING: ${noOrder}*\n\n📝 *Data Pesanan:*\n- Nama: ${formData.nama}\n- Kamar: ${selectedRoom.nama}\n- Rencana Masuk: ${formData.tanggal}\n- Durasi: ${formData.durasi}\n\nMohon konfirmasi ketersediaan kamarnya ya. Terima kasih!`;

      window.open(`https://wa.me/${nomorWaAdmin}?text=${encodeURIComponent(pesanWA)}`, '_blank');
    }
  };

  return (
    <section id="kamar" className="max-w-7xl mx-auto px-4 mt-24 relative z-50">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2 drop-shadow-md text-white">Pilihan Kamar</h2>
        <p className="text-gray-200 text-sm">Temukan tipe kamar yang sesuai dengan kenyamanan Anda</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12 text-white gap-2">
          <Loader2 className="animate-spin" size={20} /> Memuat daftar kamar...
        </div>
      ) : rooms.length === 0 ? (
        <GlassCard className="p-8 text-center text-gray-200">
          Belum ada data kamar yang tersedia saat ini.
        </GlassCard>
      ) : (
        <>
          {/* WADAH UTAMA: SLIDER DI MOBILE, GRID DI DESKTOP */}
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-6 md:pb-0 [&::-webkit-scrollbar]:hidden">
            
            {displayedRooms.map((room) => (
              <GlassCard
                key={room.id}
                className={`min-w-[85vw] sm:min-w-[300px] md:min-w-0 snap-center p-0 overflow-hidden flex flex-col justify-between relative transition duration-300 hover:scale-[1.02] ${
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

                  <div className="p-6">
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

                    <ul className="text-sm text-gray-200 mb-6 space-y-2">
                      {room.fasilitas && room.fasilitas.split(',').slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 size={14} className="text-green-400 shrink-0" />
                          <span className="truncate">{feat.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="text-2xl font-bold text-white mb-4">
                    Rp {formatRupiah(room.harga)}
                    <span className="text-xs font-normal text-gray-300"> / {room.periode_sewa || 'Bulan'}</span>
                  </div>

                  <button
                    onClick={() => handleOpenModal(room)}
                    disabled={room.status !== 'Tersedia'}
                    className={`w-full block text-center py-2.5 rounded-lg transition font-bold text-sm ${
                      room.status === 'Tersedia'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg border border-blue-400'
                        : 'bg-gray-500/50 text-gray-300 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    {room.status === 'Tersedia' ? 'Booking Sekarang' : 'Kamar Penuh'}
                  </button>
                </div>
              </GlassCard>
            ))}

            {/* KARTU KHUSUS MOBILE: TOMBOL LIHAT SEMUA */}
            <div className="min-w-[85vw] sm:min-w-[300px] md:hidden snap-center flex items-center justify-center py-4 pr-4">
              <a
                href="/kamar"
                className="bg-white/10 backdrop-blur-md border border-indigo-400/50 rounded-2xl w-full h-[90%] flex flex-col items-center justify-center text-white hover:bg-white/20 transition shadow-lg"
              >
                <ArrowRightCircle size={48} className="mb-4 text-indigo-300 animate-pulse" />
                <span className="font-bold text-lg">Lihat Semua Kamar</span>
                <span className="text-xs text-gray-300 mt-2">{rooms.length} Kamar Tersedia</span>
              </a>
            </div>

          </div>

          {/* TOMBOL KHUSUS DESKTOP: LIHAT SELENGKAPNYA */}
          <div className="hidden md:flex justify-center mt-10">
            <a
              href="/kamar"
              className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-full font-bold transition shadow-lg shadow-indigo-500/30 hover:scale-105"
            >
              Lihat Selengkapnya <ArrowRight size={20} />
            </a>
          </div>
        </>
      )}

      {/* MODAL POP-UP FORM BOOKING */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Form Booking Kamar</h3>
                <p className="text-xs text-indigo-600 font-medium">{selectedRoom.nama}</p>
              </div>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500 transition p-1 bg-white rounded-full border border-gray-200">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nomor WhatsApp Aktif</label>
                <input
                  type="number"
                  required
                  value={formData.wa}
                  onChange={(e) => setFormData({ ...formData, wa: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Contoh: 628123..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Tgl Check-in</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Durasi Sewa</label>
                  <select
                    value={formData.durasi}
                    onChange={(e) => setFormData({ ...formData, durasi: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="1 Hari">1 Hari</option>
                    <option value="1 Minggu">1 Minggu</option>
                    <option value="1 Bulan">1 Bulan</option>
                    <option value="3 Bulan">3 Bulan</option>
                    <option value="6 Bulan">6 Bulan</option>
                    <option value="1 Tahun">1 Tahun</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-md disabled:bg-indigo-400"
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Memproses...</>
                  ) : (
                    'Kirim & Hubungi WA'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}