<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

definePageMeta({
  layout: 'default'
})

// State
const showAlert = ref(true)
const filterForm = ref({
  satker: '',
  unit: '',
  tanggalAwal: '2025-12-31',
  tanggalAkhir: '2026-02-28'
})

// Mock Data (Diambil dari struktur HTML asli)
const tableData = ref([
  {
    unitName: 'Poksi Keuangan',
    items: [
      { id: 53, kode: '000111', uraian: 'Buku Pedoman Pengelolaan Keuangan', hargaSatuan: 0, saldoAwal: { qty: 0, rupiah: 0 }, mutasi: { tambah: 0, kurang: 0, jumlah: 0 }, saldoAkhir: { qty: 0, rupiah: 0 } },
      { id: 463, kode: '1010401001.000047', uraian: 'Curcuma DHA', hargaSatuan: 13100, saldoAwal: { qty: 40, rupiah: 524000 }, mutasi: { tambah: 0, kurang: 0, jumlah: 0 }, saldoAkhir: { qty: 40, rupiah: 524000 } },
      { id: 464, kode: '1010401001.000055', uraian: 'Enkasari', hargaSatuan: 22300, saldoAwal: { qty: 60, rupiah: 1338000 }, mutasi: { tambah: 0, kurang: 0, jumlah: 0 }, saldoAkhir: { qty: 60, rupiah: 1338000 } },
    ]
  },
  {
    unitName: 'Bagian Perencanaan, Evaluasi Kinerja dan Reformasi Birokrasi Internal',
    items: [
      { id: 906, kode: '1010501008.000201', uraian: 'Annual Report', hargaSatuan: 354775, saldoAwal: { qty: 10, rupiah: 3547750 }, mutasi: { tambah: 0, kurang: 0, jumlah: 0 }, saldoAkhir: { qty: 10, rupiah: 3547750 } }
    ]
  },
  {
    unitName: 'Poksi Humas dan Protokol',
    items: [
      { id: 57, kode: '1010501008000202', uraian: 'Buku Saku LHKPN', hargaSatuan: 27500, saldoAwal: { qty: 50, rupiah: 1375000 }, mutasi: { tambah: 0, kurang: 0, jumlah: 0 }, saldoAkhir: { qty: 50, rupiah: 1375000 } },
      { id: 59, kode: '1010501008000045', uraian: 'Goodie Bag (Humas)', hargaSatuan: 20000000, saldoAwal: { qty: 1047, rupiah: 20940000000 }, mutasi: { tambah: 0, kurang: 0, jumlah: 0 }, saldoAkhir: { qty: 1047, rupiah: 20940000000 } }
    ]
  }
])

// Methods
const filterData = () => {
  console.log('Filtering with:', filterForm.value)
  // Implement logic to fetch data based on filters
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

import jsPDF from 'jspdf'
import 'jspdf-autotable'

function cetakPdf() {
  const doc = new jsPDF({ orientation: 'landscape' })
  doc.setFontSize(16)
  doc.text('Rekap Saldo Barang Persediaan', 14, 14)

  // Table header
  const head = [[
    'Kode', 'Uraian', 'Harga Satuan', 'Saldo Awal Jumlah', 'Saldo Awal Rupiah',
    'Mutasi Tambah', 'Mutasi Kurang', 'Mutasi Jumlah', 'Saldo Akhir Jumlah', 'Saldo Akhir Rupiah'
  ]]

  // Table body
  const body = []
  tableData.value.forEach(group => {
    // Group header row
    body.push([
      { content: group.unitName, colSpan: 10, styles: { halign: 'left', fillColor: [220, 235, 255], textColor: [30, 64, 175], fontStyle: 'bold' } }
    ])
    group.items.forEach(item => {
      body.push([
        item.kode,
        item.uraian,
        formatCurrency(item.hargaSatuan),
        item.saldoAwal.qty,
        formatCurrency(item.saldoAwal.rupiah),
        item.mutasi.tambah,
        item.mutasi.kurang,
        item.mutasi.jumlah,
        item.saldoAkhir.qty,
        formatCurrency(item.saldoAkhir.rupiah)
      ])
    })
  })

  doc.autoTable({
    head,
    body,
    startY: 22,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 249, 255] }
  })

  doc.save('rekap-saldo-barang.pdf')
}

</script>

