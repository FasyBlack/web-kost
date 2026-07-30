import { useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle2, Clock, XCircle, MapPin, Calendar, CreditCard, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Sesuaikan path jika perlu


export default function CekPesanan() {
  const [noWaAdmin, setNoWaAdmin] = useState('6281234567890');
  const [formData, setFormData] = useState({ kodeBooking: '', noWa: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCekPesanan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    // Tarik data dari Supabase berdasarkan Kode Booking & No WA
    const { data, error } = await supabase
      .from('booking')
      .select('*')
      .eq('no_order', formData.kodeBooking.trim().toUpperCase())
      .eq('no_wa', formData.noWa.trim())
      .single(); // Gunakan single() karena kita cuma nyari 1 data spesifik

    setLoading(false);

    if (error || !data) {
      setErrorMsg('Pesanan tidak ditemukan. Pastikan Kode Booking dan Nomor WhatsApp sudah benar.');
    } else {
      setResult(data);
    }
  };

  // Helper Warna Status
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Menunggu':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: <Clock size={24} className="text-yellow-500" /> };
      case 'Dikonfirmasi':
        return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: <CheckCircle2 size={24} className="text-green-500" /> };
      case 'Selesai':
        return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: <CheckCircle2 size={24} className="text-blue-500" /> };
      case 'Dibatalkan':
        return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: <XCircle size={24} className="text-red-500" /> };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: <Clock size={24} /> };
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka);

  useEffect(() => {
    const fetchNomorWa = async () => {
      const { data, error } = await supabase
        .from('pengaturan')
        .select('nomor_wa')
        .eq('id', 1)
        .single();

      if (!error && data) {
        setNoWaAdmin(data.nomor_wa);
      }
    };
    fetchNomorWa();
  }, []);

  // 3. TAMBAHKAN FUNGSI KLIK WA
  const handleKonfirmasiWA = (pesanan) => {
    let nomorBersih = noWaAdmin.replace(/\D/g, '');

    if (nomorBersih.startsWith('0')) {
      nomorBersih = '62' + nomorBersih.substring(1);
    }

    // Gunakan helper format rupiah untuk di dalam pesan WA
    const formatUang = new Intl.NumberFormat('id-ID').format(pesanan.total_harga);

    // Rakit pesan yang super detail dan rapi (menggunakan \n untuk enter/baris baru)
    const pesan = `Halo Admin Kos, saya ingin konfirmasi pembayaran kamar. Berikut detail pesanan saya:

*No. Order:* ${pesanan.no_order}
*Tipe Kamar:* ${pesanan.nama_kamar}
*Rencana Check-in:* ${pesanan.tanggal_masuk} (${pesanan.durasi})
*Total Biaya:* Rp ${formatUang}

Mohon diinfokan langkah selanjutnya untuk proses transfer/pembayaran DP. Terima kasih!`;

    window.open(`https://wa.me/${nomorBersih}?text=${encodeURIComponent(pesan)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center font-sans relative overflow-hidden">

      {/* Background Ornamen */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-600 to-indigo-800 z-0 rounded-b-[3rem] shadow-xl"></div>

      <div className="w-full max-w-xl relative z-10">
        {/* Header Kembali ke Home */}
        <a href="/" className="inline-flex items-center gap-2 text-indigo-100 hover:text-white transition font-medium mb-6">
          <ArrowLeft size={18} /> Kembali ke Beranda
        </a>

        {/* Kotak Form Pencarian */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900">Lacak Pesanan Kamar</h1>
            <p className="text-sm text-gray-500 mt-2">Masukkan Kode Booking dan Nomor WA yang Anda gunakan saat memesan.</p>
          </div>

          <form onSubmit={handleCekPesanan} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Kode Booking</label>
              <input
                type="text"
                required
                value={formData.kodeBooking}
                onChange={(e) => setFormData({ ...formData, kodeBooking: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 font-bold focus:ring-2 focus:ring-indigo-500 outline-none uppercase transition"
                placeholder="Contoh: MKS-8829"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Nomor WhatsApp</label>
              <input
                type="number"
                required
                value={formData.noWa}
                onChange={(e) => setFormData({ ...formData, noWa: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="Contoh: 62812345..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-indigo-200 disabled:bg-indigo-400"
            >
              {loading ? <><Loader2 size={20} className="animate-spin" /> Mencari Data...</> : <><Search size={20} /> Cek Pesanan Saya</>}
            </button>
          </form>
        </div>

        {/* Pesan Error */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium text-center border border-red-100 animate-fade-in-up">
            {errorMsg}
          </div>
        )}

        {/* ======================================= */}
        {/* HASIL PENCARIAN (STRUK DIGITAL)         */}
        {/* ======================================= */}
        {result && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">

            {/* Header Struk & Status */}
            <div className={`${getStatusConfig(result.status).bg} border-b ${getStatusConfig(result.status).border} p-6 flex items-center gap-4`}>
              <div className="bg-white p-3 rounded-full shadow-sm">
                {getStatusConfig(result.status).icon}
              </div>
              <div>
                <p className={`font-extrabold text-lg ${getStatusConfig(result.status).color}`}>
                  Status: {result.status}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Order ID: <span className="font-bold text-gray-700">{result.no_order}</span>
                </p>
              </div>
            </div>

            {/* Detail Pemesan & Kamar */}
            <div className="p-6 md:p-8">
              <h3 className="font-bold text-gray-800 text-lg mb-4 border-b border-gray-100 pb-3">Rincian Pesanan</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Tipe Kamar</p>
                    <p className="text-gray-800 font-bold">{result.nama_kamar}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Rencana Check-in & Durasi</p>
                    <p className="text-gray-800 font-bold">{result.tanggal_masuk} <span className="font-normal text-gray-500">({result.durasi})</span></p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Estimasi Total Biaya</p>
                    <p className="text-indigo-600 font-bold text-lg">Rp {formatRupiah(result.total_harga)}</p>
                  </div>
                </div>
              </div>

              {/* Pesan Khusus Berdasarkan Status */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100">
                {result.status === 'Menunggu' && (
                  <><div className='text-center'>
                    <p>Pesanan Anda sedang kami tinjau. Silakan klik tombol di bawah untuk melanjutkan komunikasi via WhatsApp dan mendapatkan instruksi pembayaran DP.</p>
                  </div>
                    <div className='flex justify-center mt-5 w-full'><button
                      onClick={() => handleKonfirmasiWA(result)}
                      className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-lg transition shadow-md"
                    >
                      Konfirmasi Pembayaran via WA
                    </button></div>
                  </>
                )}
                {result.status === 'Dikonfirmasi' && 'Terima kasih! Pembayaran / Pesanan Anda sudah kami konfirmasi. Kami tunggu kedatangannya sesuai tanggal Check-in.'}
                {result.status === 'Selesai' && 'Masa sewa Anda telah selesai. Terima kasih telah mempercayakan Kos kami!'}
                {result.status === 'Dibatalkan' && 'Mohon maaf, pesanan ini telah dibatalkan.'}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}