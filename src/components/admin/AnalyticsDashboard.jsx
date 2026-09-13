import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Sesuaikan path supabaseClient kamu
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Home, ShoppingBag, DollarSign, Clock } from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const AnalyticsDashboard = () => {
  const currentYear = new Date().getFullYear();
  
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState([currentYear]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    terisi: 0,
    tersedia: 0,
    totalKamar: 0,
    roomOccupancy: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedYear]);

  const fetchAnalyticsData = async () => {
    try {
      // 1. FETCH DATA KAMAR (Status: Tersedia / Penuh)
      const { data: rooms, error: roomErr } = await supabase.from('kamar').select('status');
      if (roomErr) console.error("Error Kamar:", roomErr);

      const totalKamar = rooms?.length || 0;
      const jumlahPenuh = rooms?.filter(r => r.status?.toLowerCase() === 'penuh').length || 0;
      const jumlahTersedia = rooms?.filter(r => r.status?.toLowerCase() === 'tersedia').length || 0;

      // 2. FETCH DATA BOOKING / PESANAN
      const { data: bookings, error: bookErr } = await supabase.from('pesanan').select('*');
      if (bookErr) console.error("Error Booking:", bookErr);

      const allBookings = bookings || [];

      // Filter Tahun untuk Dropdown (Ambil tahun unik dari data booking)
      const yearsSet = new Set([currentYear]);
      allBookings.forEach(item => {
        if (item.created_at || item.created_date) {
          const date = new Date(item.created_at || item.created_date);
          if (!isNaN(date.getFullYear())) {
            yearsSet.add(date.getFullYear());
          }
        }
      });
      const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);
      setAvailableYears(sortedYears);

      // Hitung Pesanan Lunas / Selesai / Dikonfirmasi
      const validBookings = allBookings.filter(b => 
        ['selesai', 'dikonfirmasi'].includes(b.status?.toLowerCase())
      );

      const pendingCount = allBookings.filter(b => 
        b.status?.toLowerCase() === 'menunggu'
      ).length;

      const totalPendapatan = validBookings.reduce((sum, item) => sum + (Number(item.total_harga) || 0), 0);

      // 3. OLAH DATA BULANAN BERDASARKAN TAHUN YANG DIPILIH
      const monthlyData = MONTH_NAMES.map((month, index) => {
        const totalBulanIni = validBookings
          .filter(b => {
            const date = new Date(b.created_at || b.created_date);
            return date.getFullYear() === Number(selectedYear) && date.getMonth() === index;
          })
          .reduce((sum, item) => sum + (Number(item.total_harga) || 0), 0);

        return { month, revenue: totalBulanIni };
      });

      setMonthlyTrends(monthlyData);

      // Data Pie Chart (Status Kamar)
      setDashboardData({
        totalOrders: validBookings.length,
        totalRevenue: totalPendapatan,
        pendingOrders: pendingCount,
        terisi: jumlahPenuh,
        tersedia: jumlahTersedia,
        totalKamar: totalKamar,
        roomOccupancy: [
          { name: 'Penuh / Terisi', value: jumlahPenuh, color: '#EF4444' },    // Merah untuk penuh
          { name: 'Tersedia', value: jumlahTersedia, color: '#10B981' }         // Hijau untuk tersedia
        ]
      });

    } catch (err) {
      console.error("Gagal menarik data analitik:", err);
    }
  };

  // Hitung persentase okupansi
  const occupancyRate = dashboardData.totalKamar > 0 
    ? Math.round((dashboardData.terisi / dashboardData.totalKamar) * 100) 
    : 0;

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '16px' }}>
      
      {/* HEADER + DROPDOWN TAHUN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0F172A', margin: 0 }}>
          Analitik & Performa Kost
        </h2>
        
        {/* Dropdown Filter Tahun */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#64748B' }}>Tahun:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontWeight: '600',
              color: '#1E293B',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard 
          title="Total Transaksi Valid" 
          value={`${dashboardData.totalOrders} Transaksi`} 
          icon={<ShoppingBag color="#3B82F6" />} 
          bgColor="#EFF6FF"
        />
        <StatCard 
          title="Okupansi Kamar" 
          value={`${occupancyRate}%`} 
          subtitle={`${dashboardData.terisi} dari ${dashboardData.totalKamar} Kamar Penuh`} 
          icon={<Home color="#10B981" />} 
          bgColor="#ECFDF5"
        />
        <StatCard 
          title="Estimasi Pendapatan" 
          value={`Rp ${dashboardData.totalRevenue.toLocaleString('id-ID')}`} 
          icon={<DollarSign color="#F59E0B" />} 
          bgColor="#FFFBEB"
        />
        <StatCard 
          title="Menunggu Konfirmasi" 
          value={`${dashboardData.pendingOrders} Booking`} 
          subtitle="Perlu Tindakan Admin"
          icon={<Clock color="#EF4444" />} 
          bgColor="#FEF2F2"
        />
      </div>

      {/* GRAPH SECTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Grafik Area Pendapatan Bulanan */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: '#334155' }}>
            Tren Pendapatan Tahun {selectedYear}
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" tickLine={false} />
                <YAxis stroke="#94A3B8" tickLine={false} tickFormatter={(val) => val >= 1000000 ? `Rp${val/1000000}M` : val} />
                <Tooltip formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']} />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grafik Pie Status Kamar */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: '#334155' }}>
            Status Kamar Kost
          </h3>
          <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {dashboardData.totalKamar === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '14px' }}>Belum ada data kamar</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={dashboardData.roomOccupancy} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60} 
                    outerRadius={85} 
                    paddingAngle={5} 
                    dataKey="value"
                  >
                    {dashboardData.roomOccupancy.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} Kamar`, name]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// Sub-komponent Kartu Statistik
const StatCard = ({ title, value, subtitle, icon, bgColor }) => (
  <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
    <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontWeight: '500' }}>{title}</p>
      <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: '2px 0 0 0', color: '#0F172A' }}>{value}</h4>
      {subtitle && <p style={{ fontSize: '11px', color: '#64748B', margin: 0, marginTop: '2px' }}>{subtitle}</p>}
    </div>
  </div>
);

export default AnalyticsDashboard;