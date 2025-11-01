<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    getKategori();
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}

function getKategori() {
    global $conn;
    
    $result = $conn->query("SELECT * FROM kategori ORDER BY tipe, nama_kategori");
    
    $kategori = [];
    while ($row = $result->fetch_assoc()) {
        $kategori[] = $row;
    }
    
    echo json_encode($kategori);
}
?>