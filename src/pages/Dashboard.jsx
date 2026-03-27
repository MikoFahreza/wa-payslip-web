import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  // Ingatan untuk menyimpan daftar karyawan dari Golang
  const [karyawans, setKaryawans] = useState([]);
  const navigate = useNavigate();

  // useEffect akan berjalan otomatis saat halaman pertama kali dimuat
  useEffect(() => {
    // 1. Cek apakah ada token di brankas browser
    const token = localStorage.getItem('token');
    
    // Jika tidak ada token (belum login), tendang kembali ke halaman Login!
    if (!token) {
      navigate('/login');
      return; // Hentikan proses ke bawah
    }

    // 2. Fungsi untuk mengambil data dari Golang
    const fetchKaryawan = async () => {
      try {
        // KITA BAWA TIKET JWT-NYA DI SINI! (Sebagai Header Authorization)
        const response = await axios.get('http://localhost:8080/api/karyawan', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Simpan datanya ke dalam ingatan React
        setKaryawans(response.data.data || []);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
        // Jika Golang menolak (misal token expired/kadaluarsa status 401)
        if (error.response && error.response.status === 401) {
          alert('Sesi Anda telah habis. Silakan login kembali.');
          localStorage.removeItem('token'); // Hapus token rusak
          navigate('/login');
        }
      }
    };

    fetchKaryawan();
  }, [navigate]); // React meminta navigate dimasukkan ke sini sebagai aturan baku

  // Fungsi untuk Logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Buang tiketnya
    navigate('/login'); // Lempar ke halaman login
  };

  // Tampilan Antarmuka (UI)
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard HRD</h2>
        <button 
          onClick={handleLogout} 
          style={{ padding: '8px 15px', backgroundColor: '#DC3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
        >
          Logout
        </button>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <h3>Daftar Karyawan</h3>
      
      {/* Tabel Sederhana */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Nama</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Nomor WA</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Posisi</th>
          </tr>
        </thead>
        <tbody>
          {/* Kita lakukan perulangan (mapping) untuk setiap data karyawan */}
          {karyawans.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                Belum ada data karyawan.
              </td>
            </tr>
          ) : (
            karyawans.map((k) => (
              <tr key={k.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{k.id}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{k.nama}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{k.nomor_wa}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{k.posisi}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}