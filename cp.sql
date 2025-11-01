-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 21 Okt 2025 pada 16.41
-- Versi server: 10.4.25-MariaDB
-- Versi PHP: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cp`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori`
--

CREATE TABLE `kategori` (
  `id` int(11) NOT NULL,
  `nama_kategori` varchar(100) NOT NULL,
  `tipe` enum('pemasukan','pengeluaran') NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `kategori`
--

INSERT INTO `kategori` (`id`, `nama_kategori`, `tipe`, `deskripsi`, `created_at`) VALUES
(1, 'Gaji Bulanan', 'pemasukan', 'Pendapatan utama setiap bulan', '2025-10-17 10:57:41'),
(2, 'Bonus / Freelance', 'pemasukan', 'Pendapatan tambahan', '2025-10-17 10:57:41'),
(3, 'Makan & Minum', 'pengeluaran', 'Biaya makan harian', '2025-10-17 10:57:41'),
(4, 'Transportasi', 'pengeluaran', 'Biaya perjalanan', '2025-10-17 10:57:41'),
(5, 'Belanja Rumah', 'pengeluaran', 'Belanja kebutuhan rumah tangga', '2025-10-17 10:57:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int(11) NOT NULL,
  `kategori_id` int(11) DEFAULT NULL,
  `tanggal` date NOT NULL,
  `jumlah` decimal(15,2) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `tipe` enum('pemasukan','pengeluaran') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `transaksi`
--

INSERT INTO `transaksi` (`id`, `kategori_id`, `tanggal`, `jumlah`, `keterangan`, `tipe`, `created_at`) VALUES
(1, 1, '2025-10-01', '5000000.00', 'Gaji Oktober', 'pemasukan', '2025-10-17 10:57:41'),
(2, 3, '2025-10-02', '45000.00', 'Sarapan dan kopi', 'pengeluaran', '2025-10-17 10:57:41'),
(3, 4, '2025-10-03', '30000.00', 'Bensin motor', 'pengeluaran', '2025-10-17 10:57:41'),
(4, 5, '2025-10-04', '150000.00', 'Belanja sabun dan makanan', 'pengeluaran', '2025-10-17 10:57:41'),
(5, 2, '2025-10-10', '500000.00', 'Freelance desain logo', 'pemasukan', '2025-10-17 10:57:41'),
(6, 3, '2025-10-11', '25000.00', 'Makan siang', 'pengeluaran', '2025-10-17 10:57:41'),
(7, 4, '2025-10-15', '35000.00', 'Parkir dan bensin', 'pengeluaran', '2025-10-17 10:57:41'),
(8, 5, '2025-10-20', '90000.00', 'Belanja sayur dan buah', 'pengeluaran', '2025-10-17 10:57:41');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kategori_id` (`kategori_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`kategori_id`) REFERENCES `kategori` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
