<template>
  <div class="pt-14">
    <SuboutputAlert :showAlert="showAlert" />
    <h1 class="text-3xl font-bold text-blue-700 mb-6">Daftar Pengajuan Tahun 2026</h1>
    <!-- Filter Form -->
    <Card class="bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <template #header>
        <h2 class="text-lg font-bold text-blue-700 flex items-center gap-2">
          <Icon icon="mdi:filter-cog" class="w-6 h-6 text-blue-500 animate-spin-slow" />
          Filter Data
        </h2>
      </template>
      <template #default>
        <form @submit.prevent="filterData" class="space-y-2">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
            <!-- Status Data Dukung -->
            <div class="md:col-span-4 flex flex-col justify-end">
              <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <IconFolderCheck class="w-4 h-4 text-blue-500" />
                <span>Status Data Dukung</span>
                <span v-if="filterForm.status_berkas" class="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">✓</span>
              </label>
              <div class="relative">
                <select v-model="filterForm.status_berkas"
                  class="block w-full min-w-[160px] max-w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-8 text-base focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all appearance-none cursor-pointer"
                  :class="{ 'border-green-400 ring-2 ring-green-100': filterForm.status_berkas }">
                  <option value="" disabled selected>Semua Status</option>
                  <option value="1">Tersedia</option>
                  <option value="0">Belum Tersedia</option>
                </select>
                <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <IconFolderCheck class="w-5 h-5 text-gray-400" />
                </div>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <IconChevronDown class="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
            <!-- Pengajuan (Label + Range) -->
            <div class="md:col-span-4 flex flex-col justify-end">
              <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <IconCalendar class="w-4 h-4 text-blue-500" />
                <span>Pengajuan</span>
              </label>
              <div class="flex items-end gap-2">
                <TextField v-model="filterForm.tanggal_pengajuan_awal" type="date" placeholder="mm/dd/yyyy" class="w-36" />
                <span class="pb-2 text-gray-500">s/d</span>
                <TextField v-model="filterForm.tanggal_pengajuan_akhir" type="date" placeholder="mm/dd/yyyy" class="w-36" />
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
            <!-- Status Data -->
            <div class="md:col-span-2 flex flex-col justify-end">
              <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <IconDatabaseSearch class="w-4 h-4 text-blue-500" />
                <span>Status Data</span>
                <span v-if="filterForm.status_verifikator" class="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">✓</span>
              </label>
              <div class="relative w-full max-w-[260px] min-w-[180px]">
                <select v-model="filterForm.status_verifikator"
                  class="block w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-8 text-base focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all appearance-none cursor-pointer"
                  :class="{ 'border-green-400 ring-2 ring-green-100': filterForm.status_verifikator }">
                  <option value="" disabled selected>Semua Data</option>
                  <option value="0">Hanya Pengajuan Baru</option>
                </select>
                <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <IconDatabaseSearch class="w-5 h-5 text-gray-400" />
                </div>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <IconChevronDown class="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex gap-2 mt-2">
            <Button @click="filterData" class="w-auto px-6 flex items-center gap-2 bg-green-700 hover:bg-green-800 border-0 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              <IconSearch class="w-4 h-4" />
              <span>Filter Data</span>
            </Button>
            <Button @click="() => { filterForm.status_berkas = ''; filterForm.tanggal_pengajuan_awal = ''; filterForm.tanggal_pengajuan_akhir = ''; filterForm.status_verifikator = '' }" class="w-auto px-6 flex items-center gap-2 bg-green-700 hover:bg-green-800 border-0 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              <IconRefresh class="w-4 h-4" />
              <span>Reset</span>
            </Button>
          </div>
        </form>
      </template>
    </Card>
    <!-- Data Table (Styled like perencanaan.vue) -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 mb-6">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <span class="text-sm text-gray-500 font-medium">
          Menampilkan {{ startIndex }}-{{ endIndex }} dari {{ totalData }} hasil.
        </span>
      </div>
      <div class="shadow-lg rounded-xl bg-white p-4 overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm" style="table-layout: auto;">
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
            <tr v-for="(item, index) in tableData" :key="item.id" class="hover:bg-yellow-50 align-middle">
              <td class="px-3 py-2 text-center align-middle">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="px-3 py-2 font-semibold text-blue-700 align-middle">
                <NuxtLink :to="`/pekerjaan/view?id=${item.id_pekerjaan}`" class="font-medium text-gray-900 hover:text-indigo-600 hover:underline line-clamp-2">
                  {{ item.kode_suboutput }}
                </NuxtLink>
              </td>
              <td class="px-3 py-2 align-middle">
                <NuxtLink :to="`/pekerjaan/view?id=${item.id_pekerjaan}`" class="font-medium text-gray-900 hover:text-indigo-600 hover:underline line-clamp-2">
                  {{ item.suboutput }}
                </NuxtLink>
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
            <tr v-if="tableData.length === 0">
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
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Jumlah Pengajuan -->
      <div class="overflow-hidden border border-gray-200 bg-brandGold-400 shadow sm:rounded-lg">
        <div class="px-6 py-4">
          <div class="flex items-center gap-3 mb-2">
    
            <span class="text-lg font-bold text-white">Jumlah Pengajuan</span>
          </div>
          <div class="text-3xl font-extrabold mb-2 text-white">{{ rekapData.jumlah_pengajuan }}</div>
          
        </div>
      </div>
      <!-- Jumlah Dana -->
      <div class="overflow-hidden border border-gray-200 bg-green-400 shadow sm:rounded-lg">
        <div class="px-6 py-4">
          <div class="flex items-center gap-3 mb-2">
          
            <span class="text-lg font-bold text-white">Jumlah Dana</span>
          </div>
          <div class="text-3xl font-extrabold mb-2 text-white">{{ formatCurrency(rekapData.jumlah_dana) }}</div>
          <div class="text-sm mb-2 text-white">&nbsp;</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>