<template>
  <div class="pt-14">
    <!-- Alert -->
    <div v-if="showAlert" class="alert shadow-lg mb-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white">
      <div>
        <Icon icon="tabler:alert-circle" class="w-6 h-6 text-blue-600" />
        <span>
          Terdapat 41 Sub Output yang belum ditentukan unitnya. Silahkan
          <NuxtLink to="/admin/suboutput" class="link link-hover underline">klik di sini</NuxtLink>
          untuk memperbaiki.
        </span>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700">
        <Icon icon="tabler:home" class="w-4 h-4 inline text-blue-600" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <span>Persediaan</span>
      <span>/</span>
      <span class="font-bold text-blue-700">Saldo Barang</span>
    </div>

    <h1 class="text-3xl font-bold text-blue-700 mb-6">Saldo Barang Persediaan</h1>

    <!-- Filter Card -->
    <div class="card bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <div class="card-body">
        <div class="text-sm mb-4 text-blue-700 font-semibold flex items-center gap-2">
          <Icon icon="tabler:filter" class="w-5 h-5" />
          Filter Pencarian
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Satker -->
          <div>
            <label class="label text-xs font-bold text-blue-800">Satker</label>
            <select v-model="filterForm.satker" class="select select-bordered select-xs w-full bg-blue-50/30">
              <option value="">Seluruh Satker</option>
              <option value="1">LAN JAKARTA</option>
              <option value="2">PUSJAR SKTASN NAS</option>
            </select>
          </div>
          <!-- Unit -->
          <div>
            <label class="label text-xs font-bold text-blue-800">Unit</label>
            <select v-model="filterForm.unit" class="select select-bordered select-xs w-full bg-blue-50/30">
              <option value="">Seluruh Unit</option>
              <option value="1">Poksi Keuangan</option>
              <option value="3">Poksi SDM</option>
            </select>
          </div>
          <!-- Tanggal Awal -->
          <div>
            <label class="label text-xs font-bold text-blue-800">Tanggal Awal</label>
            <input v-model="filterForm.tanggalAwal" type="date" class="input input-bordered input-xs w-full bg-blue-50/30" />
          </div>
          <!-- Tanggal Akhir -->
          <div>
            <label class="label text-xs font-bold text-blue-800">Tanggal Akhir</label>
            <input v-model="filterForm.tanggalAkhir" type="date" class="input input-bordered input-xs w-full bg-blue-50/30" />
          </div>
        </div>
        <div class="card-actions justify-end mt-4">
          <button @click="filterData" type="button" class="btn btn-success btn-sm px-6">
            <Icon icon="tabler:search" class="w-4 h-4 mr-1" />
            Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap gap-3 mb-4">
      <NuxtLink to="/admin/persediaan/create" class="btn btn-success btn-sm shadow-md">
        <Icon icon="tabler:plus" class="w-4 h-4 mr-1" />
        Tambah Barang Persediaan
      </NuxtLink>
      <button @click="cetakPdf" type="button" class="btn btn-info btn-sm shadow-md text-white">
        <Icon icon="tabler:printer" class="w-4 h-4 mr-1" />
        Cetak Rekap Saldo
      </button>
    </div>

    <!-- Data Table -->
    <div class="card bg-white shadow-xl rounded-xl border border-blue-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table table-md w-full">
          <thead>
            <!-- Header Row 1 -->
            <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
              <th rowspan="2" class="text-center align-middle rounded-tl-xl">Kode</th>
              <th rowspan="2" class="text-center align-middle">Uraian</th>
              <th rowspan="2" class="text-center align-middle">Harga Satuan</th>
              <th colspan="2" class="text-center align-middle">31 Des 2025</th>
              <th colspan="3" class="text-center align-middle">Mutasi</th>
              <th colspan="2" class="text-center align-middle rounded-tr-xl">28 Feb 2026</th>
            </tr>
            <!-- Header Row 2 -->
            <tr class="bg-blue-50 text-blue-800 font-semibold">
              <th class="text-center">Jumlah</th>
              <th class="text-right">Rupiah</th>
              <th class="text-center">Tambah</th>
              <th class="text-center">Kurang</th>
              <th class="text-center">Jumlah</th>
              <th class="text-center">Jumlah</th>
              <th class="text-right">Rupiah</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(group, gIndex) in tableData" :key="gIndex">
              <!-- Group Header (Unit Name) -->
              <tr class="bg-blue-50/50">
                <td colspan="10" class="font-bold text-blue-800 py-3 pl-4 border-b-2 border-blue-200">
                  <Icon icon="tabler:folder" class="w-5 h-5 inline mr-2 text-blue-600" />
                  {{ group.unitName }}
                </td>
              </tr>
              <!-- Items -->
              <tr v-for="(item, index) in group.items" :key="item.id" class="hover:bg-blue-50 transition-all duration-150 border-b border-gray-100">
                <td class="text-center font-mono text-sm text-blue-600">{{ item.kode }}</td>
                <td>
                  <NuxtLink :to="`/persediaanBarang/view?id=${item.id}`" class="text-blue-700 font-semibold hover:underline">
                    {{ item.uraian }}
                  </NuxtLink>
                </td>
                <td class="text-right text-gray-600 text-sm">{{ formatCurrency(item.hargaSatuan) }}</td>
                
                <!-- Saldo Awal -->
                <td class="text-center font-semibold text-blue-700">{{ item.saldoAwal.qty }}</td>
                <td class="text-right font-semibold text-blue-700">{{ formatCurrency(item.saldoAwal.rupiah) }}</td>
                
                <!-- Mutasi -->
                <td class="text-center text-gray-500">{{ item.mutasi.tambah }}</td>
                <td class="text-center text-gray-500">{{ item.mutasi.kurang }}</td>
                <td class="text-center font-bold text-gray-700">{{ item.mutasi.jumlah }}</td>
                
                <!-- Saldo Akhir -->
                <td class="text-center font-bold text-green-700">{{ item.saldoAkhir.qty }}</td>
                <td class="text-right font-bold text-green-700">{{ formatCurrency(item.saldoAkhir.rupiah) }}</td>
              </tr>
            </template>
            
            <!-- Empty State -->
            <tr v-if="tableData.length === 0">
              <td colspan="10" class="text-center py-10 text-gray-400">
                <Icon icon="tabler:inbox" class="w-12 h-12 mx-auto mb-2" />
                Tidak ada data ditemukan
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Menggunakan style scoped dari contoh Anda untuk konsistensi */
.table th {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e0e7ff;
  padding: 12px 8px;
}
.table td {
  font-size: 0.9rem;
  border-bottom: 1px solid #e5e7eb;
  padding: 10px 8px;
}
.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  border: none;
}
.btn-success:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}
.btn-info {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  border: none;
}
.btn-info:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
}
/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>