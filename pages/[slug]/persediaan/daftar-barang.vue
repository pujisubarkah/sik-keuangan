definePageMeta({ layout: 'default' });

<template>
  <div class="pt-14">
    <!-- Breadcrumb -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink :to="`/${$route.params.slug}`" class="hover:text-blue-700">
        Beranda
      </NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Daftar Barang</span>
    </div>
    
    <h1 class="text-3xl font-bold text-blue-700 mb-6">Daftar Barang Persediaan</h1>
   
    <!-- Alert -->
    <SuboutputAlert :showAlert="showAlert" />

     <!-- ACTION -->
    <div class="mb-4">
      <NuxtLink
        to="/admin/persediaan/create"
        class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-800 hover:shadow-lg"
      >
        <IconPlus class="w-4 h-4" />
        <span>Tambah Barang Persediaan</span>
      </NuxtLink>
    </div>
    
    <!-- Data Table Card -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 mb-6">
      <!-- Table -->
      <div class="shadow-lg rounded-xl bg-white p-4 overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm" style="table-layout: auto;">
          <thead class="bg-blue-100 sticky top-0 z-10">
            <tr>
              <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">No</th>
              <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">
                <button @click="sortBy('kode_barang')" class="hover:text-blue-700">Kode Barang {{ getSortIcon('kode_barang') }}</button>
              </th>
              <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">
                <button @click="sortBy('nama_barang')" class="hover:text-blue-700">Nama Barang {{ getSortIcon('nama_barang') }}</button>
              </th>
              <th class="px-3 py-2 text-center font-semibold text-green-700 align-middle">
                <button @click="sortBy('harga_satuan')" class="hover:text-green-700">Harga Satuan {{ getSortIcon('harga_satuan') }}</button>
              </th>
              <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">
                <button @click="sortBy('id_satker')" class="hover:text-blue-700">Satker {{ getSortIcon('id_satker') }}</button>
              </th>
              <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">
                <button @click="sortBy('id_unit')" class="hover:text-blue-700">Unit {{ getSortIcon('id_unit') }}</button>
              </th>
              <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">
                <button @click="sortBy('kode_akun')" class="hover:text-blue-700">Kode Akun {{ getSortIcon('kode_akun') }}</button>
              </th>
              <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Aksi</th>
            </tr>
            <tr class="bg-white">
              <td></td>
              <td>
                <input v-model="filters.kode_barang" @input="applyFilters" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center" maxlength="50" placeholder="Cari..." />
              </td>
              <td>
                <input v-model="filters.nama_barang" @input="applyFilters" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center" maxlength="255" placeholder="Cari..." />
              </td>
              <td>
                <input v-model="filters.harga_satuan" @input="applyFilters" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center" maxlength="20" placeholder="Cari..." />
              </td>
              <td>
                <select v-model="filters.id_satker" @change="applyFilters" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center">
                  <option value="">Semua</option>
                  <option v-for="satker in satkerOptions" :key="satker.id" :value="satker.id">
                    {{ satker.nama }}
                  </option>
                </select>
              </td>
              <td>
                <select v-model="filters.id_unit" @change="applyFilters" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center">
                  <option value="">Semua</option>
                  <option v-for="unit in unitOptions" :key="unit.id" :value="unit.id">
                    {{ unit.nama }}
                  </option>
                </select>
              </td>
              <td>
                <input v-model="filters.kode_akun" @input="applyFilters" type="text" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center" maxlength="50" placeholder="Cari..." />
              </td>
              <td></td>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(item, index) in paginatedItems" :key="item.id" class="hover:bg-yellow-50 align-middle">
              <td class="px-3 py-2 text-center align-middle font-bold text-blue-700">{{ startIndex + index }}</td>
              <td class="px-3 py-2 text-center align-middle font-semibold text-blue-600">{{ item.kode_barang }}</td>
              <td class="px-3 py-2 align-middle text-blue-700">{{ item.nama_barang }}</td>
              <td class="px-3 py-2 text-right align-middle text-green-700 font-bold">{{ formatCurrency(item.harga_satuan) }}</td>
              <td class="px-3 py-2 text-center align-middle text-blue-700">{{ getSatkerName(item.id_satker) }}</td>
              <td class="px-3 py-2 text-center align-middle text-blue-700">{{ getUnitName(item.id_unit) }}</td>
              <td class="px-3 py-2 text-center align-middle font-semibold text-blue-600">{{ item.kode_akun }}</td>
              <td class="px-3 py-2 text-center align-middle">
                <div class="flex gap-2 justify-center">
                  <button @click="viewItem(item)" class="bg-blue-50 p-2 rounded hover:bg-blue-100 text-blue-600 transition tooltip" data-tip="View" style="border:none;padding:0;">
                    <IconEye class="w-5 h-5 text-blue-600" />
                  </button>
                  <button @click="editItem(item)" class="bg-yellow-50 p-2 rounded hover:bg-yellow-100 text-yellow-600 transition tooltip" data-tip="Update" style="border:none;padding:0;">
                    <IconPencil class="w-5 h-5 text-yellow-600" />
                  </button>
                  <button @click="deleteItem(item)" class="bg-red-50 p-2 rounded hover:bg-red-100 text-red-600 transition tooltip" data-tip="Delete" style="border:none;padding:0;">
                    <IconTrash class="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedItems.length === 0">
              <td colspan="8" class="px-6 py-10 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm">Tidak ada data yang ditemukan.</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
        
        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between mt-6">
          <span class="text-sm text-gray-500 font-medium">Halaman {{ currentPage }} dari {{ totalPages }}</span>
          <div class="flex flex-wrap items-center gap-2 md:justify-end">
            <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === 1" @click="goToPage(1)">Awal</button>
            <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">Previous</button>
            <button v-for="page in visiblePages" :key="page" type="button" class="rounded-md border px-3 py-2 text-sm transition-colors" :class="page === currentPage ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'" @click="goToPage(page)">{{ page }}</button>
            <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">Next</button>
            <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="currentPage === totalPages" @click="goToPage(totalPages)">Akhir</button>
          </div>
        </div>
	  </div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { IconPlus, IconSearch, IconEye, IconPencil, IconTrash } from '@tabler/icons-vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

