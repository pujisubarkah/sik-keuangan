<template>
  <div class="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden mt-8">
    <div class="px-8 pt-8 pb-4 border-b border-blue-100 bg-gradient-to-r from-blue-100 to-blue-50 flex items-center gap-2">
      <i class="fa fa-bar-list text-blue-600 text-xl"></i>
      <h3 class="text-xl font-bold text-blue-800 mb-1">Jadwal Rencana Pengeluaran</h3>
    </div>
    <div class="px-4 py-6 overflow-x-auto">
      <table class="table-auto w-full text-sm border">
        <thead class="bg-white">
          <tr>
            <th>Kode</th>
            <th>Uraian</th>
            <th class="text-center">Jumlah</th>
            <th v-for="bulan in bulanList" :key="bulan" class="text-center">{{ bulan }}</th>
            <th>Total</th>
            <th>Selisih</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in rows" :key="row.kode">
            <td class="px-2 py-1">{{ row.kode }}</td>
            <td class="px-2 py-1">
              <div class="inline-flex items-center gap-2">
                <div class="relative">
                  <button class="btn btn-xs btn-primary rounded shadow" @click="openDropdown(idx)">
                    <span class="fa fa-bars"></span>
                  </button>
                  <div v-if="dropdownOpen === idx" class="absolute z-10 bg-white border rounded shadow mt-1 left-0 w-40">
                    <ul>
                      <li><a href="#" class="block px-3 py-2 hover:bg-blue-50"><i class="fa fa-calendar"></i> Jadwal</a></li>
                      <li><a href="#" class="block px-3 py-2 hover:bg-blue-50"><i class="glyphicon glyphicon-pencil"></i> Revisi</a></li>
                      <li><a href="#" class="block px-3 py-2 hover:bg-blue-50"><i class="glyphicon glyphicon-plus"></i> Sub Anggaran</a></li>
                      <li><a href="#" class="block px-3 py-2 hover:bg-blue-50"><i class="glyphicon glyphicon-shopping-cart"></i> Ajukan Pencairan</a></li>
                      <li><a href="#" class="block px-3 py-2 hover:bg-blue-50" @click.prevent="confirmDelete(row)"><i class="glyphicon glyphicon-trash"></i> Hapus</a></li>
                      <li><a href="#" class="block px-3 py-2 hover:bg-blue-50"><i class="fa fa-refresh"></i> Debug (Developer)</a></li>
                    </ul>
                  </div>
                </div>
                <span>{{ row.uraian }}</span>
              </div>
            </td>
            <td class="text-right px-2 py-1">{{ formatCurrency(row.jumlah) }}</td>
            <td v-for="(cell, i) in row.bulanan" :key="i" class="text-right px-2 py-1">
              <a href="#" class="text-blue-500 underline" @click.prevent="editCell(row, i)">
                {{ cell === null ? 'Kosong' : formatCurrency(cell) }}
              </a>
            </td>
            <td class="text-right px-2 py-1 font-bold">{{ formatCurrency(row.total) }}</td>
            <td class="text-right px-2 py-1 font-bold">{{ formatCurrency(row.selisih) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const bulanList = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
]

const rows = ref([
  {
    kode: '001',
    uraian: 'Konsumsi Peserta dan Pengajar (6 hari x 44 orang) ...',
    jumlah: 253440000,
    bulanan: Array(12).fill(null), // null = Kosong
    total: 0,
    selisih: 253440000
  }
  // Tambahkan data lain sesuai kebutuhan
])

const dropdownOpen = ref(null)
function openDropdown(idx) {
  dropdownOpen.value = dropdownOpen.value === idx ? null : idx
}
function confirmDelete(row) {
  if (confirm('Yakin akan menghapus anggaran?')) {
    // Hapus data di sini
  }
}
function editCell(row, bulanIdx) {
  // Logic untuk edit cell, misal tampilkan modal input
  alert(`Edit jadwal bulan ${bulanList[bulanIdx]} untuk ${row.uraian}`)
}
function formatCurrency(val) {
  if (!val && val !== 0) return '0'
  return new Intl.NumberFormat('id-ID').format(val)
}
</script>