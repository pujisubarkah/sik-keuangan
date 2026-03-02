definePageMeta({ layout: 'default' });

<template>
  <div class="pt-14">
    <!-- Breadcrumb -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700">
        <Icon icon="mdi:home" class="w-4 h-4 inline" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <span>Persediaan</span>
      <span>/</span>
      <span class="font-bold text-blue-700">Daftar Barang</span>
    </div>
    
    <h1 class="text-3xl font-bold text-blue-700 mb-6">Daftar Barang Persediaan</h1>
   
    <!-- Alert -->
    <div v-if="showAlert" class="alert alert-error shadow-lg mb-6">
      <div>
        <Icon icon="mdi:alert" class="w-6 h-6" />
        <span>
          Terdapat 1 Sub Output yang belum ditentukan unitnya. Silahkan
          <NuxtLink to="/admin/suboutput" class="link link-hover underline">klik di sini</NuxtLink>
          untuk memperbaiki.
        </span>
      </div>
    </div>

     <!-- ACTION -->
    <div class="mb-4">
      <NuxtLink
        to="/admin/persediaan/create"
        class="btn btn-success"
      >
         <Icon icon="mdi:plus" class="w-4 h-4 mr-1" />
        Tambah Barang Persediaan
      </NuxtLink>
    </div>
    
    <!-- Data Table -->
    <div class="card bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <div class="card-body">
        <div class="text-sm mb-4 text-blue-700 font-semibold">
          Menampilkan <span class="font-bold">{{ startIndex }}-{{ endIndex }}</span> dari <span class="font-bold">{{ totalItems }}</span> hasil.
        </div>
        
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center rounded-tl-xl">No</th>
                <th class="text-center">
                  <button @click="sortBy('kode_barang')" class="hover:text-blue-700">
                    Kode Barang {{ getSortIcon('kode_barang') }}
                  </button>
                </th>
                <th>
                  <button @click="sortBy('nama_barang')" class="hover:text-blue-700">
                    Nama Barang {{ getSortIcon('nama_barang') }}
                  </button>
                </th>
                <th class="text-center">
                  <button @click="sortBy('harga_satuan')" class="hover:text-blue-700">
                    Harga Satuan {{ getSortIcon('harga_satuan') }}
                  </button>
                </th>
                <th class="text-center">
                  <button @click="sortBy('id_satker')" class="hover:text-blue-700">
                    Satker {{ getSortIcon('id_satker') }}
                  </button>
                </th>
                <th class="text-center">
                  <button @click="sortBy('id_unit')" class="hover:text-blue-700">
                    Unit {{ getSortIcon('id_unit') }}
                  </button>
                </th>
                <th class="text-center">
                  <button @click="sortBy('kode_akun')" class="hover:text-blue-700">
                    Kode Akun {{ getSortIcon('kode_akun') }}
                  </button>
                </th>
                <th class="text-center rounded-tr-xl">Aksi</th>
              </tr>
              <tr class="bg-blue-50">
                <td></td>
                <td>
                  <input v-model="filters.kode_barang" @input="applyFilters" type="text" class="input input-bordered input-xs w-full" maxlength="50" placeholder="Kode Barang" />
                </td>
                <td>
                  <input v-model="filters.nama_barang" @input="applyFilters" type="text" class="input input-bordered input-xs w-full" maxlength="255" placeholder="Nama Barang" />
                </td>
                <td>
                  <input v-model="filters.harga_satuan" @input="applyFilters" type="text" class="input input-bordered input-xs w-full" maxlength="20" placeholder="Harga" />
                </td>
                <td>
                  <select v-model="filters.id_satker" @change="applyFilters" class="select select-bordered select-xs w-full">
                    <option value="">Semua</option>
                    <option v-for="satker in satkerOptions" :key="satker.id" :value="satker.id">
                      {{ satker.nama }}
                    </option>
                  </select>
                </td>
                <td>
                  <select v-model="filters.id_unit" @change="applyFilters" class="select select-bordered select-xs w-full">
                    <option value="">Semua</option>
                    <option v-for="unit in unitOptions" :key="unit.id" :value="unit.id">
                      {{ unit.nama }}
                    </option>
                  </select>
                </td>
                <td>
                  <input v-model="filters.kode_akun" @input="applyFilters" type="text" class="input input-bordered input-xs w-full" maxlength="50" placeholder="Kode Akun" />
                </td>
                <td class="text-center">
                  <button @click="applyFilters" type="button" class="btn btn-success btn-xs px-4">
                    <Icon icon="mdi:magnify" class="w-4 h-4 mr-1" />
                    Filter
                  </button>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedItems" :key="item.id" class="hover:bg-blue-50 transition-all duration-150">
                <td class="text-center font-bold text-blue-700">{{ startIndex + index }}</td>
                <td class="text-center font-semibold text-blue-600">{{ item.kode_barang }}</td>
                <td class="text-blue-700">{{ item.nama_barang }}</td>
                <td class="text-right text-green-700 font-bold">{{ formatCurrency(item.harga_satuan) }}</td>
                <td class="text-center text-blue-700">{{ getSatkerName(item.id_satker) }}</td>
                <td class="text-center text-blue-700">{{ getUnitName(item.id_unit) }}</td>
                <td class="text-center font-semibold text-blue-600">{{ item.kode_akun }}</td>
                <td class="text-center">
                  <div class="flex gap-1 justify-center">
                    <button @click="viewItem(item)" class="btn btn-xs btn-circle btn-info tooltip" data-tip="View">
                      <Icon icon="tabler:eye" class="w-5 h-5" />
                    </button>
                    <button @click="editItem(item)" class="btn btn-xs btn-circle btn-warning tooltip" data-tip="Update">
                      <Icon icon="tabler:pencil" class="w-5 h-5" />
                    </button>
                    <button @click="deleteItem(item)" class="btn btn-xs btn-circle btn-error tooltip text-white" data-tip="Delete">
                      <Icon icon="tabler:trash" class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedItems.length === 0">
                <td colspan="8" class="text-center py-8 text-gray-500">
                  Tidak ada data yang ditemukan
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex justify-center mt-6">
          <div class="btn-group">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="btn btn-sm">«</button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="['btn btn-sm', page === currentPage ? 'btn-active' : '']"
            >
              {{ page }}
            </button>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="btn btn-sm">»</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

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
