import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Komisi = () => {
    // State untuk menyimpan data komisi
    const [data, setData] = useState([]);

    // Ambil data komisi dari API saat komponen pertama kali dimuat
    useEffect(() => {
        const fetchCommissions = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/komisi');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCommissions();
    }, []);

    // Fungsi untuk format angka dengan pemisah ribuan
    const formatNumber = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <div className="komisi-container">
            <h1>Marketing Komisi</h1>

            <table className="table">
                <thead>
                    <tr>
                        <th>Marketing</th>
                        <th>Bulan</th>
                        <th>Omzet</th>
                        <th>Komisi %</th>
                        <th>Komisi Nominal</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.marketing}</td>
                            <td>{item.bulan}</td>
                            <td>{formatNumber(item.omzet)}</td>
                            <td>{item.komisi_persen}%</td>
                            <td>{formatNumber(item.komisi_nominal)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Komisi;
