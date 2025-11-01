let financeChart;

function loadChart(transaksi) {
    const ctx = document.getElementById('financeChart').getContext('2d');
    
    // Data untuk chart
    const data = processChartData(transaksi);
    
    financeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Pemasukan',
                    data: data.pemasukan,
                    backgroundColor: '#10b981',
                    borderColor: '#10b981',
                    borderWidth: 1
                },
                {
                    label: 'Pengeluaran',
                    data: data.pengeluaran,
                    backgroundColor: '#ef4444',
                    borderColor: '#ef4444',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rp ' + value.toLocaleString('id-ID');
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += 'Rp ' + context.parsed.y.toLocaleString('id-ID');
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function updateChart(laporan, periode) {
    if (!financeChart) return;
    
    const data = processLaporanData(laporan, periode);
    
    financeChart.data.labels = data.labels;
    financeChart.data.datasets[0].data = data.pemasukan;
    financeChart.data.datasets[1].data = data.pengeluaran;
    financeChart.update();
}

function processChartData(transaksi) {
    // Group by bulan untuk chart default
    const monthlyData = {};
    
    transaksi.forEach(trans => {
        const date = new Date(trans.tanggal);
        const monthYear = date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { pemasukan: 0, pengeluaran: 0 };
        }
        
        if (trans.tipe === 'pemasukan') {
            monthlyData[monthYear].pemasukan += parseFloat(trans.jumlah);
        } else {
            monthlyData[monthYear].pengeluaran += parseFloat(trans.jumlah);
        }
    });
    
    const labels = Object.keys(monthlyData);
    const pemasukan = labels.map(label => monthlyData[label].pemasukan);
    const pengeluaran = labels.map(label => monthlyData[label].pengeluaran);
    
    return { labels, pemasukan, pengeluaran };
}

function processLaporanData(laporan, periode) {
    // Process data dari API laporan
    const labels = Object.keys(laporan);
    const pemasukan = labels.map(label => laporan[label].pemasukan || 0);
    const pengeluaran = labels.map(label => laporan[label].pengeluaran || 0);
    
    return { labels, pemasukan, pengeluaran };
}