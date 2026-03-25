<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="md:flex md:items-center md:justify-between mb-6">
        <div class="flex-1 min-w-0">
          <h1 class="text-3xl font-bold text-blue-700 mb-6">Daftar Pengeluaran Tahun {{ new Date().getFullYear() }}</h1>

        </div>
      </div>

      <Card class="bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
        <template #header>
          <h2 class="text-lg font-bold text-blue-700 flex items-center gap-2">
            <Icon icon="filter-cog" class="w-6 h-6 text-blue-500 animate-spin-slow" />
            Filter Data
          </h2>
        </template>
        <template #default>
          <form class="space-y-2">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
              <!-- Status Data Dukung -->
              <div class="md:col-span-4 flex flex-col justify-end">
                <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="folder-check" class="w-4 h-4 text-blue-500" />
                  <span>Status Data Dukung</span>
                  <span v-if="filterForm.status_berkas" class="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">✓</span>
                </label>
                <div class="relative">
                  <select v-model="filterForm.status_berkas" class="select select-bordered w-full pl-10 pr-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all rounded-xl hover:border-blue-400 appearance-none cursor-pointer" :class="{ 'border-green-400 ring-2 ring-green-100': filterForm.status_berkas }">
                    <option value="" disabled selected>Semua Status</option>
                    <option value="1">Tersedia</option>
                    <option value="0">Belum Tersedia</option>
                  </select>
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon icon="folder-check" class="w-5 h-5 text-gray-400" />
                  </div>
                  <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon icon="chevron-down" class="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <!-- Tanggal Pengajuan Awal -->
              <div class="md:col-span-3 flex flex-col justify-end">
                <TextField v-model="filterForm.tanggal_pengajuan_awal" type="date" placeholder="Tanggal Awal" class="w-full" />
              </div>
              <div class="md:col-span-1 flex items-end justify-center">
                <span class="pb-2">s/d</span>
              </div>
              <!-- Tanggal Pengajuan Akhir -->
              <div class="md:col-span-3 flex flex-col justify-end">
                <TextField v-model="filterForm.tanggal_pengajuan_akhir" type="date" placeholder="Tanggal Akhir" class="w-full" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
              <!-- Status Data -->
              <div class="md:col-span-4 flex flex-col justify-end">
                <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="database-search" class="w-4 h-4 text-blue-500" />
                  <span>Status Data</span>
                  <span v-if="filterForm.status_verifikator" class="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">✓</span>
                </label>
                <div class="relative">
                  <select v-model="filterForm.status_verifikator" class="select select-bordered w-full pl-10 pr-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all rounded-xl hover:border-blue-400 appearance-none cursor-pointer" :class="{ 'border-green-400 ring-2 ring-green-100': filterForm.status_verifikator }">
                    <option value="" disabled selected>Semua Data</option>
                    <option value="0">Hanya Pengajuan Baru</option>
                  </select>
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon icon="database-search" class="w-5 h-5 text-gray-400" />
                  </div>
                  <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon icon="chevron-down" class="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex gap-2 mt-2">
              <Button @click="resetFilters" class="w-auto px-6 flex items-center gap-2 bg-green-700 hover:bg-green-800 border-0 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                <Icon icon="refresh" class="w-4 h-4" />
                <span>Reset</span>
              </Button>
            </div>
          </form>
        </template>
      </Card>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 mb-6">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span class="text-sm text-gray-500 font-medium">
            Menampilkan {{ paginationStart }} - {{ paginationEnd }} dari {{ totalData }} hasil
          </span>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <span>Tampilkan</span>
            <select v-model="itemsPerPage" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <span>baris</span>
          </div>
        </div>

        <div class="shadow-lg rounded-xl bg-white p-4 overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm" style="table-layout: auto;">
            <thead class="bg-blue-100 sticky top-0 z-10">
              <tr>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">No</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Kode Suboutput</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Suboutput</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Komp</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Sub Komp</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Akun</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Uraian</th>
                <th class="px-3 py-2 text-right font-semibold text-green-700 align-middle">Jumlah</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Tanggal Pengajuan</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Pencairan Bendahara</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Status PJ</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">SP2D</th>
                <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Ket</th>
                <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Jumlah Data Dukung</th>
                <th class="px-3 py-2 text-right font-semibold text-blue-700 align-middle">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in pengeluaranData" :key="item.id" class="hover:bg-yellow-50 align-middle">
                <td class="px-3 py-2 text-center align-middle">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="px-3 py-2 font-semibold text-blue-700 align-middle">
                  <NuxtLink :to="`/pekerjaan/view?id=${item.id_pekerjaan}`" class="font-medium text-gray-900 hover:text-indigo-600 hover:underline line-clamp-2">
                    {{ item.id_pekerjaan_kode }}
                  </NuxtLink>
                </td>
                <td class="px-3 py-2 align-middle">
                  <NuxtLink :to="`/pekerjaan/view?id=${item.id_pekerjaan}`" class="font-medium text-gray-900 hover:text-indigo-600 hover:underline line-clamp-2">
                    {{ item.id_pekerjaan_nama }}
                  </NuxtLink>
                </td>
                <td class="px-3 py-2 text-blue-600 font-semibold align-middle">{{ item.kode_komponen }}</td>
                <td class="px-3 py-2 text-blue-600 font-semibold align-middle">{{ item.kode_subkomponen }}</td>
                <td class="px-3 py-2 text-blue-600 font-semibold align-middle">{{ item.kode_akun }}</td>
                <td class="px-3 py-2 text-blue-700 align-middle">{{ item.uraian }}</td>
                <td class="px-3 py-2 text-right align-middle">
                  <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(item.jumlah) }}</span>
                </td>
                <td class="px-3 py-2 text-center align-middle">{{ formatDate(item.tanggal_pengajuan) }}</td>
                <td class="px-3 py-2 text-center align-middle">{{ formatDate(item.tanggal) }}</td>
                <td class="px-3 py-2 text-center align-middle">
                  <span v-if="item.status_pertanggungjawaban" class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatDate(item.status_pertanggungjawaban) }}</span>
                </td>
                <td class="px-3 py-2 text-center align-middle">
                  <span v-if="item.status_sp2d" class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatDate(item.status_sp2d) }}</span>
                </td>
                <td class="px-3 py-2 align-middle">{{ item.keterangan }}</td>
                <td class="px-3 py-2 text-center align-middle">
                  <span class="inline-block bg-blue-500 text-white rounded px-2 py-1 font-bold">{{ item.jumlah_data_dukung }}</span>
                </td>
                <td class="px-3 py-2 text-center align-middle">
                  <div class="flex gap-2 justify-center">
                    <NuxtLink :to="`/${$route.params.slug}/pengeluaran/view/${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Lihat Pengeluaran">
                      <Icon icon="eye" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <NuxtLink :to="`/pengeluaran/exportExcelUmk?id=${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Export UMK">
                      <Icon icon="printer" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <NuxtLink :to="`/${$route.params.slug}/pengeluaran/update/${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Sunting">
                      <Icon icon="pencil" class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <button @click="openDeleteModal(item)" class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors" title="Hapus">
                      <Icon icon="trash" class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Empty State -->
              <tr v-if="(pengeluaranData?.length || 0) === 0">
                <td colspan="15" class="px-6 py-10 text-center text-gray-500">
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

        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span class="text-sm text-gray-500 font-medium">
            Halaman {{ currentPage }} dari {{ totalPages }}
          </span>
          <div class="flex flex-wrap items-center gap-2 md:justify-end">
            <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === 1" @click="goToPage(1)">Awal</button>
            <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">Previous</button>
            <button v-for="page in visiblePages" :key="page" type="button" class="rounded-md border px-3 py-2 text-sm transition-colors" :class="page === currentPage ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'" @click="goToPage(page)">{{ page }}</button>
            <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === totalPages || totalPages === 0" @click="goToPage(currentPage + 1)">Next</button>
            <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === totalPages || totalPages === 0" @click="goToPage(totalPages)">Akhir</button>
          </div>
        </div>
      </div>

      <!-- Modal Delete -->
      <DeleteModal
        :show="showDeleteModal"
        :loading="deleteLoading"
        :error="deleteError"
        :success="deleteSuccess"
        :fileName="itemToDelete?.uraian || ''"
        @close="closeDeleteModal"
        @confirm="doDelete"
      />

      <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-base font-semibold text-gray-900">Rekap Data Pengeluaran</h3>
        </div>
        <div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <div class="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <p class="text-sm font-medium text-gray-500">Jumlah Pengeluaran</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900">{{ totalPengeluaran }} Pengeluaran</p>
            <a href="/api/pengeluaran/export?export=1&exportFormat=1" class="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-900" target="_blank" rel="noopener">
              Unduh Rincian
            </a>
          </div>
          <div class="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <p class="text-sm font-medium text-gray-500">Jumlah Dana</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900">{{ formatCurrency(totalDana) }}</p>
            <a href="/api/pengeluaran/export?export=1&exportFormat=1" class="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-900" target="_blank" rel="noopener">
              Unduh Rincian
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed, ref, watch } from 'vue';
import { Button, TextField, Card } from '@idds/vue'
import Icon from '~/components/Icon.vue'

