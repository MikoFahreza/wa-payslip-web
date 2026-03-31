import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TambahKaryawan() {
  const [nama, setNama] = useState('');
  const [nomorWa, setNomorWa] = useState('');
  const [posisi, setPosisi] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    setErrorMsg('');
    setIsLoading(true);

    try {
      // Ambil kunci brankas
      const token = localStorage.getItem('token');
      
      // Tembak API backend
      await axios.post('http://localhost:8080/api/karyawan', {
        nama: nama,
        nomor_wa: nomorWa,
        posisi: posisi
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Sertakan tiket masuk
        }
      });

      alert('Data Karyawan berhasil ditambahkan!');
      navigate('/dashboard'); // Kembali ke halaman utama

    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg('Gagal terhubung ke server. Pastikan backend menyala.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', cursor: 'pointer' }}>
        &larr; Kembali
      </button>

      <h2>Tambah Karyawan Baru</h2>
      <hr style={{ marginBottom: '20px' }} />

      {errorMsg && <p style={{ color: 'red', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px' }}>{errorMsg}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontWeight: 'bold' }}>Nama Lengkap:</label>
          <input 
            type="text" 
            value={nama} 
            onChange={(e) => setNama(e.target.value)} 
            required 
            placeholder="Contoh: Budi Santoso"
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold' }}>Nomor WhatsApp:</label>
          <input 
            type="text" 
            value={nomorWa} 
            onChange={(e) => setNomorWa(e.target.value)} 
            required 
            placeholder="Contoh: 081234567890"
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
          />
          <small style={{ color: 'gray' }}>Pastikan nomor aktif di WhatsApp.</small>
        </div>

        <div>
          <label style={{ fontWeight: 'bold' }}>Posisi / Jabatan:</label>
          <input 
            type="text" 
            value={posisi} 
            onChange={(e) => setPosisi(e.target.value)} 
            required 
            placeholder="Contoh: Software Engineer"
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            padding: '12px', 
            backgroundColor: isLoading ? '#ccc' : '#007BFF', 
            color: 'white', 
            border: 'none', 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
            marginTop: '10px'
          }}
        >
          {isLoading ? 'Menyimpan...' : 'Simpan Karyawan'}
        </button>
      </form>
    </div>
  );
}