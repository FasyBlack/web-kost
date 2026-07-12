import BookingTable from '../../components/admin/BookingTable';

export default function DashboardHome() {
  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg shadow-indigo-200 mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Selamat Pagi, Admin!</h2>
          <p className="text-indigo-100">Ada 3 bookingan kamar baru hari ini yang perlu dicek.</p>
        </div>
        <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-bold shadow hover:bg-gray-50 transition">
          Cek Sekarang
        </button>
      </div>
      <BookingTable />
    </>
  );
}