<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Alert Section -->
      <div v-if="showAlert" class="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Perhatian: Data Belum Lengkap</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>
                Terdapat <span class="font-bold">41 Sub Output</span> yang belum ditentukan unitnya.
                <NuxtLink to="/admin/suboutput" class="font-medium underline hover:text-red-900">Klik di sini untuk memperbaiki</NuxtLink>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Header Section -->
      <div class="md:flex md:items-center md:justify-between mb-6">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Daftar Suboutput Tahun 2026
          </h2>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mb-6 flex flex-wrap items-center gap-2">
        <NuxtLink to="/admin/suboutput/create" class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-800 hover:shadow-lg">
          <IconPlus class="h-4 w-4" />
          <span>Tambah Suboutput</span>
        </NuxtLink>
        <NuxtLink to="/admin/suboutput/export" class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-800 hover:shadow-lg">
          <IconDownload class="h-4 w-4" />
          <span>Export ke Excel</span>
        </NuxtLink>
      </div>

      <!-- Content Card -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        
        <!-- Summary & PageSize -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span class="text-sm text-gray-500 font-medium">
            Menampilkan {{ paginationStart }} - {{ paginationEnd }} dari {{ filteredData.length }} hasil
          </span>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <span>Tampilkan</span>
            <select v-model="pageSize" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <span>baris</span>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-blue-100 sticky top-0 z-10">
              <tr>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle w-16">No</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Kode</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Suboutput</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Tahun</th>
                <th class="px-3 py-2 text-right font-semibold text-blue-700 align-middle">Jumlah</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Unit</th>
                <th class="px-3 py-2 text-right font-semibold text-blue-700 align-middle">Aksi</th>
              </tr>
              <!-- Filter Row -->
              <tr class="bg-white border-b border-gray-200">
                <td class="px-3 py-2"></td>
                <td class="px-3 py-2">
                  <input v-model="filterForm.kode" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" maxlength="255" placeholder="Cari kode..." />
                </td>
                <td class="px-3 py-2">
                  <input v-model="filterForm.nama_suboutput" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" maxlength="255" placeholder="Cari suboutput..." />
                </td>
                <td class="px-3 py-2">
                  <input v-model="filterForm.tahun" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" maxlength="4" placeholder="Tahun" />
                </td>
                <td class="px-3 py-2">
                  <input v-model="filterForm.anggaran" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" maxlength="20" placeholder="Jumlah" />
                </td>
                <td class="px-3 py-2">
                  <select v-model="filterForm.unit" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="">- Semua Unit -</option>
                    <option v-for="unit in unitOptions" :key="unit.value" :value="unit.value">{{ unit.text }}</option>
                  </select>
                </td>
                <td class="px-3 py-2 text-right">
                  <button @click="filterData" type="button" class="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
                    <IconSearch class="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                </td>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span class="ml-2 text-sm">Memuat data...</span>
                  </div>
                </td>
              </tr>
              
              <!-- Data Rows -->
              <tr
                v-for="(item, index) in paginatedData"
                :key="item.id"
                class="hover:bg-yellow-50 align-middle transition-colors duration-150"
              >
                <td class="px-3 py-2 text-center align-middle">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td class="px-3 py-2 font-semibold text-blue-700 align-middle">{{ item.kode }}</td>
                <td class="px-3 py-2 align-middle">{{ item.nama_suboutput }}</td>
                <td class="px-3 py-2 text-center align-middle">{{ item.tahun }}</td>
                <td class="px-3 py-2 text-right font-semibold text-blue-700 align-middle">{{ formatCurrency(item.anggaran) }}</td>
                <td class="px-3 py-2 align-middle">
                  <span v-if="item.unit_name" class="inline-block bg-gray-100 text-gray-700 rounded px-2 py-1 font-semibold">{{ item.unit_name }}</span>
                  <span v-else class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">-</span>
                </td>
                <td class="px-3 py-2 text-right align-middle">
                  <div class="flex justify-end space-x-2">
                    <NuxtLink :to="`/pekerjaan/view?id=${item.id}`" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors" title="Lihat Detail">
                      <IconEye class="h-4 w-4" />
                    </NuxtLink>
                    <NuxtLink :to="`/pekerjaan/update?id=${item.id}`" class="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 p-2 rounded-md transition-colors" title="Edit">
                      <IconPencil class="h-4 w-4" />
                    </NuxtLink>
                    <button @click="confirmDelete(item.id)" class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors" title="Hapus">
                      <IconTrash class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="!loading && paginatedData.length === 0">
                <td colspan="7" class="px-6 py-10 text-center text-gray-500">Tidak ada data yang cocok.</td>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { IconPlus, IconDownload, IconSearch, IconEye, IconPencil, IconTrash } from '@tabler/icons-vue'
