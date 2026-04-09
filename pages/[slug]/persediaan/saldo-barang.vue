<script setup>

import { ref } from 'vue'
import { IconAlertCircle, IconHome, IconFilter, IconBuilding, IconChevronDown, IconSitemap, IconUsersGroup, IconCalendar, IconCalendarTime, IconSearch, IconPlus, IconPrinter, IconFolder, IconInbox } from '@tabler/icons-vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

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
    <SuboutputAlert :showAlert="showAlert" />

    <!-- Breadcrumb -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink :to="`/${$route.params.slug}`" class="hover:text-blue-700">
        Beranda
      </NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Saldo Barang</span>
    </div>

    <h1 class="text-3xl font-bold text-blue-700 mb-6">Saldo Barang Persediaan</h1>

    <!-- Filter Card (Refactored to match DashboardFilter.vue) -->
    <div class="filter-card bg-gradient-to-br from-white to-blue-50/30 shadow-xl mb-6 rounded-2xl border border-blue-200/60 backdrop-blur-sm overflow-hidden">
      <div class="h-1 bg-[#D69009]" />
      <div class="p-5 md:p-6">
        <div class="flex items-center justify-between mb-5 pb-4 border-b border-blue-100">
          <h2 class="text-lg font-bold text-blue-800 flex items-center gap-2.5">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Icon icon="tabler:filter" class="w-5 h-5 text-blue-600" />
            </div>
            <span>Filter Data</span>
          </h2>
          <!-- Reset Button (to be implemented) -->
        </div>
        <form @submit.prevent="filterData" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <!-- Satker Select (dynamic options to be implemented) -->
            <div class="md:col-span-4">
              <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Icon icon="tabler:building" class="w-4 h-4 text-blue-500" />
                <span>Satker</span>
              </label>
              <div class="relative">
                <select v-model="filterForm.satker" class="select select-bordered w-full pr-4 py-2.5 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all rounded-xl hover:border-blue-400 appearance-none cursor-pointer">
                  <option value="" class="text-center">Pilih Satker...</option>
                  <!-- <option v-for="satker in satkers" :key="satker.id" :value="satker.id" class="text-center">{{ satker.name }}</option> -->
                  <option value="1" class="text-center">LAN JAKARTA</option>
                  <option value="2" class="text-center">PUSJAR SKTASN NAS</option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon icon="tabler:chevron-down" class="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
            <!-- Unit Select (dynamic options to be implemented) -->
            <div class="md:col-span-4">
              <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Icon icon="tabler:sitemap" class="w-4 h-4 text-blue-500" />
                <span>Unit</span>
              </label>
              <div class="relative">
                <select v-model="filterForm.unit" class="select select-bordered w-full pr-4 py-2.5 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all rounded-xl hover:border-blue-400 appearance-none cursor-pointer">
                  <option value="" class="text-center">Pilih Unit...</option>
                  <!-- <option v-for="unit in units" :key="unit.id" :value="unit.id" class="text-center">{{ unit.name }}</option> -->
                  <option value="1" class="text-center">Poksi Keuangan</option>
                  <option value="3" class="text-center">Poksi SDM</option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon icon="tabler:chevron-down" class="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
            <!-- Tahun Filter (year input) -->
            <div class="md:col-span-2">
              <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Icon icon="tabler:calendar" class="w-4 h-4 text-blue-500" />
                <span>Tahun</span>
              </label>
              <div class="relative">
                <input v-model="filterForm.tahun" type="number" min="2000" max="2100" placeholder="2026" class="input input-bordered w-full pr-4 py-2.5 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all rounded-xl hover:border-blue-400 text-center font-mono" />
              </div>
            </div>
            <!-- Filter Button -->
            <div class="md:col-span-2 flex items-end">
              <button 
                type="submit"
                class="w-full bg-brandBlue-600 hover:bg-brandBlue-700 active:bg-brandBlue-800 border border-brandBlue-700 hover:border-brandBlue-800 active:border-brandBlue-800 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-brandBlue-300"
                style="min-height:44px"
              >
                <Icon icon="tabler:search" class="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Tampilkan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap gap-3 mb-4">
      <NuxtLink to="/admin/persediaan/create" class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-800 hover:shadow-lg">
        <Icon icon="tabler:plus" class="w-4 h-4" />
        <span>Tambah Barang Persediaan</span>
      </NuxtLink>
      <button @click="cetakPdf" type="button" class="inline-flex items-center gap-2 rounded-md border border-brandBlue-500 bg-brandBlue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-brandBlue-600 hover:shadow-lg">
        <Icon icon="tabler:printer" class="w-4 h-4" />
        <span>Cetak Rekap Saldo</span>
      </button>
    </div>

    <!-- Data Table -->
    <div class="card bg-white shadow-xl rounded-xl border border-blue-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table table-md w-full">
          <thead>
            <!-- Header Row 1 -->
            <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
              <th rowspan="2" class="px-3 py-2 text-center font-semibold text-blue-700 align-middle rounded-tl-xl border-t border-l border-b border-gray-300 bg-blue-100">Kode</th>
              <th rowspan="2" class="px-3 py-2 font-semibold text-blue-700 align-middle border-t border-b bg-blue-100" style="border-right: none !important;">Uraian</th>
              <th rowspan="2" class="px-3 py-2 font-semibold text-blue-700 text-center align-middle border-t border-b border-r border-gray-300 bg-blue-100" style="border-left: none !important;">Harga Satuan</th>
              <th colspan="2" class="px-3 py-2 text-center font-semibold text-blue-700 align-middle border border-gray-300 bg-blue-100">31 Des 2025</th>
              <th colspan="3" class="px-3 py-2 text-center font-semibold text-blue-700 align-middle border border-gray-300 bg-blue-100">Mutasi</th>
              <th colspan="2" class="px-3 py-2 text-center font-semibold text-blue-700 align-middle rounded-tr-xl border border-gray-300 bg-blue-100">28 Feb 2026</th>
            </tr>
            <!-- Header Row 2 -->
            <tr class="bg-blue-100 text-blue-700 font-semibold">
              <th class="px-3 py-2 text-center border border-gray-300">Jumlah</th>
              <th class="px-3 py-2 text-center border border-gray-300">Rupiah</th>
              <th class="px-3 py-2 text-center border border-gray-300">Tambah</th>
              <th class="px-3 py-2 text-center border border-gray-300">Kurang</th>
              <th class="px-3 py-2 text-center border border-gray-300">Jumlah</th>
              <th class="px-3 py-2 text-center border border-gray-300">Jumlah</th>
              <th class="px-3 py-2 text-center border border-gray-300">Rupiah</th>
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
                <td class="text-center text-sm text-blue-600 font-[Inter]">{{ item.kode }}</td>
                <td>
                  <NuxtLink :to="`/persediaanBarang/view?id=${item.id}`" class="text-blue-700 font-semibold hover:underline">
                    {{ item.uraian }}
                  </NuxtLink>
                </td>
                <td class="text-right text-gray-600 text-sm font-[Inter]">{{ formatCurrency(item.hargaSatuan) }}</td>
                
                <!-- Saldo Awal -->
                <td class="text-center font-semibold text-blue-700">{{ item.saldoAwal.qty }}</td>
                <td class="text-right font-semibold text-blue-700 font-[Inter]">{{ formatCurrency(item.saldoAwal.rupiah) }}</td>
                
                <!-- Mutasi -->
                <td class="text-center text-gray-500">{{ item.mutasi.tambah }}</td>
                <td class="text-center text-gray-500 font-[Inter]">{{ item.mutasi.kurang }}</td>
                <td class="text-center font-bold text-gray-700 font-[Inter]">{{ item.mutasi.jumlah }}</td>
                
                <!-- Saldo Akhir -->
                <td class="text-center font-bold text-green-700">{{ item.saldoAkhir.qty }}</td>
                <td class="text-right font-bold text-green-700 font-[Inter]">{{ formatCurrency(item.saldoAkhir.rupiah) }}</td>
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