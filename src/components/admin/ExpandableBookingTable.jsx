import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const bookings = [
  { id: '07097', nama: 'Budi Santoso', kamar: 'Premium', status: 'Menunggu', telp: '08123456789', checkin: '2026-07-20' },
  { id: '05597', nama: 'Siti Aminah', kamar: 'Standar', status: 'Dikonfirmasi', telp: '08987654321', checkin: '2026-07-22' },
];

function BookingRow({ booking }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <td className="py-4 font-medium text-gray-700">{booking.id}</td>
        <td className="py-4 text-gray-700">{booking.nama}</td>
        <td className="py-4 text-gray-500">{booking.kamar}</td>
        <td className="py-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
            {booking.status}
          </span>
        </td>
        <td className="py-4 text-right">
          <button className="text-gray-400 hover:text-indigo-600 transition">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </td>
      </tr>

      {isOpen && (
        <tr className="bg-indigo-50/30">
          <td colSpan="5" className="p-4 text-sm text-gray-600">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="font-bold text-xs uppercase text-gray-400">No. WhatsApp</p><p>{booking.telp}</p></div>
              <div><p className="font-bold text-xs uppercase text-gray-400">Rencana Check-in</p><p>{booking.checkin}</p></div>
            </div>
            <div className="mt-4 flex gap-3">
               <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700">Hubungi WA</button>
               <button className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100">Edit Data</button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function ExpandableBookingTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-lg text-gray-800 mb-6">Data Booking Lengkap</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-sm border-b">
              <th className="pb-3 font-medium">No Order</th>
              <th className="pb-3 font-medium">Nama Pemesan</th>
              <th className="pb-3 font-medium">Tipe Kamar</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Detail</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => <BookingRow key={b.id} booking={b} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}