// State
const items = ref([])
const filters = ref({
  kode_barang: '',
  nama_barang: '',
  harga_satuan: '',
  id_satker: '',
  id_unit: '',
  kode_akun: ''
})
const sortField = ref('')
const sortDirection = ref('asc')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Options for dropdowns
const satkerOptions = ref([
  { id: 1, nama: 'LAN JAKARTA' },
  { id: 2, nama: 'PUSJAR SKTASN NAS' },
  { id: 3, nama: 'PUSJAR SKMP' },
  { id: 4, nama: 'PUSJAR SKPP' },
  { id: 5, nama: 'PUSJAR SKMK' },
  { id: 6, nama: 'STIA LAN BANDUNG' },
  { id: 7, nama: 'STIA LAN JAKARTA' },
  { id: 8, nama: 'STIA MAKASSAR' }
])

const unitOptions = ref([
  { id: 1, nama: 'Poksi Keuangan' },
  { id: 3, nama: 'Poksi SDM' },
  { id: 4, nama: 'Bagian Barjas dan BMN' },
  { id: 5, nama: 'Bagian Perencanaan, Evaluasi Kinerja dan Reformasi Birokrasi Internal' },
  { id: 6, nama: 'Poksi Humas dan Protokol' },
  { id: 7, nama: 'Poksi Hukum dan Organisasi' },
  { id: 8, nama: 'Poksi Arsip dan Dokumentasi' },
  { id: 11, nama: 'Inspektorat' },
  { id: 12, nama: 'Pusat Pelatihan dan Pengembangan dan Pemetaan Kompetensi Aparatur Sipil Negara (Puslatbang PKASN)' },
  { id: 13, nama: 'Pusat Pelatihan dan Pengembangan dan Kajian Manajemen Pemerintahan (Puslatbang KMP)' },
  { id: 14, nama: 'Pusat Pelatihan dan Pengembangan dan Kajian Desentralisasi dan Otonomi Daerah (Puslatbang KDOD)' },
  { id: 15, nama: 'Pusat Pelatihan dan Pengembangan dan Kajian Hukum Administrasi Negara (Puslatbang KHAN)' },
  { id: 16, nama: 'STIA LAN Jakarta' },
  { id: 17, nama: 'STIA LAN Bandung' },
  { id: 18, nama: 'STIA LAN Makassar' },
  { id: 21, nama: 'Balai Bahasa' },
  { id: 24, nama: 'Pemkom Puslatbang PKASN' },
  { id: 26, nama: 'Latbang Puslatbang PKASN' },
  { id: 27, nama: 'Administrasi Puslatbang PKASN' },
  { id: 31, nama: 'Administrasi Puslatbang KDOD' },
  { id: 32, nama: 'Latbang Puslatbang KDOD' },
  { id: 36, nama: 'Pelatihan dan Pengembangan Puslatbang KHAN' },
  { id: 37, nama: 'Kajian Hukum Administrasi Negara Puslatbang KHAN' },
  { id: 38, nama: 'Administrasi Puslatbang KHAN' },
  { id: 39, nama: 'Kajian Puslatbang KDOD' },
  { id: 43, nama: 'Pusat Pembinaan Analis Kebijakan (Pusaka)' },
  { id: 44, nama: 'Pusat Pengembangan Kompetensi Kepemimpinan Nasional dan Manajerial Aparatur Sipil Negara (Pusbangkom Pimnas & Manajerial ASN)' },
  { id: 45, nama: 'Pusat Inovasi Adminsitrasi Negara (PIAN)' },
  { id: 46, nama: 'Pusat Kajian Kebijakan Administrasi Negara (PK2AN)' },
  { id: 47, nama: 'Pusat Kajian Manajemen Aparatur Sipil Negara (PKMASN)' },
  { id: 48, nama: 'Pusat Inovasi Manajemen Pengembangan Kompetensi Aparatur Sipil Negara (PIM Bangkom ASN)' },
  { id: 49, nama: 'Pusat Teknologi Pengembangan Kompetensi (Pustek Bangkom)' },
  { id: 50, nama: 'Pusat Pembinaan Program dan Kebijakan Pengembangan Kompetensi Aparatur Sipil Negara (P3K Bangkom ASN)' },
  { id: 52, nama: 'Pusat Pembinaan Jabatan Fungsional Bidang Pengembangan Kompetensi Pegawai Aparatur Sipil Negara (Pusbin JF Bangkom ASN)' },
  { id: 54, nama: 'Pusat Pengembangan Kompetensi Teknis dan Sosial Kultural Aparatur Sipil Negara (Pusbangkom TSK ASN)' },
  { id: 55, nama: 'Pusat Pengembangan Kader Aparatur Sipil Negara (Pusbang Kader ASN)' },
  { id: 56, nama: 'Pusat Data dan Sistem Informasi (Pusdatin)' },
  { id: 62, nama: 'Bagian Umum dan Layanan Pengadaan Barjas' },
  { id: 63, nama: 'Biro Hukum, Organisasi dan Sumber Daya Manusia' },
  { id: 64, nama: 'Biro Umum, Kerjasama dan Hubungan Masyarakat' },
  { id: 65, nama: 'Direktorat Strategi Peningkatan Kualitas Kebijakan Administrasi Negara' },
  { id: 66, nama: 'Direktorat Advokasi dan Pengembangan Kinerja Kebijakan' },
  { id: 67, nama: 'Direktorat Penguatan Kapasitas Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran ASN' },
  { id: 68, nama: 'Direktorat Pembelajaran Sistem Terintegrasi' },
  { id: 69, nama: 'Direktorat Teknologi dan Digitalisasi Pembelajaran' },
  { id: 70, nama: 'Direktorat Ekosistem Pembejalaran ASN' },
  { id: 71, nama: 'Direktorat Pembelajaran Manajerial Kepemimpinan' },
  { id: 72, nama: 'Direktorat Pembelajaran Karakter dan Sosial Kultural' },
  { id: 73, nama: 'Direktorat Pembalajaran Teknis dan Fungsional' },
  { id: 74, nama: 'Direktorat Penjaminan Mutu Pengembangan Kapasitas' },
  { id: 75, nama: 'Direktorat Penjaminan Mutu Pembelajaran' },
  { id: 76, nama: 'Biro Perencanaan dan Keuangan' }
])