definePageMeta({ layout: 'default' })

const filterForm = ref({
  status_berkas: '',
  tanggal_pengajuan_awal: '',
  tanggal_pengajuan_akhir: '',
  bulan_pencairan_awal: '',
  tahun_pencairan_awal: '',
  bulan_pencairan_akhir: '',
  tahun_pencairan_akhir: '',
  tanggal_awal: '',
  tanggal_akhir: '',
  bulan_sp2d_awal: '',
  tahun_sp2d_awal: '',
  bulan_sp2d_akhir: '',
  tahun_sp2d_akhir: '',
  tanggal_sp2d_awal: '',
  tanggal_sp2d_akhir: '',
  id_pekerjaan_kode: '',
  id_pekerjaan_nama: '',
  kode_komponen: '',
  kode_subkomponen: '',
  kode_akun: '',
  id_anggaran: '',
  jumlah: '',
  tanggal_pengajuan: '',
  tanggal: '',
  status_pertanggungjawaban: '',
  status_sp2d: '',
  keterangan: '',
  status_verifikator: '',
})
const currentPage = ref(1)
const itemsPerPage = ref(10)
const pengeluaranData = ref([])
const totalData = ref(0)

async function fetchPengeluaran() {
  try {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    const params = new URLSearchParams({
      page: currentPage.value,
      pageSize: itemsPerPage.value,
      ...filterForm.value
    })
    const res = await fetch(`/api/pengeluaran?${params.toString()}`, { headers })
    const json = await res.json()
    if (json.success && Array.isArray(json.data)) {
      pengeluaranData.value = json.data.map(item => ({
        id: item.id,
        id_pekerjaan: item.rkakl_detail_id,
        id_pekerjaan_kode: item.kode_suboutput,
        id_pekerjaan_nama: item.nama_suboutput,
        kode_komponen: item.kode_komponen,
        kode_subkomponen: item.kode_subkomponen,
        kode_akun: item.kode_akun,
        uraian: item.detil || '',
        jumlah: Number(item.jumlah_pengajuan),
        tanggal_pengajuan: item.tanggal_pengajuan,
        tanggal: item.pengeluaran?.tanggal_cair || '',
        status_pertanggungjawaban: item.pengeluaran?.tanggal_pj || '',
        status_sp2d: item.pengeluaran?.tanggal_sp2d || '',
        keterangan: item.pengeluaran?.keterangan || '',
        jumlah_data_dukung: item.jumlah_data_dukung || 0
      }))
      totalData.value = json.total || json.totalData || 0
    } else {
      pengeluaranData.value = []
      totalData.value = 0
    }
  } catch (e) {
    pengeluaranData.value = []
    totalData.value = 0
    console.error('Gagal fetch pengeluaran:', e)
  }
}

