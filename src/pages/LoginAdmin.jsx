import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Alat buat mindahin halaman nanti

  // Fungsi pura-pura login (Nanti kita ganti pakai fungsi Supabase betulan)
  const handleLogin = (e) => {
    e.preventDefault(); // Biar pagenya nggak kereload pas tombol diklik
    console.log("Mencoba login dengan:", email, password);
    // Nanti logika Supabase Auth masuk sini. 
    // Kalau berhasil -> navigate('/admin')
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000)' }}
    >
      {/* Overlay Hitam Transparan biar teks lebih kebaca */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Container Utama (Mirip gambar referensi) */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
        
        {/* KOLOM KIRI (Branding KOSTKU) */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center text-white">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="text-indigo-400" size={32} />
            <h1 className="text-3xl font-extrabold tracking-wider">KOST<span className="text-indigo-400">KU</span></h1>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Sistem<br />Manajemen<br />Admin.
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Kelola data kamar, pantau pemesanan, dan atur tampilan website dengan aman dan mudah dalam satu pintu.
          </p>
        </div>

        {/* KOLOM KANAN (Form Login Glassmorphism) */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-inner">
            <h3 className="text-2xl font-bold text-white mb-6">Sign In</h3>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kostku.com"
                  className="w-full bg-white/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
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
                  className="w-full bg-white/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  required
                />
              </div>

              <div className="text-right">
                <a href="#" className="text-sm text-yellow-300 hover:text-white transition">Lupa password?</a>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg"
              >
                MASUK DASHBOARD
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}