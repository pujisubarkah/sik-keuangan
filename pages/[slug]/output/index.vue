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
            Daftar Output Tahun 2026
          </h2>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mb-6 flex flex-wrap items-center gap-2">
        <NuxtLink to="/admin/output/create" class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-800 hover:shadow-lg">
          <IconPlus class="h-4 w-4" />
          <span>Tambah Output</span>
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
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Nama</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Tahun</th>
                <th class="px-3 py-2 text-center font-semibold text-yellow-700 align-middle">Sub Output</th>
                <th class="px-3 py-2 text-right font-semibold text-blue-700 align-middle">Jumlah</th>
                <th class="px-3 py-2 text-right font-semibold text-blue-700 align-middle">Aksi</th>
              </tr>
              <!-- Filter Row -->
              <tr class="bg-white border-b border-gray-200">
                <td class="px-3 py-2"></td>
                <td class="px-3 py-2">
                  <input v-model="filterForm.kode" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" maxlength="255" placeholder="Cari kode..." />
                </td>
                <td class="px-3 py-2">
                  <input v-model="filterForm.nama" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" maxlength="255" placeholder="Cari nama..." />
                </td>
                <td class="px-3 py-2">
                  <input v-model="filterForm.tahun" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" maxlength="4" placeholder="Tahun" />
                </td>
                <td class="px-3 py-2"></td>
                <td class="px-3 py-2">
                  <input v-model="filterForm.jumlah" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" maxlength="20" placeholder="Jumlah" />
                </td>
                <td class="px-3 py-2 text-right">
                  <button @click="filterData" type="button" class="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
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
                :key="`${item.output_id}-${item.satker_id}-${item.tahun_anggaran_id}`"
                class="hover:bg-yellow-50 align-middle transition-colors duration-150"
              >
                <td class="px-3 py-2 text-center align-middle">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td class="px-3 py-2 font-semibold text-blue-700 align-middle">{{ item.kode }}</td>
                <td class="px-3 py-2 align-middle">{{ item.nama_output }}</td>
                <td class="px-3 py-2 text-center align-middle">{{ item.tahun }}</td>
                <td class="px-3 py-2 text-center align-middle">
                  <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">
                    {{ item.suboutput }} Sub Output
                  </span>
                </td>
                <td class="px-3 py-2 text-right font-semibold text-blue-700 align-middle">{{ formatCurrency(item.jumlah) }}</td>
                <td class="px-3 py-2 text-right align-middle">
                  <div class="flex justify-end space-x-2">
                    <NuxtLink :to="`/${$route.params.slug}/output/view/${item.output_id}`" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors" title="Lihat Detail">
                      <IconEye class="h-4 w-4" />
                    </NuxtLink>
                    <NuxtLink :to="`/${$route.params.slug}/output/update/${item.output_id}`" class="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 p-2 rounded-md transition-colors" title="Edit">
                      <IconPencil class="h-4 w-4" />
                    </NuxtLink>
                    <button @click="openDeleteModal(item.output_id)" class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors" title="Hapus">
                      <IconTrash class="h-4 w-4" />
                    </button>
                        <!-- ✅ Modal Konfirmasi Hapus - OUTSIDE v-for, root of template -->
                        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
                          <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full animate-fadein">
                            <h2 class="text-xl font-bold text-red-700 mb-3">Konfirmasi Hapus</h2>
                            <p class="mb-4 text-gray-700">Apakah anda yakin akan menghapus kegiatan ini?</p>
                            <div v-if="deleteError" class="mb-2 text-red-600">{{ deleteError }}</div>
                            <div v-if="deleteSuccess" class="mb-2 text-green-600">Data berhasil dihapus.</div>
                            <div class="flex justify-end gap-3 mt-4">
                              <button @click="showDeleteModal = false" :disabled="deleteLoading" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">Batal</button>
                              <button @click="doDelete" :disabled="deleteLoading" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2">
                                <span v-if="deleteLoading" class="loader mr-2"></span>
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="!loading && paginatedData.length === 0">
                <td colspan="7" class="px-6 py-10 text-center text-gray-500">Tidak ada data output ditemukan.</td>
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
import { IconEye, IconPencil, IconPlus, IconTrash } from '@tabler/icons-vue'
import { NuxtLink } from '#components'
import { useUserStore } from '~/stores/user'

// Modal state
const showDeleteModal = ref(false)
const deleteLoading = ref(false)
const deleteError = ref('')
const deleteSuccess = ref(false)
const deleteId = ref(null)

function openDeleteModal(id) {
  deleteId.value = id
  deleteError.value = ''
  deleteSuccess.value = false
  showDeleteModal.value = true
}

async function doDelete() {
  deleteLoading.value = true
  deleteError.value = ''
  deleteSuccess.value = false
  try {
    // TODO: Ganti dengan request API hapus sesuai kebutuhan
    await new Promise(resolve => setTimeout(resolve, 1000))
    deleteSuccess.value = true
    // Hapus data dari outputData
    outputData.value = outputData.value.filter(item => item.output_id !== deleteId.value)
    setTimeout(() => {
      showDeleteModal.value = false
    }, 800)
  } catch (e) {
    deleteError.value = 'Gagal menghapus data.'
  } finally {
    deleteLoading.value = false
  }
}

definePageMeta({ layout: 'default' })

const showAlert = ref(true)
const userStore = useUserStore()
const filterForm = ref({ kode: '', nama: '', tahun: '', jumlah: '' })
const outputData = ref([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)

const fetchOutput = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    userStore.clearUser()
    await navigateTo('/login')
    return
  }

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  try {
    const response = await fetch('/api/output', { headers })

    if (response.status === 401) {
      localStorage.removeItem('token')
      userStore.clearUser()
      await navigateTo('/login')
      return
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const result = await response.json()
    // result adalah array dari master_output + join info
    outputData.value = (result || []).map(item => ({
      output_id: item.id,
      kode: item.kode_output,
      nama_output: item.nama_output,
      kegiatan_id: item.kegiatan_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      jumlah: item.total ?? 0,
      suboutput: item.jumlah_suboutput ?? 0,
      tahun: item.tahun_anggaran,
    }))
  } catch (error) {
    console.error('Gagal mengambil data output', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchOutput)

const filteredData = computed(() => {
  return outputData.value.filter(item => {
    const kodeMatch = filterForm.value.kode === '' || item.kode.toLowerCase().includes(filterForm.value.kode.toLowerCase())
    const namaMatch = filterForm.value.nama === '' || item.nama_output.toLowerCase().includes(filterForm.value.nama.toLowerCase())
    const tahunMatch = filterForm.value.tahun === '' || String(item.tahun).includes(filterForm.value.tahun)
    const jumlahMatch = filterForm.value.jumlah === '' || String(item.jumlah).includes(filterForm.value.jumlah)
    return kodeMatch && namaMatch && tahunMatch && jumlahMatch
  })
})

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