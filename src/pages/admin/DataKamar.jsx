import { useState } from 'react';
import { Search, Plus, Edit, BedDouble, Users, CheckCircle2, Wifi, Wind, Coffee, LayoutGrid } from 'lucide-react';

// 1. Data Dummy Kamar (Nanti diganti dari Supabase)
const roomsData = [
  {
    id: 1,
    name: 'Kamar Premium A',
    type: 'Premium',
    price: '1.500.000',
    status: 'Tersedia',
    capacity: '1 Orang',
    bed: 'Springbed Double',
    size: '4 x 4 m',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80',
    desc: 'Kamar luas dengan fasilitas lengkap, cocok untuk pekerja atau mahasiswa yang butuh kenyamanan ekstra.',
    features: ['AC Dingin', 'Kamar Mandi Dalam', 'Lemari Pakaian', 'Meja Belajar', 'Free Laundry 10kg']
  },
  {
    id: 2,
    name: 'Kamar Standar B',
    type: 'Standar',
    price: '800.000',
    status: 'Penuh',
    capacity: '1 Orang',
    bed: 'Kasur Single',
    size: '3 x 3 m',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80',
    desc: 'Kamar nyaman dan ekonomis. Cocok untuk mahasiswa dengan budget pas-pasan namun tetap ingin fasilitas bersih.',
    features: ['Kipas Angin', 'Kamar Mandi Luar', 'Lemari Pakaian', 'Free Air Galon']
  },
  {
    id: 3,
    name: 'Kamar Eksklusif C',
    type: 'Premium',
    price: '2.000.000',
    status: 'Tersedia',
    capacity: '2 Orang',
    bed: 'Queen Bed',
    size: '5 x 5 m',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80',
    desc: 'Kamar super luas bisa untuk berdua (pasutri/kakak adik). Fasilitas setara apartemen studio.',
    features: ['AC Dingin', 'Kamar Mandi Dalam (Air Panas)', 'TV Pintar', 'Kulkas Mini', 'Akses Kartu']
  }
];

export default function DataKamar() {
  // 2. State untuk melacak kamar mana yang lagi di-klik (Default: kamar pertama)
  const [selectedRoom, setSelectedRoom] = useState(roomsData[0]);

  return (
    <div className="h-full flex flex-col">
      
      {/* HEADER BAR (Search & Add Button) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari tipe atau nama kamar..." 
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600 outline-none">
            <option>Semua Tipe</option>
            <option>Premium</option>
            <option>Standar</option>
          </select>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold shadow-md hover:bg-indigo-700 transition w-full md:w-auto justify-center">
            <Plus size={18} /> Tambah Kamar
          </button>
        </div>
      </div>

      {/* MAIN GRID LAYOUT (Kiri: List, Kanan: Detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* BAGIAN KIRI: DAFTAR KAMAR */}
        <div className="lg:col-span-2 space-y-4">
          {roomsData.map((room) => (
            <div 
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`flex flex-col sm:flex-row bg-white rounded-2xl border p-3 gap-4 cursor-pointer transition shadow-sm hover:shadow-md
                ${selectedRoom.id === room.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-100'}`}
            >
              {/* Thumbnail Image */}
              <img src={room.image} alt={room.name} className="w-full sm:w-48 h-32 object-cover rounded-xl" />
              
              {/* Short Details */}
              <div className="flex-1 py-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-gray-800">{room.name}</h3>
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${room.status === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {room.status}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1"><LayoutGrid size={14} /> {room.size}</span>
                    <span className="flex items-center gap-1"><BedDouble size={14} /> {room.bed}</span>
                    <span className="flex items-center gap-1"><Users size={14} /> {room.capacity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-gray-800">Rp {room.price}</span>
                  <span className="text-xs text-gray-400"> / bulan</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BAGIAN KANAN: PANEL DETAIL KAMAR (Sticky) */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-lg">Detail Kamar</h3>
            <button className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition">
              <Edit size={14} /> Edit
            </button>
          </div>
          
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{selectedRoom.name}</h2>
          <div className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold mb-4">
            Tipe: {selectedRoom.type}
          </div>

          <img src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-48 object-cover rounded-xl mb-4" />
          
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            {selectedRoom.desc}
          </p>

          <h4 className="font-bold text-sm text-gray-800 mb-3 border-b pb-2">Fasilitas Termasuk</h4>
          <ul className="space-y-2 mb-6">
            {selectedRoom.features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 size={16} className="text-green-500" /> {feat}
              </li>
            ))}
          </ul>

          <div className="bg-indigo-50 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="text-xs text-indigo-400 font-bold uppercase">Harga Sewa</p>
              <p className="text-xl font-bold text-indigo-700">Rp {selectedRoom.price}</p>
            </div>
            {selectedRoom.status === 'Tersedia' ? (
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-indigo-700 transition">
                Set Jadi Penuh
              </button>
            ) : (
              <button className="bg-white border-2 border-indigo-200 text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition">
                Set Tersedia
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}