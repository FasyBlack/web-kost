export default function BookingTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-gray-800">Booking Terbaru</h3>
        <button className="text-sm text-indigo-600 font-medium hover:underline">Lihat Semua</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-sm border-b">
              <th className="pb-3 font-medium">Nama Pemesan</th>
              <th className="pb-3 font-medium">Tipe Kamar</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
              <td className="py-4 font-medium text-gray-700">Budi Santoso</td>
              <td className="py-4 text-gray-500">Kamar Premium</td>
              <td className="py-4">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Menunggu</span>
              </td>
              <td className="py-4 text-right">
                <button className="text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-lg font-medium hover:bg-indigo-100 transition">Hubungi WA</button>
              </td>
            </tr>
            <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
              <td className="py-4 font-medium text-gray-700">Siti Aminah</td>
              <td className="py-4 text-gray-500">Kamar Standar</td>
              <td className="py-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Dikonfirmasi</span>
              </td>
              <td className="py-4 text-right">
                <button className="text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-lg font-medium hover:bg-indigo-100 transition">Hubungi WA</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}