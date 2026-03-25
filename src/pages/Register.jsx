import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      // Menembak API Register Golang
      await axios.post('http://localhost:8080/api/register', {
        username: username,
        password: password,
        role: 'admin'
      });

      alert('Akun berhasil dibuat! Silakan Login.');
      navigate('/login'); // Lempar user kembali ke halaman login

    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg('Gagal terhubung ke server.');
      }
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Buat Akun Baru</h2>
      
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Username Baru:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>Password Baru:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#28A745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Daftar Sekarang
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Sudah punya akun? <Link to="/login">Login di sini</Link>
      </p>
    </div>
  );
}