// Sample data (replace with API call)
const sampleData = [
  { id: 16, kode_barang: '000080', nama_barang: 'PERKA LAN No.43 Tahun 2014 (Bag.Hukum)', harga_satuan: 77200, id_satker: 1, id_unit: 7, kode_akun: '526311' },
  { id: 26, kode_barang: '000081', nama_barang: 'PERKA LAN No. 43 Tahun 2015 (Bag. Hukum)', harga_satuan: 28200, id_satker: 1, id_unit: 7, kode_akun: '526311' },
  { id: 27, kode_barang: '000082', nama_barang: 'PERKA LAN No. 25 Tahun 2015 (Bag. Hukum)', harga_satuan: 39200, id_satker: 1, id_unit: 7, kode_akun: '526311' },
  { id: 29, kode_barang: '000063', nama_barang: 'CD dan Panduan ShaOLin', harga_satuan: 60000, id_satker: 1, id_unit: 7, kode_akun: '526311' },
  { id: 33, kode_barang: '000005', nama_barang: 'BBM Pertamax Roda 2 (Voucher)', harga_satuan: 15100, id_satker: 1, id_unit: 62, kode_akun: '523123' },
  { id: 35, kode_barang: '000006', nama_barang: 'BBM Solar Dex Roda 4 (Voucher)', harga_satuan: 10000, id_satker: 1, id_unit: 62, kode_akun: '523123' },
  { id: 36, kode_barang: '000007', nama_barang: 'BBM Solar Genset (Pusat)', harga_satuan: 14996200, id_satker: 1, id_unit: 62, kode_akun: '523123' },
  { id: 37, kode_barang: '000008', nama_barang: 'BBM Solar Genset (PPLPN)', harga_satuan: 10000, id_satker: 1, id_unit: 62, kode_akun: '523123' },
  { id: 38, kode_barang: '000036', nama_barang: 'DVD Film Pendek (Diklat Aparatur)', harga_satuan: 40000, id_satker: 1, id_unit: 17, kode_akun: '526311' },
  { id: 39, kode_barang: '000037', nama_barang: 'DVD Role Model (Diklat Aparatur)', harga_satuan: 10000, id_satker: 1, id_unit: 17, kode_akun: '526311' }
]

