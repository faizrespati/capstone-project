<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getTransaksi();
        break;
    case 'POST':
        addTransaksi();
        break;
    case 'PUT':
        editTransaksi();
        break;
    case 'DELETE':
        deleteTransaksi();
        break;
    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
}

function getTransaksi() {
    global $conn;
    
    $result = $conn->query("
        SELECT t.*, k.nama_kategori 
        FROM transaksi t 
        LEFT JOIN kategori k ON t.kategori_id = k.id 
        ORDER BY t.tanggal DESC
    ");
    
    $transaksi = [];
    while ($row = $result->fetch_assoc()) {
        $transaksi[] = $row;
    }
    
    echo json_encode($transaksi);
}

function addTransaksi() {
    global $conn;
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    $kategori_id = $data['kategori_id'];
    $tanggal = $data['tanggal'];
    $jumlah = $data['jumlah'];
    $keterangan = $data['keterangan'];
    $tipe = $data['tipe'];
    
    $stmt = $conn->prepare("INSERT INTO transaksi (kategori_id, tanggal, jumlah, keterangan, tipe) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issds", $kategori_id, $tanggal, $jumlah, $keterangan, $tipe);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["error" => $stmt->error]);
    }
}

function editTransaksi() {
    global $conn;
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    $id = $data['id'];
    $kategori_id = $data['kategori_id'];
    $tanggal = $data['tanggal'];
    $jumlah = $data['jumlah'];
    $keterangan = $data['keterangan'];
    $tipe = $data['tipe'];
    
    $stmt = $conn->prepare("UPDATE transaksi SET kategori_id=?, tanggal=?, jumlah=?, keterangan=?, tipe=? WHERE id=?");
    $stmt->bind_param("issdsi", $kategori_id, $tanggal, $jumlah, $keterangan, $tipe, $id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => $stmt->error]);
    }
}

function deleteTransaksi() {
    global $conn;
    
    $id = $_GET['id'];
    
    $stmt = $conn->prepare("DELETE FROM transaksi WHERE id=?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => $stmt->error]);
    }
}
?>