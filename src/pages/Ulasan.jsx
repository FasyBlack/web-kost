import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Star, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

export default function Ulasan() {
  const [searchParams] = useSearchParams();
  const kodeBooking = searchParams.get('kode') || ''; // Mengambil "?kode=" dari URL

  const [loading, setLoading] = useState(true);
  const [validBooking, setValidBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [teksUlasan, setTeksUlasan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Cek Validitas Kode Booking saat halaman dibuka
  useEffect(() => {
    const cekKodeBooking = async () => {
      if (!kodeBooking) {
        setErrorMsg('Kode Booking tidak ditemukan di URL.');
        setLoading(false);
        return;
      }

      // Cari data booking di Supabase
      const { data, error } = await supabase
        .from('booking')
        .select('*')
        .eq('no_order', kodeBooking)
        .single();

      if (error || !data) {
        setErrorMsg('Data pesanan tidak ditemukan. Pastikan link yang Anda gunakan benar.');
      } else if (data.status !== 'Selesai') {
        setErrorMsg(`Ulasan belum bisa diberikan karena status pesanan Anda masih "${data.status}". Ulasan hanya untuk masa sewa yang telah selesai.`);
      } else {
        // Kalau valid dan berstatus 'Selesai'
        setValidBooking(data);
      }
      setLoading(false);
    };

    cekKodeBooking();
  }, [kodeBooking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Silakan pilih rating bintang terlebih dahulu!');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from('testimoni')
      .insert([
        {
          no_order: validBooking.no_order,
          nama: validBooking.nama_pemesan,
          rating: rating,
          ulasan: teksUlasan,
          tampil: false // Masuk antrean review admin dulu
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      toast.error('Gagal mengirim ulasan, silakan coba lagi.');
      console.error(error);
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Biru */}
        <div className="bg-indigo-600 p-6 text-center">
          <a href="/" className="inline-flex items-center gap-1 text-indigo-200 hover:text-white text-sm mb-4 transition absolute top-6 left-6">
            <ArrowLeft size={16} /> Beranda
          </a>
          <h2 className="text-2xl font-extrabold text-white mt-4">Penilaian Kos</h2>
          <p className="text-indigo-200 text-sm mt-1">Bagaimana pengalaman Anda?</p>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-indigo-600">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="font-medium text-sm">Memeriksa data pesanan...</p>
            </div>
          ) : errorMsg ? (
            <div className="text-center py-6">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Akses Ditolak</h3>
              <p className="text-sm text-gray-500">{errorMsg}</p>
            </div>
          ) : isSuccess ? (
            <div className="text-center py-6 animate-in zoom-in duration-300">
              <CheckCircle2 size={56} className="mx-auto text-green-500 mb-4" />
              <h3 className="font-extrabold text-xl text-gray-800 mb-2">Terima Kasih, {validBooking.nama_pemesan}!</h3>
              <p className="text-sm text-gray-500">Ulasan Anda sangat berarti untuk membantu kami meningkatkan kualitas pelayanan kos ke depannya.</p>
              <a href="/" className="mt-8 inline-block bg-indigo-50 text-indigo-600 font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-100 transition">
                Kembali ke Beranda
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center border-b border-gray-100 pb-6">
                <p className="text-sm text-gray-500 mb-1">Halo, <span className="font-bold text-gray-800">{validBooking.nama_pemesan}</span>!</p>
                <p className="text-xs text-gray-400">Pesanan: {validBooking.nama_kamar} ({validBooking.no_order})</p>
              </div>

              {/* Input Bintang Interaktif */}
              <div className="flex flex-col items-center">
                <label className="font-bold text-gray-800 mb-3 text-lg">Berikan Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={40} 
                        fill={(hoverRating || rating) >= star ? "#F59E0B" : "transparent"}
                        className={`${(hoverRating || rating) >= star ? "text-yellow-500" : "text-gray-300"} transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-medium text-gray-400 mt-2">
                  {rating === 1 && 'Sangat Kurang'}
                  {rating === 2 && 'Kurang'}
                  {rating === 3 && 'Cukup'}
                  {rating === 4 && 'Bagus'}
                  {rating === 5 && 'Sangat Bagus!'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tulis Pengalaman Anda</label>
                <textarea 
                  required
                  rows="4"
                  value={teksUlasan}
                  onChange={(e) => setTeksUlasan(e.target.value)}
                  placeholder="Ceritakan kenyamanan kamar, fasilitas, kebersihan, dll..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-indigo-200 disabled:bg-indigo-400"
              >
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Mengirim...</> : 'Kirim Ulasan'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}