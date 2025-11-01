<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $periode = $_GET['periode'] ?? 'bulan';
    generateLaporan($periode);
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}

function generateLaporan($periode) {
    global $conn;
    
    switch ($periode) {
        case 'minggu':
            $laporan = laporanMingguan();
            break;
        case 'bulan':
            $laporan = laporanBulanan();
            break;
        case 'tahun':
            $laporan = laporanTahunan();
            break;
        default:
            $laporan = laporanBulanan();
    }
    
    echo json_encode($laporan);
}

function laporanMingguan() {
    global $conn;
    
    $startDate = date('Y-m-d', strtotime('monday this week'));
    $endDate = date('Y-m-d', strtotime('sunday this week'));
    
    $result = $conn->query("
        SELECT 
            tanggal,
            tipe,
            SUM(jumlah) as total
        FROM transaksi 
        WHERE tanggal BETWEEN '$startDate' AND '$endDate'
        GROUP BY tanggal, tipe
        ORDER BY tanggal
    ");
    
    $laporan = [];
    while ($row = $result->fetch_assoc()) {
        $hari = date('l', strtotime($row['tanggal'])); // Nama hari dalam English
        $hariIndonesia = translateHari($hari);
        
        if (!isset($laporan[$hariIndonesia])) {
            $laporan[$hariIndonesia] = ['pemasukan' => 0, 'pengeluaran' => 0];
        }
        
        if ($row['tipe'] === 'pemasukan') {
            $laporan[$hariIndonesia]['pemasukan'] += (float)$row['total'];
        } else {
            $laporan[$hariIndonesia]['pengeluaran'] += (float)$row['total'];
        }
    }
    
    return $laporan;
}

function laporanBulanan() {
    global $conn;
    
    $currentMonth = date('Y-m');
    
    $result = $conn->query("
        SELECT 
            WEEK(tanggal, 1) as minggu,
            tipe,
            SUM(jumlah) as total
        FROM transaksi 
        WHERE DATE_FORMAT(tanggal, '%Y-%m') = '$currentMonth'
        GROUP BY minggu, tipe
        ORDER BY minggu
    ");
    
    $laporan = [];
    while ($row = $result->fetch_assoc()) {
        $minggu = "Minggu " . $row['minggu'];
        
        if (!isset($laporan[$minggu])) {
            $laporan[$minggu] = ['pemasukan' => 0, 'pengeluaran' => 0];
        }
        
        if ($row['tipe'] === 'pemasukan') {
            $laporan[$minggu]['pemasukan'] += (float)$row['total'];
        } else {
            $laporan[$minggu]['pengeluaran'] += (float)$row['total'];
        }
    }
    
    return $laporan;
}

function laporanTahunan() {
    global $conn;
    
    $currentYear = date('Y');
    
    $result = $conn->query("
        SELECT 
            MONTH(tanggal) as bulan,
            DATE_FORMAT(tanggal, '%M') as nama_bulan,
            tipe,
            SUM(jumlah) as total
        FROM transaksi 
        WHERE YEAR(tanggal) = '$currentYear'
        GROUP BY bulan, nama_bulan, tipe
        ORDER BY bulan
    ");
    
    $laporan = [];
    while ($row = $result->fetch_assoc()) {
        $bulan = translateBulan($row['nama_bulan']);
        
        if (!isset($laporan[$bulan])) {
            $laporan[$bulan] = ['pemasukan' => 0, 'pengeluaran' => 0];
        }
        
        if ($row['tipe'] === 'pemasukan') {
            $laporan[$bulan]['pemasukan'] += (float)$row['total'];
        } else {
            $laporan[$bulan]['pengeluaran'] += (float)$row['total'];
        }
    }
    
    return $laporan;
}

function translateHari($hariEnglish) {
    $translations = [
        'Monday' => 'Senin',
        'Tuesday' => 'Selasa',
        'Wednesday' => 'Rabu',
        'Thursday' => 'Kamis',
        'Friday' => 'Jumat',
        'Saturday' => 'Sabtu',
        'Sunday' => 'Minggu'
    ];
    
    return $translations[$hariEnglish] ?? $hariEnglish;
}

function translateBulan($bulanEnglish) {
    $translations = [
        'January' => 'Januari',
        'February' => 'Februari',
        'March' => 'Maret',
        'April' => 'April',
        'May' => 'Mei',
        'June' => 'Juni',
        'July' => 'Juli',
        'August' => 'Agustus',
        'September' => 'September',
        'October' => 'Oktober',
        'November' => 'November',
        'December' => 'Desember'
    ];
    
    return $translations[$bulanEnglish] ?? $bulanEnglish;
}
?>