import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import DaftarPembayaran from './components/DaftarPembayaran/DaftarPembayaran';
import Komisi from './components/Komisi/Komisi';
import './App.css';
import DaftarPenjual from './components/DaftarPenjual/DaftarPenjual';
import DaftarMarketing from './components/DaftarMarketing/DaftarMarketing';

/**
 * Komponen Navigation untuk menampilkan navigasi berbasis router
 */
function Navigation() {
  const location = useLocation(); // Mendapatkan lokasi path saat ini

  // Mengatur warna latar belakang berdasarkan path saat ini
  const getLinkStyle = () => ({
    backgroundColor: location.pathname === "/" ? "rgb(0, 0, 0)" : "rgb(0, 0, 0)" // Warna latar belakang untuk aktif link
  });

  return (
    <nav className='navbar'>
      <ul className='items'>
        <li className='item'>
          <Link
            to="/"
            style={location.pathname === "/" ? getLinkStyle() : {}}
            className={location.pathname === "/" ? 'active' : ''}
          >
            Komisi
          </Link>
        </li>
        <li className='item'>
          <Link
            to="/daftar-pembayaran"
            style={location.pathname === "/daftar-pembayaran" ? getLinkStyle() : {}}
            className={location.pathname === "/daftar-pembayaran" ? 'active' : ''}
          >
            Daftar Pembayaran
          </Link>
        </li>
        <li className='item'>
          <Link
            to="/daftar-penjualan"
            style={location.pathname === "/daftar-penjualan" ? getLinkStyle() : {}}
            className={location.pathname === "/daftar-penjualan" ? 'active' : ''}
          >
            Daftar Penjualan
          </Link>
        </li>
        <li className='item'>
          <Link
            to="/daftar-marketing"
            style={location.pathname === "/daftar-marketing" ? getLinkStyle() : {}}
            className={location.pathname === "/daftar-marketing" ? 'active' : ''}
          >
            Daftar Marketing
          </Link>
        </li>
      </ul>
    </nav>
  );
}

/**
 * Komponen utama aplikasi yang merender router dan navigasi
 */
function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<Komisi />} />
          <Route path="/daftar-pembayaran" element={<DaftarPembayaran />} />
          <Route path="/daftar-penjualan" element={<DaftarPenjual />} />
          <Route path="/daftar-marketing" element={<DaftarMarketing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
