import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
// 1. Panggil kabel koneksi Supabase-nya
import { supabase } from '../supabaseClient'; 

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State baru buat nampilin error & efek loading
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // 2. Fungsi handleLogin diubah jadi 'async' karena kita bakal nunggu jawaban dari database
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(''); // Reset error setiap kali mau nyoba login lagi

    // 3. Ketuk pintu Supabase buat ngecek email & password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    // 4. Cek hasilnya
    if (error) {
      setErrorMsg('Email atau password salah, coba lagi bro!');
      setIsLoading(false);
    } else {
      // Kalau berhasil, langsung tendang ke halaman Admin
      navigate('/admin'); 
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000)' }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
        
        {/* KOLOM KIRI */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center text-white">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="text-indigo-400" size={32} />
            <h1 className="text-3xl font-extrabold tracking-wider">MA<span className="text-indigo-400">KOS</span></h1>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Sistem<br />Manajemen<br />Admin.
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Kelola data kamar, pantau pemesanan, dan atur tampilan website dengan aman dan mudah dalam satu pintu.
          </p>
        </div>

        {/* KOLOM KANAN */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-inner">
            <h3 className="text-2xl font-bold text-white mb-6">Sign In</h3>
            
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Tempat Nampilin Error Muncul Di Sini */}
              {errorMsg && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm text-center font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kostku.com"
                  className="w-full bg-white/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  required
                />
              </div>

              <div className="text-right">
                <a href="#" className="text-sm text-indigo-300 hover:text-white transition">Lupa password?</a>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg flex justify-center items-center"
              >
                {isLoading ? 'MEMPROSES...' : 'MASUK DASHBOARD'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}