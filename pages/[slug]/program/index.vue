<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Alert Section -->
      <SuboutputAlert />

      <!-- Header Section -->
      <div class="md:flex md:items-center md:justify-between mb-6">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Daftar Program Tahun 2026
          </h2>
        </div>
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

        <!-- Table Wrapper -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-blue-100 sticky top-0 z-10">
              <tr>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle w-16">No</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Kode</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Nama</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Tahun</th>
                <th class="px-3 py-2 text-center font-semibold text-green-700 align-middle">Kegiatan</th>
                <th class="px-3 py-2 text-center font-semibold text-green-700 align-middle">Output</th>
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
                <td class="px-3 py-2"></td>
                <td class="px-3 py-2"></td>
                <td class="px-3 py-2"></td>
                <td class="px-3 py-2"></td>
                <td class="px-3 py-2"></td>
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
                <td colspan="9" class="px-6 py-8 text-center text-gray-500">Memuat data...</td>
              </tr>
              
              <!-- Data Rows -->
              <tr
                v-for="(item, index) in paginatedData"
                :key="`${item.program_id}-${item.satker_id}-${item.tahun_anggaran_id}`"
                class="hover:bg-yellow-50 align-middle"
              >
                <td class="px-3 py-2 text-center align-middle">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td class="px-3 py-2 font-semibold text-blue-700 align-middle">{{ item.kode }}</td>
                <td class="px-3 py-2 align-middle">{{ item.nama_program }}</td>
                <td class="px-3 py-2 text-center align-middle">{{ item.tahun }}</td>
                <td class="px-3 py-2 text-center align-middle">
                  <span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">{{ item.jumlah_kegiatan }}</span>
                </td>
                <td class="px-3 py-2 text-center align-middle">
                  <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ item.jumlah_output }}</span>
                </td>
                <td class="px-3 py-2 text-center align-middle">
                  <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ item.jumlah_suboutput }}</span>
                </td>
                <td class="px-3 py-2 text-right font-semibold text-blue-700 align-middle">{{ formatCurrency(item.jumlah) }}</td>
                <td class="px-3 py-2 text-right align-middle">
                  <div class="flex justify-end space-x-2">
                    <NuxtLink :to="`/${$route.params.slug}/program/view/${item.program_id}`" class="bg-blue-50 p-2 rounded hover:bg-blue-100 text-blue-600 transition tooltip" title="Lihat Detail">
                      <IconEye class="h-4 w-4 text-blue-600" />
                    </NuxtLink>
                    <NuxtLink :to="`/${$route.params.slug}/program/update/${item.program_id}`" class="bg-yellow-50 p-2 rounded hover:bg-yellow-100 text-yellow-600 transition tooltip" title="Edit">
                      <IconPencil class="h-4 w-4 text-yellow-600" />
                    </NuxtLink>
                    <button @click="confirmDelete(item.program_id)" class="bg-red-50 p-2 rounded hover:bg-red-100 text-red-600 transition tooltip" title="Hapus">
                      <IconTrash class="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="!loading && paginatedData.length === 0">
                <td colspan="9" class="px-6 py-10 text-center text-gray-500">Tidak ada data program ditemukan.</td>
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

    <!-- ✅ Modal Konfirmasi Hapus - NOW INSIDE TEMPLATE -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full animate-fadein">
        <h2 class="text-xl font-bold text-red-700 mb-3">Konfirmasi Hapus</h2>
        <p class="mb-4 text-gray-700">Apakah anda yakin akan menghapus program ini?</p>
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
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-vue'
import { useUserStore } from '~/stores/user'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

definePageMeta({ layout: 'default' })

// Modal state
const showDeleteModal = ref(false)
const deleteId = ref(null)
const deleteLoading = ref(false)
const deleteError = ref('')
const deleteSuccess = ref(false)

const showAlert = ref(true)
const userStore = useUserStore()
const filterForm = ref({ kode: '', nama: '' })
const tableData = ref([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)

const fetchProgram = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    userStore.clearUser()
    await navigateTo('/login')
    return
  }

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  try {
    const response = await fetch('/api/program', { headers })

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
    // result.data adalah array dari master_program
    tableData.value = (result.data || []).map(item => ({
      program_id: item.id,
      kode: item.kode_program,
      nama_program: item.nama_program,
      tahun: item.created_at ? new Date(item.created_at).getFullYear() : '',
      jumlah_kegiatan: item.jumlah_kegiatan ?? 0,
      jumlah_output: item.jumlah_output ?? 0,
      jumlah_suboutput: item.jumlah_suboutput ?? 0,
      jumlah: item.total ?? 0,
    }))
  } catch (error) {
    console.error('Gagal mengambil data program', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProgram)

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    const kodeMatch = filterForm.value.kode === '' || item.kode.toLowerCase().includes(filterForm.value.kode.toLowerCase())
    const namaMatch = filterForm.value.nama === '' || item.nama_program.toLowerCase().includes(filterForm.value.nama.toLowerCase())
    return kodeMatch && namaMatch
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

const filterData = () => {
  currentPage.value = 1
}

const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount || 0))

const confirmDelete = (id) => {
  deleteId.value = id
  showDeleteModal.value = true
  deleteError.value = ''
  deleteSuccess.value = false
}

const doDelete = async () => {
  if (!deleteId.value) return
  deleteLoading.value = true
  deleteError.value = ''
  deleteSuccess.value = false
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const res = await fetch(`/api/anggaran_program/by-program/${deleteId.value}.delete`, {
      method: 'DELETE',
      headers
    })
    const json = await res.json()
    if (json.success) {
      deleteSuccess.value = true
      await fetchProgram()
      setTimeout(() => {
        showDeleteModal.value = false
        deleteId.value = null
      }, 1200)
    } else {
      deleteError.value = json.message || 'Gagal menghapus data.'
    }
  } catch (e) {
    deleteError.value = 'Gagal menghapus data.'
  } finally {
    deleteLoading.value = false
  }
}
</script>

<style scoped>
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #e53e3e;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>