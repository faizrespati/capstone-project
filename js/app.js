class CashFlowApp {
    constructor() {
        this.transaksi = [];
        this.kategori = [];
        this.init();
    }

    async init() {
        // Set tanggal hari ini di form
        document.getElementById('tanggal').valueAsDate = new Date();
        
        // Load data awal
        await this.loadKategori();
        await this.loadTransaksi();
        await this.loadRingkasan();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load chart awal
        loadChart(this.transaksi);
    }

    async loadKategori() {
        this.kategori = await Database.getKategori();
        this.populateKategoriSelect();
    }

    async loadTransaksi() {
        this.transaksi = await Database.getTransaksi();
        this.renderTransaksiTable();
    }

    async loadRingkasan() {
        const totalPemasukan = this.transaksi
            .filter(t => t.tipe === 'pemasukan')
            .reduce((sum, t) => sum + parseFloat(t.jumlah), 0);

        const totalPengeluaran = this.transaksi
            .filter(t => t.tipe === 'pengeluaran')
            .reduce((sum, t) => sum + parseFloat(t.jumlah), 0);

        const saldo = totalPemasukan - totalPengeluaran;

        document.getElementById('total-income').textContent = this.formatRupiah(totalPemasukan);
        document.getElementById('total-expense').textContent = this.formatRupiah(totalPengeluaran);
        document.getElementById('total-balance').textContent = this.formatRupiah(saldo);
    }

    populateKategoriSelect() {
        const select = document.getElementById('kategori_id');
        select.innerHTML = '<option value="">Pilih Kategori</option>';
        
        this.kategori.forEach(kat => {
            const option = document.createElement('option');
            option.value = kat.id;
            option.textContent = kat.nama_kategori;
            option.dataset.tipe = kat.tipe;
            select.appendChild(option);
        });
    }

    setupEventListeners() {
        // Form tambah transaksi
        document.getElementById('add-transaction-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.tambahTransaksi();
        });

        // Filter kategori berdasarkan tipe transaksi
        document.getElementById('tipe').addEventListener('change', (e) => {
            this.filterKategoriByTipe(e.target.value);
        });

        // Modal edit
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('editModal').style.display = 'none';
        });

        // Klik outside modal to close
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('editModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    filterKategoriByTipe(tipe) {
        const select = document.getElementById('kategori_id');
        const options = select.querySelectorAll('option');
        
        options.forEach(option => {
            if (option.value === "") {
                option.style.display = 'block';
                return;
            }
            
            if (tipe === "" || option.dataset.tipe === tipe) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
        
        // Reset pilihan kategori jika tidak sesuai
        if (select.options[select.selectedIndex]?.style.display === 'none') {
            select.value = "";
        }
    }

    async tambahTransaksi() {
        const form = document.getElementById('add-transaction-form');
        const formData = new FormData(form);
        
        const transaksi = {
            kategori_id: parseInt(formData.get('kategori_id')),
            tanggal: formData.get('tanggal'),
            jumlah: parseFloat(formData.get('jumlah')),
            keterangan: formData.get('keterangan'),
            tipe: formData.get('tipe')
        };

        const result = await Database.addTransaksi(transaksi);
        
        if (result.success) {
            alert('Transaksi berhasil ditambahkan!');
            form.reset();
            document.getElementById('tanggal').valueAsDate = new Date();
            await this.loadTransaksi();
            await this.loadRingkasan();
            loadChart(this.transaksi);
        } else {
            alert('Error: ' + result.error);
        }
    }

    async editTransaksi(id) {
        const transaksi = this.transaksi.find(t => t.id == id);
        if (!transaksi) return;

        // Isi form edit
        document.getElementById('edit-id').value = transaksi.id;
        document.getElementById('edit-kategori_id').value = transaksi.kategori_id;
        document.getElementById('edit-tanggal').value = transaksi.tanggal;
        document.getElementById('edit-jumlah').value = transaksi.jumlah;
        document.getElementById('edit-keterangan').value = transaksi.keterangan || '';
        document.getElementById('edit-tipe').value = transaksi.tipe;

        // Tampilkan modal
        document.getElementById('editModal').style.display = 'block';
    }

    async updateTransaksi() {
        const form = document.getElementById('edit-transaction-form');
        const formData = new FormData(form);
        
        const transaksi = {
            id: parseInt(formData.get('id')),
            kategori_id: parseInt(formData.get('kategori_id')),
            tanggal: formData.get('tanggal'),
            jumlah: parseFloat(formData.get('jumlah')),
            keterangan: formData.get('keterangan'),
            tipe: formData.get('tipe')
        };

        const result = await Database.editTransaksi(transaksi);
        
        if (result.success) {
            alert('Transaksi berhasil diupdate!');
            document.getElementById('editModal').style.display = 'none';
            await this.loadTransaksi();
            await this.loadRingkasan();
            loadChart(this.transaksi);
        } else {
            alert('Error: ' + result.error);
        }
    }

    async hapusTransaksi(id) {
        if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            const result = await Database.deleteTransaksi(id);
            
            if (result.success) {
                alert('Transaksi berhasil dihapus!');
                await this.loadTransaksi();
                await this.loadRingkasan();
                loadChart(this.transaksi);
            } else {
                alert('Error: ' + result.error);
            }
        }
    }

    renderTransaksiTable() {
        const tbody = document.getElementById('transaction-body');
        tbody.innerHTML = '';

        if (this.transaksi.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Tidak ada transaksi</td></tr>';
            return;
        }

        this.transaksi.forEach(trans => {
            const row = document.createElement('tr');
            
            // Format tanggal
            const tanggal = new Date(trans.tanggal).toLocaleDateString('id-ID');
            
            // Format jumlah dengan warna
            const jumlah = this.formatRupiah(trans.jumlah);
            const jumlahClass = trans.tipe === 'pemasukan' ? 'income-amount' : 'expense-amount';
            
            row.innerHTML = `
                <td>${tanggal}</td>
                <td>${trans.nama_kategori || 'Tidak ada kategori'}</td>
                <td>${trans.keterangan || '-'}</td>
                <td class="${jumlahClass}">${trans.tipe === 'pemasukan' ? '+' : '-'} ${jumlah}</td>
                <td>
                    <button class="btn-edit" onclick="app.editTransaksi(${trans.id})">Edit</button>
                    <button class="btn-delete" onclick="app.hapusTransaksi(${trans.id})">Hapus</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    formatRupiah(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }
}

// Global function untuk laporan
async function loadLaporan(periode) {
    const laporan = await Database.getLaporan(periode);
    updateChart(laporan, periode);
}

// Inisialisasi app ketika DOM ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CashFlowApp();
});