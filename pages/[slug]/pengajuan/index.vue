<template>
  <div class="pt-14 px-2 sm:px-4">
    <SuboutputAlert :showAlert="showAlert" />
    <h1 class="text-3xl font-bold text-blue-700 mb-6">Daftar Pengajuan Tahun 2026</h1>
    <!-- Filter Form (styled like perencanaan) -->
    <div class="mb-6 overflow-hidden border border-gray-200 bg-white shadow sm:rounded-lg">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 bg-brandBlue-100 px-4 sm:px-6 py-3 sm:py-4 gap-2">
        <h3 class="flex items-center gap-2 text-sm font-medium text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter Data
        </h3>
      </div>
      <div class="px-4 sm:px-6 py-4">
        <form @submit.prevent="filterData" class="space-y-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-12">
            <!-- Status Data Dukung -->
            <div class="md:col-span-4">
              <label class="mb-1 block text-sm font-medium text-gray-700">Status Data Dukung</label>
              <div class="relative">
                <select v-model="filterForm.status_berkas"
                  class="block w-full rounded-md border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm appearance-none">
                  <option value="">Semua Status</option>
                  <option value="1">Tersedia</option>
                  <option value="0">Belum Tersedia</option>
                </select>
                <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center pr-2">
                  <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.584l3.71-3.354a.75.75 0 111.02 1.1l-4.25 3.846a.75.75 0 01-1.02 0l-4.25-3.846a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
            <!-- Pengajuan (Label + Range) -->
            <div class="md:col-span-4">
              <label class="mb-1 block text-sm font-medium text-gray-700">Pengajuan</label>
              <div class="flex items-end gap-2">
                <input v-model="filterForm.tanggal_pengajuan_awal" type="date" placeholder="mm/dd/yyyy" class="block w-full rounded-md border border-gray-300 bg-white py-2.5 px-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                <span class="pb-2 text-gray-500">s/d</span>
                <input v-model="filterForm.tanggal_pengajuan_akhir" type="date" placeholder="mm/dd/yyyy" class="block w-full rounded-md border border-gray-300 bg-white py-2.5 px-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
              </div>
            </div>
            <!-- Status Data -->
            <div class="md:col-span-4">
              <label class="mb-1 block text-sm font-medium text-gray-700">Status Data</label>
              <div class="relative">
                <select v-model="filterForm.status_verifikator"
                  class="block w-full rounded-md border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm appearance-none">
                  <option value="">Semua Data</option>
                  <option value="0">Hanya Pengajuan Baru</option>
                </select>
                <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center pr-2">
                  <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.584l3.71-3.354a.75.75 0 111.02 1.1l-4.25 3.846a.75.75 0 01-1.02 0l-4.25-3.846a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
            <!-- Tombol -->
            <div class="md:col-span-12 flex flex-col sm:flex-row justify-end items-center gap-2 mt-2 w-full">
              <div class="flex flex-row w-full sm:w-auto justify-end gap-2">
                <button type="submit"
                  class="inline-flex items-center gap-2 rounded-md border border-brandBlue-700 bg-brandBlue-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brandBlue-700 active:bg-brandBlue-800 hover:border-brandBlue-800 active:border-brandBlue-800 focus:outline-none focus:ring-2 focus:ring-brandBlue-300 focus:ring-offset-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Tampilkan</span>
                </button>
                <button type="button"
                  @click="() => { filterForm.status_berkas = ''; filterForm.tanggal_pengajuan_awal = ''; filterForm.tanggal_pengajuan_akhir = ''; filterForm.status_verifikator = '' }"
                  class="inline-flex items-center gap-2 rounded-md border border-blue-400 bg-white px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- Data Table (Styled like perencanaan.vue) -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 mb-6">
      <div class="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <span class="text-sm text-gray-500 font-medium">
          Menampilkan {{ startIndex }}-{{ endIndex }} dari {{ tableData.length }} hasil.
        </span>
      </div>
      <div class="shadow-lg rounded-xl bg-white p-2 sm:p-4 overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm whitespace-nowrap" style="table-layout: auto;">
          <thead class="bg-blue-100 sticky top-0 z-10">
            <tr>
              <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">No</th>
              <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Kode RO</th>
              <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Rincian Output</th>
              <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Komp</th>
              <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Sub Komp</th>
              <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Akun</th>
              <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Detil</th>
              <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Tanggal Pengajuan</th>
              <th class="px-3 py-2 text-right font-semibold text-green-700 align-middle">Jumlah Pengajuan</th>
              <th class="px-3 py-2 text-right font-semibold text-red-700 align-middle">Sisa Anggaran</th>
              <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Jumlah Data Dukung</th>
              <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Aksi</th>
            </tr>
            <tr class="bg-white border-b border-gray-200">
              <th class="py-2"></th>
              <th class="py-2"><input v-model="columnFilters.kode_ro" class="filter-input" placeholder="Cari" /></th>
              <th class="py-2"><input v-model="columnFilters.rincian_output" class="filter-input" placeholder="" /></th>
              <th class="py-2"><input v-model="columnFilters.komp" class="filter-input" placeholder="" /></th>
              <th class="py-2"><input v-model="columnFilters.sub_komp" class="filter-input" placeholder="" /></th>
              <th class="py-2"><input v-model="columnFilters.akun" class="filter-input" placeholder="" /></th>
              <th class="py-2"><input v-model="columnFilters.detil" class="filter-input" placeholder="" /></th>
              <th class="py-2"><input v-model="columnFilters.tanggal_pengajuan" class="filter-input" placeholder="" /></th>
              <th class="py-2"><input v-model="columnFilters.jumlah_pengajuan" class="filter-input text-right" placeholder="" /></th>
              <th class="py-2"><input v-model="columnFilters.sisa_anggaran" class="filter-input text-right" placeholder="" /></th>
              <th class="py-2"></th>
              <th class="py-2"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <!-- Loading State (optional) -->
            <!-- <tr v-if="loading">
              <td colspan="12" class="px-6 py-8 text-center text-gray-500">
                <div class="flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span class="ml-2 text-sm">Memuat data...</span>
                </div>
              </td>
            </tr> -->
            <!-- Data Rows -->
            <tr v-for="(item, index) in paginatedData" :key="item.id" class="hover:bg-yellow-50 align-middle">
              <td class="px-3 py-2 text-center align-middle">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="px-3 py-2 font-semibold text-blue-700 align-middle">
                {{ item.kode_suboutput }}
              </td>
              <td class="px-3 py-2 align-middle">
                {{ item.suboutput }}
              </td>
              <td class="px-3 py-2 text-blue-600 font-semibold align-middle">{{ item.kode_komponen }}</td>
              <td class="px-3 py-2 text-blue-600 font-semibold align-middle">{{ item.kode_subkomponen }}</td>
              <td class="px-3 py-2 text-blue-600 font-semibold align-middle">{{ item.kode_akun }}</td>
              <td class="px-3 py-2 text-blue-700 align-middle">{{ item.detil }}</td>
              <td class="px-3 py-2 text-blue-700 font-semibold align-middle">{{ item.tanggal_pengajuan }}</td>
              <td class="px-3 py-2 text-right align-middle">
                <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(item.jumlah_pengajuan) }}</span>
              </td>
              <td class="px-3 py-2 text-right align-middle">
                <span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(item.sisa_anggaran) }}</span>
              </td>
              <td class="px-3 py-2 text-center align-middle">
                <span class="inline-block bg-blue-500 text-white rounded px-2 py-1 font-bold">{{ item.jumlah_data_dukung }}</span>
              </td>
              <td class="px-3 py-2 text-center align-middle">
                <div class="flex gap-2 justify-center">
                  <NuxtLink :to="`/${$route.params.slug}/pengeluaran/view/${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Lihat Pengeluaran">
                    <IconEye class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                  </NuxtLink>
                  <NuxtLink :to="`/pengeluaran/exportExcelUmk?id=${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Export UMK">
                    <IconPrinter class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                  </NuxtLink>
                  <NuxtLink :to="`/${$route.params.slug}/pengeluaran/update/${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Sunting">
                    <IconPencil class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                  </NuxtLink>
                  <button @click="confirmDelete(item.id)" class="hover:text-red-600 transition tooltip" data-tip="Hapus" style="background:none;border:none;padding:0;">
                    <IconTrash class="w-5 h-5 text-red-500 hover:text-red-700" />
                  </button>
                </div>
              </td>
            </tr>
            <!-- Empty State -->
            <tr v-if="paginatedData.length === 0">
              <td colspan="12" class="px-6 py-10 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm">Tidak ada data ditemukan.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <span class="text-sm text-gray-500 font-medium">Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <div class="flex flex-wrap items-center gap-2 md:justify-end">
          <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === 1" @click="goToPage(1)">Awal</button>
          <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">Previous</button>
          <button v-for="page in visiblePages" :key="page" type="button" class="rounded-md border px-3 py-2 text-sm transition-colors" :class="page === currentPage ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'" @click="goToPage(page)">{{ page }}</button>
          <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === totalPages || totalPages === 0" @click="goToPage(currentPage + 1)">Next</button>
          <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === totalPages || totalPages === 0" @click="goToPage(totalPages)">Akhir</button>
        </div>
      </div>
    </div>
    <!-- Rekap Data Pengajuan -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
      <!-- Jumlah Pengajuan -->
      <div class="overflow-hidden border border-gray-200 bg-brandGold-400 shadow sm:rounded-lg">
        <div class="px-4 sm:px-6 py-4">
          <div class="flex items-center gap-3 mb-2">
    
            <span class="text-lg font-bold text-white">Jumlah Pengajuan</span>
          </div>
          <div class="text-3xl font-extrabold mb-2 text-white">{{ rekapData.submissionCount }}</div>
          
        </div>
      </div>
      <!-- Jumlah Dana -->
      <div class="overflow-hidden border border-gray-200 bg-green-400 shadow sm:rounded-lg">
        <div class="px-4 sm:px-6 py-4">
          <div class="flex items-center gap-3 mb-2">
          
            <span class="text-lg font-bold text-white">Jumlah Dana</span>
          </div>
          <div class="text-3xl font-extrabold mb-2 text-white">
            {{ formatCurrency(rekapData.submissionAmount) }}
          </div>
          <div class="text-sm mb-2 text-white">&nbsp;</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const columnFilters = ref({
  kode_ro: '',
  rincian_output: '',
  komp: '',
  sub_komp: '',
  akun: '',
  detil: '',
  tanggal_pengajuan: '',
  jumlah_pengajuan: '',
  sisa_anggaran: ''
})