import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '~/stores/user.js'
import { useRouter } from 'vue-router'
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

const rekapData = ref({
  jumlah_pengajuan: 0,
  jumlah_dana: 0
})

const totalData = ref(0)

const fetchPengajuan = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    if (userStore && userStore.clearUser) userStore.clearUser()
    if (router && router.push) await router.push('/login')
    return
  }
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await fetch(`/api/pengajuan?page=${currentPage.value}&pageSize=${itemsPerPage.value}`, { headers })
    const json = await res.json()
    if (json.success && Array.isArray(json.data)) {
      tableData.value = json.data
      totalPages.value = Math.ceil((json.total || 0) / itemsPerPage.value) || 1
      totalData.value = json.total || 0
    }
  } catch (e) {
    // error handling
    console.error('Gagal fetch pengajuan', e)
  }
}

watch(currentPage, () => {
  fetchPengajuan()
})

// Computed properties
const totalPages = ref(1)

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endIndex = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > tableData.value.length ? tableData.value.length : end
})

// Pagination for numbered buttons (like program)
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
  }
}

// Methods
const toggleSidebar = () => {
  sidebarRail.value = !sidebarRail.value
}

const filterData = () => {
  // In a real app, this would make an API call to filter the data
  console.log('Filtering data with:', filterForm.value)
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

const fetchRekapPengajuan = async () => {
  try {
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch('/api/jumlah_pengajuan', { headers })
    const json = await res.json()
    if (json.success) {
      rekapData.value.jumlah_pengajuan = json.jumlah_pengajuan
      rekapData.value.jumlah_dana = parseInt(json.jumlah_dana) || 0
    }
  } catch (e) {
    console.error('Gagal fetch rekap pengajuan', e)
  }
}

// Lifecycle
onMounted(() => {
  fetchPengajuan()
  fetchRekapPengajuan()
})
</script>

<style scoped>
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