// Alert state
const showAlert = ref(true)

// Computed
const filteredItems = computed(() => {
  let result = items.value

  // Apply filters
  if (filters.value.kode_barang) {
    result = result.filter(item => 
      item.kode_barang.toLowerCase().includes(filters.value.kode_barang.toLowerCase())
    )
  }
  if (filters.value.nama_barang) {
    result = result.filter(item => 
      item.nama_barang.toLowerCase().includes(filters.value.nama_barang.toLowerCase())
    )
  }
  if (filters.value.harga_satuan) {
    result = result.filter(item => 
      item.harga_satuan.toString().includes(filters.value.harga_satuan)
    )
  }
  if (filters.value.id_satker) {
    result = result.filter(item => item.id_satker === parseInt(filters.value.id_satker))
  }
  if (filters.value.id_unit) {
    result = result.filter(item => item.id_unit === parseInt(filters.value.id_unit))
  }
  if (filters.value.kode_akun) {
    result = result.filter(item => 
      item.kode_akun.toLowerCase().includes(filters.value.kode_akun.toLowerCase())
    )
  }

  // Apply sorting
  if (sortField.value) {
    result.sort((a, b) => {
      let aVal = a[sortField.value]
      let bVal = b[sortField.value]
      
      if (sortField.value === 'harga_satuan') {
        aVal = parseFloat(aVal)
        bVal = parseFloat(bVal)
      } else {
        aVal = aVal?.toString().toLowerCase() || ''
        bVal = bVal?.toString().toLowerCase() || ''
      }
      
      if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
})

const totalItems = computed(() => filteredItems.value.length)

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)

const endIndex = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > totalItems.value ? totalItems.value : end
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredItems.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 10
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const applyFilters = () => {
  currentPage.value = 1
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getSortIcon = (field) => {
  if (sortField.value !== field) return '↕'
  return sortDirection.value === 'asc' ? '↑' : '↓'
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const getSatkerName = (id) => {
  const satker = satkerOptions.value.find(s => s.id === id)
  return satker ? satker.nama : '-'
}

const getUnitName = (id) => {
  const unit = unitOptions.value.find(u => u.id === id)
  return unit ? unit.nama : '-'
}

const viewItem = (item) => {
  console.log('View item:', item)
  // Implement view functionality or navigation
  alert(`View: ${item.nama_barang}`)
}

const editItem = (item) => {
  console.log('Edit item:', item)
  // Implement edit functionality or navigation
  alert(`Edit: ${item.nama_barang}`)
}

const deleteItem = (item) => {
  if (confirm(`Yakin akan menghapus data "${item.nama_barang}"?`)) {
    console.log('Delete item:', item)
    // Here you would call an API to delete the item
    items.value = items.value.filter(i => i.id !== item.id)
  }
}

// Lifecycle
onMounted(async () => {
  // Load sample data (replace with actual API call)
  items.value = sampleData
  
  // Example API call:
  // try {
  //   const response = await fetch('/api/persediaan-barang')
  //   items.value = await response.json()
  // } catch (error) {
  //   console.error('Error fetching data:', error)
  // }
})
</script>

<style scoped>
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

.badge-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
}

.badge-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
}

.badge-warning {
  background: linear-gradient(135deg, #f59e42 0%, #fbbf24 100%);
  color: #fff;
}
</style>