import { NuxtLink } from '#components'
import { useUserStore } from '~/stores/user'

definePageMeta({ layout: 'default' })

const userStore = useUserStore()
const showAlert = ref(true)
const loading = ref(true)
const filterForm = ref({ kode: '', nama_suboutput: '', tahun: '', anggaran: '', unit: '' })
const suboutputData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

// Unit options dari data yang sudah ada
const unitOptions = computed(() => {
  const uniqueUnits = new Map()
  suboutputData.value.forEach((item) => {
    if (item.unit_id && item.unit_name && !uniqueUnits.has(item.unit_id)) {
      uniqueUnits.set(item.unit_id, { text: item.unit_name, value: String(item.unit_id) })
    }
  })
  return Array.from(uniqueUnits.values())
})

// Filtering logic
const filteredData = computed(() => {
  return suboutputData.value.filter(item => {
    const kodeMatch = filterForm.value.kode === '' || item.kode.toLowerCase().includes(filterForm.value.kode.toLowerCase())
    const namaSuboutputMatch = filterForm.value.nama_suboutput === '' || item.nama_suboutput.toLowerCase().includes(filterForm.value.nama_suboutput.toLowerCase())
    const tahunMatch = filterForm.value.tahun === '' || String(item.tahun).includes(filterForm.value.tahun)
    const anggaranMatch = filterForm.value.anggaran === '' || String(item.anggaran).includes(filterForm.value.anggaran)
    const unitMatch = filterForm.value.unit === '' || String(item.unit_id) === filterForm.value.unit
    return kodeMatch && namaSuboutputMatch && tahunMatch && anggaranMatch && unitMatch
  })
})

// Pagination
const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / pageSize.value)))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

const paginationStart = computed(() => {
  if (filteredData.value.length === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const paginationEnd = computed(() => {
  if (filteredData.value.length === 0) return 0
  return Math.min(currentPage.value * pageSize.value, filteredData.value.length)
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
  }
}

// Reset page when filters or page size change
watch(filteredData, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
  if (filteredData.value.length > 0 && currentPage.value < 1) {
    currentPage.value = 1
  }
})

watch(pageSize, () => {
  currentPage.value = 1
})

// Fetch data
const fetchSuboutput = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    userStore.clearUser()
    await navigateTo('/login')
    return
  }

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  try {
    const response = await fetch('/api/anggaran_suboutput/by-suboutput', { headers })

    if (response.status === 401) {
      localStorage.removeItem('token')
      userStore.clearUser()
      await navigateTo('/login')
      return
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    suboutputData.value = await response.json()
  } catch (error) {
    console.error('Gagal mengambil data', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchSuboutput)

// Filter function (reset to page 1)
const filterData = () => {
  currentPage.value = 1
}

// Format currency
const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount || 0))

// Delete confirmation
const confirmDelete = (id) => { 
  if (confirm('Yakin akan menghapus data?')) { 
    // Implement delete logic here
    console.log('Delete ID:', id)
  } 
}
</script>