// Filter data secara client-side
const filteredData = computed(() => {
  return tableData.value.filter(item => {
    return (
      (!columnFilters.value.kode_ro || (item.kode_suboutput || '').toLowerCase().includes(columnFilters.value.kode_ro.toLowerCase())) &&
      (!columnFilters.value.rincian_output || (item.suboutput || '').toLowerCase().includes(columnFilters.value.rincian_output.toLowerCase())) &&
      (!columnFilters.value.komp || (item.kode_komponen || '').toLowerCase().includes(columnFilters.value.komp.toLowerCase())) &&
      (!columnFilters.value.sub_komp || (item.kode_subkomponen || '').toLowerCase().includes(columnFilters.value.sub_komp.toLowerCase())) &&
      (!columnFilters.value.akun || (item.kode_akun || '').toLowerCase().includes(columnFilters.value.akun.toLowerCase())) &&
      (!columnFilters.value.detil || (item.detil || '').toLowerCase().includes(columnFilters.value.detil.toLowerCase())) &&
      (!columnFilters.value.tanggal_pengajuan || (item.tanggal_pengajuan || '').toLowerCase().includes(columnFilters.value.tanggal_pengajuan.toLowerCase())) &&
      (!columnFilters.value.jumlah_pengajuan || String(item.jumlah_pengajuan || '').includes(columnFilters.value.jumlah_pengajuan)) &&
      (!columnFilters.value.sisa_anggaran || String(item.sisa_anggaran || '').includes(columnFilters.value.sisa_anggaran))
    )
  })
})

