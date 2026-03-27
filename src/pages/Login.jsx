import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  // 1. useState adalah "Ingatan" React. 
  // Kita menyuruh React mengingat apa yang diketik user di kolom username & password.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Alat untuk berpindah halaman setelah sukses login
  const navigate = useNavigate();

  // 2. Fungsi ini dijalankan saat tombol "Login" ditekan
  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah halaman web me-refresh sendiri
    setErrorMsg('');    // Kosongkan pesan error (jika ada)

    try {
      // 3. Menembak API Golang Anda!
      const response = await axios.post('http://localhost:8080/api/login', {
        username: username,
        password: password
      });

      // 4. Jika sukses, Golang akan mengirimkan Token JWT. 
      // Kita simpan token ini di "Brankas Browser" (localStorage) agar tidak hilang.
      localStorage.setItem('token', response.data.token);
      
      alert('Login Berhasil!');
      
      // 5. Pindah ke halaman Dashboard (nanti kita buat)
      navigate('/dashboard');

    } catch (error) {
      // Jika Golang menolak (password salah), tampilkan error
      if (error.response) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg('Gagal terhubung ke server Backend.');
      }
    }
  };

  // 6. Tampilan HTML (UI)
  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Login</h2>
      
      {/* Jika ada error, tampilkan teks berwarna merah */}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} // Mengubah ingatan React saat diketik
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} // Mengubah ingatan React saat diketik
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
          Masuk
        </button>
      </form>
      
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Belum punya akun? <Link to="/register">Buat Akun Baru</Link>
      </p>
    </div>
  );
}