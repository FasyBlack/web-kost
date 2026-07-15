import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Security() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek apakah ada sesi login yang tersimpan di browser
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Pantau secara real-time (misal kalau tokennya tiba-tiba expired)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Tampilkan teks loading sebentar saat lagi ngecek identitas
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600 font-bold">
        Memeriksa Akses Keamanan...
      </div>
    );
  }

  // Kalau nggak ada sesi (belum login), paksa balik ke /login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Kalau aman, persilakan render halaman Admin (Outlet)
  return <Outlet />;
}