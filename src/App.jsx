import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WhatsApp from './pages/WhatsApp';
import TambahKaryawan from './pages/TambahKaryawan';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tambah-karyawan" element={<TambahKaryawan />} />
        
        {/* <-- 2. Tambahkan rutenya */}
        <Route path="/whatsapp" element={<WhatsApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;