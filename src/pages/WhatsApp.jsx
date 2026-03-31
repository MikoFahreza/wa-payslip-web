import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react'; // Alat penggambar QR

export default function WhatsApp() {
  const [isConnected, setIsConnected] = useState(false);
  const [qrCodeString, setQrCodeString] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Efek berjalan pertama kali saat halaman dibuka
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    checkStatus();
  }, [navigate, token]);

  // Fungsi untuk mengecek status koneksi ke Golang
  const checkStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/wa/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsConnected(response.data.is_connected);
    } catch (error) {
      console.error("Detail masalah:", error); // <-- Sekarang variabelnya terpakai!
      setErrorMsg('Gagal mengecek status WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk meminta QR Code baru
  const requestQR = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const response = await axios.get('http://localhost:8080/api/wa/qr', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Simpan teks mentah dari Golang ke dalam ingatan React
      setQrCodeString(response.data.qr_string);
    } catch (error) {
      setErrorMsg(error.response?.data?.error || 'Gagal meminta QR Code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Pengaturan Gateway WhatsApp</h2>
      
      {/* Tombol kembali ke Dashboard */}
      <div style={{ textAlign: 'left', marginBottom: '20px' }}>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 15px', cursor: 'pointer' }}>
          &larr; Kembali ke Dashboard
        </button>
      </div>

      <hr style={{ margin: '20px 0' }} />

      {loading ? (
        <p>Memuat status...</p>
      ) : isConnected ? (
        <div style={{ padding: '30px', backgroundColor: '#d4edda', borderRadius: '8px', color: '#155724' }}>
          <h3>✅ WhatsApp Sudah Terhubung</h3>
          <p>Sistem siap digunakan untuk mengirim dokumen slip gaji.</p>
        </div>
      ) : (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3 style={{ color: '#dc3545' }}>❌ WhatsApp Belum Terhubung</h3>
          <p>Silakan hubungkan perangkat pengirim utama (Gateway).</p>
          
          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

          {/* Jika belum ada string QR, tampilkan tombol. Jika sudah ada, gambar QR-nya */}
          {!qrCodeString ? (
            <button 
              onClick={requestQR} 
              style={{ padding: '10px 20px', backgroundColor: '#28A745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
            >
              Munculkan QR Code
            </button>
          ) : (
            <div style={{ marginTop: '20px' }}>
              <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>Scan QR Code ini menggunakan WhatsApp Anda (Link Devices):</p>
              
              {/* Ini adalah proses "Sihir" mengubah teks menjadi gambar */}
              <QRCodeCanvas value={qrCodeString} size={250} level={"H"} />
              
              <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                Setelah di-scan, silakan klik tombol di bawah ini untuk memperbarui status.
              </p>
              <button 
                onClick={checkStatus} 
                style={{ padding: '8px 15px', marginTop: '10px', cursor: 'pointer' }}
              >
                Cek Ulang Status
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}