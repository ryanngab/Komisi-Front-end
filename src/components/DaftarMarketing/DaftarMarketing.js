import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Komponen utama untuk menampilkan daftar marketing
const DaftarMarketing = () => {
    // State untuk menyimpan data marketing
    const [data, setData] = useState([]);
    // State untuk mengontrol status modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Ambil data marketing saat komponen pertama kali dimuat
    useEffect(() => {
        fetchMarketingData();
    }, []);

    // Fungsi untuk mengambil data marketing dari API
    const fetchMarketingData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/daftar-marketing');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Fungsi untuk membuka modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Fungsi untuk menutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Fungsi untuk menambahkan marketing baru dan memperbarui data
    const addNewMarketing = async (newMarketing) => {
        try {
            await fetchMarketingData(); // Fetch data terbaru dari server
        } catch (error) {
            console.error('Error fetching data after adding new marketing:', error);
        }
    };

    return (
        <div className="komisi-container">
            <h1>Daftar Marketing</h1>
            <div className="toolbar">
                <button onClick={handleOpenModal} className='btn'>Tambah Data</button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <Modal
                    onClose={handleCloseModal}
                    addNewMarketing={addNewMarketing}
                />
            )}
        </div>
    );
};

// Komponen Modal untuk menambahkan marketing baru
const Modal = ({ onClose, addNewMarketing }) => {
    // State untuk nama marketing
    const [name, setName] = useState('');
    // State untuk pesan status
    const [message, setMessage] = useState('');

    // Fungsi untuk mengirimkan data marketing baru
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/create-marketing', { name });
            const newMarketing = response.data;
            setMessage('Data berhasil diproses');
            await addNewMarketing(newMarketing); // Tambahkan marketing baru dan fetch data terbaru
            alert('Data berhasil diproses');
            onClose(); // Tutup modal setelah berhasil
        } catch (error) {
            setMessage('Gagal memproses data');
            alert('Gagal memproses data');
            console.error('Error:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h1>Form Marketing</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Nama:
                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <button type="submit">Kirim</button>
                </form>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default DaftarMarketing;
    