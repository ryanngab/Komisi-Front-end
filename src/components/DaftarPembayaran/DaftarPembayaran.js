import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const DaftarPembayaran = () => {
    const [pembayaran, setPembayaran] = useState([]);
    const [penjualan, setPenjualan] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Ambil data pembayaran dan penjualan saat komponen pertama kali dimuat
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ambil data pembayaran
                const pembayaranResponse = await fetch('http://localhost:8000/api/daftar-pembayaran');
                const pembayaranData = await pembayaranResponse.json();
                setPembayaran(pembayaranData);

                // Ambil data penjualan
                const penjualanResponse = await fetch('http://localhost:8000/api/daftar-penjualan');
                const penjualanData = await penjualanResponse.json();
                setPenjualan(penjualanData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Fungsi untuk membuka modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Fungsi untuk menutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Format angka dengan pemisah ribuan
    const formatNumber = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Tambahkan pembayaran baru ke dalam state
    const addNewPembayaran = (newPembayaran) => {
        setPembayaran(prevPembayaran => [...prevPembayaran, newPembayaran]);
    };

    // Temukan nomor transaksi berdasarkan ID penjualan
    const getTransactionNumberById = (id) => {
        const penjualanItem = penjualan.find(item => item.id === id);
        return penjualanItem ? penjualanItem.transaction_number : 'Unknown';
    };

    return (
        <div className='daftar-pembayaran'>
            <h1>Daftar Pembayaran</h1>
            <div className="toolbar">
                <button onClick={handleOpenModal} className='btn'>Pembayaran</button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Transaction Number</th>
                        <th>Amount</th>
                        <th>Metode Pembayaran</th>
                        <th>Tanggal Pembayaran</th>
                    </tr>
                </thead>
                <tbody>
                    {pembayaran.map((item) => (
                        <tr key={item.id}>
                            <td>{getTransactionNumberById(item.penjualan_id)}</td>
                            <td>{formatNumber(item.amount)}</td>
                            <td>{item.payment_method}</td>
                            <td>{item.payment_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <Modal
                    onClose={handleCloseModal}
                    addNewPembayaran={addNewPembayaran}
                />
            )}
        </div>
    );
};

const Modal = ({ onClose, addNewPembayaran }) => {
    const [penjualanOptions, setPenjualanOptions] = useState([]);
    const [selectedPenjualan, setSelectedPenjualan] = useState(null);
    const [amount, setAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Credit');
    const [message, setMessage] = useState('');

    // Ambil data penjualan untuk opsi Select saat modal dimuat
    useEffect(() => {
        const fetchPenjualanOptions = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/daftar-penjualan');
                const data = await response.json();
                const options = data.map(penjualan => ({
                    value: penjualan.id,
                    label: `Transaction Number: ${penjualan.transaction_number} (ID: ${penjualan.id})`
                }));
                setPenjualanOptions(options);
            } catch (error) {
                console.error('Error fetching penjualan data:', error);
            }
        };

        fetchPenjualanOptions();
    }, []);

    // Format angka dengan pemisah ribuan
    const formatNumber = (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Tangani perubahan input jumlah pembayaran
    const handleAmountChange = (event) => {
        const rawValue = event.target.value.replace(/\./g, '');
        const formattedValue = formatNumber(rawValue);
        setAmount(formattedValue);
    };

    // Kirim data pembayaran baru ke server
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/pembayaran', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    penjualan_id: selectedPenjualan ? selectedPenjualan.value : null,
                    amount: amount.replace(/\./g, ''),
                    payment_date: paymentDate,
                    payment_method: paymentMethod,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                addNewPembayaran(data); // Tambahkan pembayaran baru ke state
                alert('Pembayaran berhasil diproses');
                onClose();
            } else {
                alert(`Error: ${data.message || 'Terjadi kesalahan'}`);
            }
        } catch (error) {
            alert('Gagal memproses pembayaran: ' + error.message);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h1>Tambah Data</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Penjualan ID:
                        <Select
                            options={penjualanOptions}
                            value={selectedPenjualan}
                            onChange={setSelectedPenjualan}
                            placeholder="Pilih Penjualan ID"
                            isClearable
                        />
                    </label>
                    <br />
                    <label>
                        Jumlah Pembayaran:
                        <input
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                        />
                    </label>
                    <br />
                    <label>
                        Metode Pembayaran:
                        <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                            <option value="Credit">Credit</option>
                            <option value="Debit">Debit</option>
                            <option value="Cash">Cash</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        Tanggal Pembayaran:
                        <input type="date" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} />
                    </label>
                    <br />
                    <button type="submit">Bayar</button>
                </form>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default DaftarPembayaran;
