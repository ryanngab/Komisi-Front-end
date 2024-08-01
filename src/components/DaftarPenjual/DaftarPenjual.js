import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const DaftarPenjual = () => {
    const [data, setData] = useState([]);
    const [marketingData, setMarketingData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fungsi untuk membuka modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Fungsi untuk menutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Mengambil data penjualan dan data marketing saat komponen pertama kali dimuat
    useEffect(() => {
        // Ambil data penjualan
        axios.get('http://127.0.0.1:8000/api/daftar-penjualan')
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching data:', error));

        // Ambil data marketing
        axios.get('http://127.0.0.1:8000/api/daftar-marketing')
            .then(response => setMarketingData(response.data))
            .catch(error => console.error('Error fetching marketing data:', error));
    }, []);

    // Fungsi untuk menambahkan penjualan baru ke dalam state
    const addNewPenjualan = (newPenjualan) => {
        setData(prevData => [...prevData, newPenjualan]);
    };

    // Format angka dengan pemisah ribuan
    const formatNumber = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Temukan nama marketing berdasarkan ID
    const getMarketingNameById = (id) => {
        const marketing = marketingData.find(item => item.id === id);
        return marketing ? marketing.name : 'Unknown';
    };

    return (
        <div className="komisi-container">
            <h1>Table Penjualan</h1>
            <div className="toolbar">
                <button onClick={handleOpenModal} className='btn'>Add Data</button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Transaction Number</th>
                        <th>Marketing Name</th>
                        <th>Date</th>
                        <th>Cargo Fee</th>
                        <th>Total Balance</th>
                        <th>Grand Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.transaction_number}</td>
                            <td>{getMarketingNameById(item.marketing_id)}</td>
                            <td>{item.date}</td>
                            <td>{formatNumber(item.cargo_fee)}</td>
                            <td>{formatNumber(item.total_balance)}</td>
                            <td>{formatNumber(item.grand_total)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <Modal
                    onClose={handleCloseModal}
                    marketingData={marketingData}
                    addNewPenjualan={addNewPenjualan}
                />
            )}
        </div>
    );
}

const Modal = ({ onClose, marketingData, addNewPenjualan }) => {
    const [transactionNumber, setTransactionNumber] = useState('');
    const [marketingId, setMarketingId] = useState('');
    const [date, setDate] = useState('');
    const [cargoFee, setCargoFee] = useState('');
    const [totalBalance, setTotalBalance] = useState('');
    const [message, setMessage] = useState('');

    // Format angka dengan pemisah ribuan
    const formatNumber = (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Tangani perubahan input Cargo Fee
    const handleCargoFeeChange = (event) => {
        const rawValue = event.target.value.replace(/\./g, '');
        const formattedValue = formatNumber(rawValue);
        setCargoFee(formattedValue);
    };

    // Tangani perubahan input Total Balance
    const handleTotalBalanceChange = (event) => {
        const rawValue = event.target.value.replace(/\./g, '');
        const formattedValue = formatNumber(rawValue);
        setTotalBalance(formattedValue);
    };

    // Kirim data penjualan baru ke server dan tambahkan ke state
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/create-penjualan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transaction_number: transactionNumber,
                    marketing_id: marketingId,
                    date: date,
                    cargo_fee: cargoFee.replace(/\./g, ''),
                    total_balance: totalBalance.replace(/\./g, ''),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Penjualan processed successfully');
                addNewPenjualan(data); // Tambahkan data baru ke state
                alert('Penjualan processed successfully');
                onClose();
            } else {
                setMessage('Failed to process penjualan');
                alert('Failed to process penjualan');
            }
        } catch (error) {
            setMessage('Failed to process penjualan');
            alert('Failed to process penjualan');
            console.error('Error:', error);
        }
    };

    // Persiapkan opsi marketing untuk komponen Select
    const marketingOptions = marketingData.map(marketing => ({
        value: marketing.id,
        label: marketing.name
    }));

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h1>Penjualan</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Marketing ID:
                        <Select
                            options={marketingOptions}
                            value={marketingOptions.find(option => option.value === marketingId)}
                            onChange={(selectedOption) => setMarketingId(selectedOption ? selectedOption.value : '')}
                            placeholder="Select Marketing"
                            isClearable
                        />
                    </label>
                    <br />
                    <label>
                        Date:
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Cargo Fee:
                        <input
                            type="text"
                            value={cargoFee}
                            onChange={handleCargoFeeChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Total Balance:
                        <input
                            type="text"
                            value={totalBalance}
                            onChange={handleTotalBalanceChange}
                            required
                        />
                    </label>
                    <br />
                    <button type="submit">Submit</button>
                </form>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default DaftarPenjual;