// Ganti paginatedData menjadi filteredData
const paginatedData = computed(() => filteredData.value)
import { Button, TextField, Card } from '@idds/vue'
import { ref, computed, onMounted } from 'vue'
import { IconFolderCheck, IconChevronDown, IconDatabaseSearch, IconSearch, IconRefresh, IconEye, IconPrinter, IconPencil, IconTrash, IconCalendar } from '@tabler/icons-vue';
import SuboutputAlert from '~/components/SuboutputAlert.vue'

definePageMeta({ layout: 'default' });

// Reactive data
const drawerOpen = ref(false)
const sidebarRail = ref(false)
const showAlert = ref(true)

const filterForm = ref({
  status_berkas: '',
  tanggal_pengajuan_awal: '',
  tanggal_pengajuan_akhir: '',
  status_verifikator: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const tableData = ref([])
const rekapData = ref({ submissionCount: 0, submissionAmount: 0 })
const totalData = ref(0)
const totalPages = ref(1)
const loading = ref(false)

const fetchPengajuan = async () => {
  loading.value = true
  try {
    // Build query params
    const params = new URLSearchParams()
    params.append('page', currentPage.value)
    params.append('pageSize', itemsPerPage.value)
    if (filterForm.value.status_berkas) params.append('status_berkas', filterForm.value.status_berkas)
    if (filterForm.value.tanggal_pengajuan_awal) params.append('tanggal_pengajuan_awal', filterForm.value.tanggal_pengajuan_awal)
    if (filterForm.value.tanggal_pengajuan_akhir) params.append('tanggal_pengajuan_akhir', filterForm.value.tanggal_pengajuan_akhir)
    if (filterForm.value.status_verifikator) params.append('status_verifikator', filterForm.value.status_verifikator)

    // Ambil token dari localStorage
    const token = localStorage.getItem('token')
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

    // Fetch data tabel (paginated)
    const res = await fetch(`/api/pengajuan?${params.toString()}`, { headers })
    const json = await res.json()
    if (json.success && Array.isArray(json.data)) {
      tableData.value = json.data
      totalData.value = json.total || json.data.length
      totalPages.value = Math.ceil(totalData.value / itemsPerPage.value) || 1
      // Jangan update rekapData di sini, biarkan hanya dari /api/total_pengajuan
    } else {
      tableData.value = []
      totalData.value = 0
      totalPages.value = 1
    }

    // Tidak perlu fetch jumlah dana rekap lain, biarkan hanya dari /api/total_pengajuan
  } catch (e) {
    tableData.value = []
    totalData.value = 0
    totalPages.value = 1
    rekapData.value = { jumlah_pengajuan: 0, jumlah_dana: 0 }
    // Optionally show error
    console.error('Gagal fetch pengajuan', e)
  } finally {
    loading.value = false
  }
}

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endIndex = computed(() => {
  const end = (currentPage.value * itemsPerPage.value)
  return end > totalData.value ? totalData.value : end
})
const visiblePages = computed(() => {
  const maxVisible = 5
  const total = totalPages.value
  const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(total, start + maxVisible - 1)
  const adjustedStart = Math.max(1, end - maxVisible + 1)
  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index)
})
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchPengajuan()
  }
}

