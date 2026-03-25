import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- Import halaman baru

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Tambahkan rute Register di sini */}
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<h1 style={{textAlign: 'center', marginTop: '50px'}}>Selamat Datang di Dashboard HRD!</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;