// Fetch data saat halaman dimuat, filter, atau pagination berubah
watch([currentPage, itemsPerPage, filterForm], fetchPengeluaran, { immediate: true, deep: true })

// Debug: log isi data setiap kali berubah
watch(pengeluaranData, (val) => { console.log('watch pengeluaranData:', val) })

const totalPages = computed(() => Math.max(1, Math.ceil(totalData.value / itemsPerPage.value)))
const paginationStart = computed(() => totalData.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1)
const paginationEnd = computed(() => totalData.value === 0 ? 0 : Math.min(currentPage.value * itemsPerPage.value, totalData.value))
const visiblePages = computed(() => {
  const maxVisible = 5
  const total = totalPages.value
  const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(total, start + maxVisible - 1)
  const adjustedStart = Math.max(1, end - maxVisible + 1)

  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index)
})
const totalPengeluaran = computed(() => totalData.value)
const totalDana = computed(() => pengeluaranData.value.reduce((sum, item) => sum + item.jumlah, 0))
const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
const formatDate = (date) => date ? new Date(date).toLocaleDateString('id-ID') : ''

const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const deleteLoading = ref(false)
const deleteError = ref('')
const deleteSuccess = ref(false)

function openDeleteModal(item) {
  itemToDelete.value = item
  showDeleteModal.value = true
  deleteError.value = ''
  deleteSuccess.value = false
}

function closeDeleteModal() {
  showDeleteModal.value = false
  itemToDelete.value = null
}

async function doDelete() {
  if (!itemToDelete.value) return
  deleteLoading.value = true
  deleteError.value = ''
  deleteSuccess.value = false
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/pengajuan/${itemToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    const json = await res.json()
    console.log('Delete response:', json)
    if (json.success) {
      deleteSuccess.value = true
      fetchPengeluaran()
      setTimeout(() => {
        closeDeleteModal()
      }, 1000)
    } else {
      console.error('Delete error:', json.error)
      deleteError.value = json.error || 'Gagal menghapus data'
    }
  } catch (e) {
    console.error('Exception saat hapus:', e)
    deleteError.value = 'Terjadi kesalahan saat menghapus data'
  } finally {
    deleteLoading.value = false
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
const resetFilters = () => {
  filterForm.value = {
    status_berkas: '',
    tanggal_pengajuan_awal: '',
    tanggal_pengajuan_akhir: '',
    bulan_pencairan_awal: '',
    tahun_pencairan_awal: '',
    bulan_pencairan_akhir: '',
    tahun_pencairan_akhir: '',
    tanggal_awal: '',
    tanggal_akhir: '',
    bulan_sp2d_awal: '',
    tahun_sp2d_awal: '',
    bulan_sp2d_akhir: '',
    tahun_sp2d_akhir: '',
    tanggal_sp2d_awal: '',
    tanggal_sp2d_akhir: '',
    id_pekerjaan_kode: '',
    id_pekerjaan_nama: '',
    kode_komponen: '',
    kode_subkomponen: '',
    kode_akun: '',
    id_anggaran: '',
    jumlah: '',
    tanggal_pengajuan: '',
    tanggal: '',
    status_pertanggungjawaban: '',
    status_sp2d: '',
    keterangan: '',
    status_verifikator: '',
  }
}

watch(itemsPerPage, () => {
  currentPage.value = 1
})
</script>