// Methods
const toggleSidebar = () => {
  sidebarRail.value = !sidebarRail.value
}

const fetchRekapTotalPengajuan = async () => {
  try {
    // Ambil token dari localStorage (atau Pinia store jika ada)
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const res = await fetch('/api/total_pengajuan', { headers });
    const json = await res.json();
    console.log('RESPON /api/total_pengajuan:', json);
    if (json.success) {
      rekapData.value.submissionCount = json.submissionCount || 0;
      rekapData.value.submissionAmount = Number(json.submissionAmount) || 0;
    } else {
      rekapData.value.submissionCount = 0;
      rekapData.value.submissionAmount = 0;
    }
  } catch (e) {
    console.error('ERROR fetch /api/total_pengajuan', e);
    rekapData.value.submissionCount = 0;
    rekapData.value.submissionAmount = 0;
  }
}

const filterData = () => {
  currentPage.value = 1;
  fetchPengajuan();
  fetchRekapTotalPengajuan();
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const confirmDelete = (id) => {
  if (confirm('Yakin akan menghapus data?')) {
    // In a real app, this would make an API call to delete the item
    console.log('Deleting item:', id)
  }
}

// Lifecycle

onMounted(() => {
  fetchPengajuan();
  fetchRekapTotalPengajuan();
})
</script>

<style scoped>
.filter-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white shadow-sm transition placeholder-gray-400 focus:border-green-400 focus:ring-0 outline-none placeholder:text-center placeholder:font-normal;
}
/* Mobile responsive tweaks */
@media (max-width: 640px) {
  .v-table th, .v-table td, th, td {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
    font-size: 0.85rem !important;
  }
  .v-data-table th, .v-data-table td {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
    font-size: 0.85rem !important;
  }
}
/* Catchy style for dashboard-page */
.dashboard-page {
  min-height: 100vh;
  padding-top: 64px;
  padding-left: 256px;
  transition: padding-left 0.3s ease;
}
.dashboard-page.sidebar-rail {
  padding-left: 72px;
}
@media (max-width: 768px) {
  .dashboard-page {
    padding-left: 0 !important;
    padding: 64px 8px 16px 8px;
  }
}
.card-title {
  letter-spacing: 0.5px;
}
.table th {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e0e7ff;
}
.table td {
  font-size: 0.9rem;
  border-bottom: 1px solid #e5e7eb;
}
.btn-circle {
  border-radius: 9999px !important;
}
.btn-info {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  border: none;
}
.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  border: none;
}
.btn-warning {
  background: linear-gradient(135deg, #f59e42 0%, #fbbf24 100%);
  color: #fff;
  border: none;
}
.btn-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #fff;
  border: none;
}
.badge-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #fff;
}
.custom-select-outline {
  border: 2px solid #3b82f6 !important;
  border-radius: 0.75rem !important;
  background-color: #fff;
  transition: border-color 0.2s;
}
.custom-select-outline:focus {
  border-color: #1d4ed8 !important;
  outline: none !important;
  box-shadow: 0 0 0 2px #60a5fa33;
}
.custom-select-outline:hover {
  border-color: #2563eb !important;
}
</style>
