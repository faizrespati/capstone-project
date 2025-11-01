const API_BASE = 'http://localhost/capstone-project/api';

class Database {
    // Get semua transaksi
    static async getTransaksi() {
        try {
            const response = await fetch(`${API_BASE}/transaksi.php`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching transaksi:', error);
            return [];
        }
    }

    // Get kategori
    static async getKategori() {
        try {
            const response = await fetch(`${API_BASE}/kategori.php`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching kategori:', error);
            return [];
        }
    }

    // Tambah transaksi
    static async addTransaksi(transaksi) {
        try {
            const response = await fetch(`${API_BASE}/transaksi.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaksi)
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding transaksi:', error);
            return { error: error.message };
        }
    }

    // Edit transaksi
    static async editTransaksi(transaksi) {
        try {
            const response = await fetch(`${API_BASE}/transaksi.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaksi)
            });
            return await response.json();
        } catch (error) {
            console.error('Error editing transaksi:', error);
            return { error: error.message };
        }
    }

    // Hapus transaksi
    static async deleteTransaksi(id) {
        try {
            const response = await fetch(`${API_BASE}/transaksi.php?id=${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting transaksi:', error);
            return { error: error.message };
        }
    }

    // Get laporan
    static async getLaporan(periode) {
        try {
            const response = await fetch(`${API_BASE}/laporan.php?periode=${periode}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching laporan:', error);
            return {};
        }
    }
}