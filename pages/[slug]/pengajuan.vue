<template>
  <div class="pt-14">
    <!-- Alert -->
    <div v-if="showAlert" class="alert shadow-lg mb-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white">
      <div>
        <Icon icon="mdi:alert" class="w-6 h-6" />
        <span>
          Terdapat 1 Sub Output yang belum ditentukan unitnya. Silahkan
          <NuxtLink to="/admin/suboutput" class="link link-hover underline">klik di sini</NuxtLink>
          untuk memperbaiki.
        </span>
      </div>
    </div>
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
        <form @submit.prevent="filterData" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <!-- Status Data Dukung -->
            <div class="md:col-span-4">
              <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <IconFolderCheck class="w-4 h-4 text-blue-500" />
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
                  <IconFolderCheck class="w-5 h-5 text-gray-400" />
                </div>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <IconChevronDown class="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
            <!-- Tanggal Pengajuan Awal -->
            <div class="md:col-span-3">
              <TextField v-model="filterForm.tanggal_pengajuan_awal" type="date" placeholder="Tanggal Awal" class="w-full" />
            </div>
            <div class="md:col-span-1 flex items-end justify-center">
              <span class="pb-3">s/d</span>
            </div>
            <!-- Tanggal Pengajuan Akhir -->
            <div class="md:col-span-3">
              <TextField v-model="filterForm.tanggal_pengajuan_akhir" type="date" placeholder="Tanggal Akhir" class="w-full" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <!-- Status Data -->
            <div class="md:col-span-4">
              <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <IconDatabaseSearch class="w-4 h-4 text-blue-500" />
                <span>Status Data</span>
                <span v-if="filterForm.status_verifikator" class="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">✓</span>
              </label>
              <div class="relative">
                <select v-model="filterForm.status_verifikator" class="select select-bordered w-full pl-10 pr-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all rounded-xl hover:border-blue-400 appearance-none cursor-pointer" :class="{ 'border-green-400 ring-2 ring-green-100': filterForm.status_verifikator }">
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
          <div class="flex gap-2">
            <Button @click="filterData" class="btn btn-gradient w-auto px-6 flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              <IconSearch class="w-4 h-4" />
              <span>Filter Data</span>
            </Button>
            <Button @click="() => { filterForm.status_berkas = ''; filterForm.tanggal_pengajuan_awal = ''; filterForm.tanggal_pengajuan_akhir = ''; filterForm.status_verifikator = '' }" class="btn btn-gradient w-auto px-6 flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              <IconRefresh class="w-4 h-4" />
              <span>Reset</span>
            </Button>
          </div>
        </form>
      </template>
    </Card>
    <!-- Data Table -->
    <Card class="bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <template #default>
        <div class="text-sm mb-4 text-blue-700 font-semibold">
          Menampilkan <span class="font-bold">{{ startIndex }}-{{ endIndex }}</span> dari <span class="font-bold">{{ tableData.length }}</span> hasil.
        </div>
        <div class="overflow-x-auto">
          <table class="table table-md w-full rounded-xl overflow-hidden">
            <thead>
              <tr class="bg-gradient-to-r from-blue-200 via-blue-100 to-green-100 text-blue-900">
                <th class="text-center rounded-tl-xl">No</th>
                <th class="text-center">Kode Suboutput</th>
                <th class="text-center">Suboutput</th>
                <th class="text-center">Komp</th>
                <th class="text-center">Sub<br>Komp</th>
                <th class="text-center">Akun</th>
                <th>Detil</th>
                <th class="text-center">Tanggal Pengajuan</th>
                <th class="text-center">Jumlah Pengajuan</th>
                <th class="text-center">Sisa Anggaran</th>
                <th class="text-center">Jumlah Data Dukung</th>
                <th class="text-center rounded-tr-xl">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedData" :key="item.id" class="hover:bg-blue-50 transition-all duration-150">
                <td class="text-center font-bold text-blue-700">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="text-center">
                  <NuxtLink :to="`/pekerjaan/view?id=${item.id_pekerjaan}`" class="link link-primary font-semibold">
                    {{ item.kode_suboutput }}
                  </NuxtLink>
                </td>
                <td class="text-left">
                  <NuxtLink :to="`/pekerjaan/view?id=${item.id_pekerjaan}`" class="link link-primary font-semibold">
                    {{ item.suboutput }}
                  </NuxtLink>
                </td>
                <td class="text-center text-blue-600 font-semibold">{{ item.kode_komponen }}</td>
                <td class="text-center text-blue-600 font-semibold">{{ item.kode_subkomponen }}</td>
                <td class="text-center text-blue-600 font-semibold">{{ item.kode_akun }}</td>
                <td class="text-blue-700">{{ item.detil }}</td>
                <td class="text-center text-blue-700 font-semibold">{{ item.tanggal_pengajuan }}</td>
                <td class="text-right text-green-700 font-bold">{{ formatCurrency(item.jumlah_pengajuan) }}</td>
                <td class="text-right text-red-700 font-bold">{{ formatCurrency(item.sisa_anggaran) }}</td>
                <td class="text-center">
                  <span class="badge badge-error badge-lg text-white font-bold">{{ item.jumlah_data_dukung }}</span>
                </td>
                <td class="text-center">
                  <div class="flex gap-2 justify-center">
                    <NuxtLink :to="`/pengeluaran/view?id=${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Lihat Berkas">
                      <IconEye class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <NuxtLink :to="`/pengeluaran/exportExcelUmk?id=${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Export UMK">
                      <IconPrinter class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <NuxtLink :to="`/pengeluaran/update?id=${item.id}`" class="hover:text-blue-700 transition tooltip" data-tip="Sunting">
                      <IconPencil class="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </NuxtLink>
                    <button @click="confirmDelete(item.id)" class="hover:text-red-600 transition tooltip" data-tip="Hapus" style="background:none;border:none;padding:0;">
                      <IconTrash class="w-5 h-5 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div class="flex justify-center mt-4">
          <div class="btn-group">
            <Button size="sm" :disabled="currentPage === 1" @click="currentPage--">«</Button>
            <Button size="sm">Page {{ currentPage }} of {{ totalPages }}</Button>
            <Button size="sm" :disabled="currentPage === totalPages" @click="currentPage++">»</Button>
          </div>
        </div>
      </template>
    </Card>
    <!-- Rekap Data Pengajuan -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Jumlah Pengajuan -->
      <div class="rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 shadow-xl p-6 flex flex-col justify-between text-white">
        <div class="flex items-center gap-3 mb-2">
          <Icon icon="mdi:file-document-outline" class="w-10 h-10 text-white drop-shadow" />
          <span class="text-lg font-bold">Jumlah Pengajuan</span>
        </div>
        <div class="text-3xl font-extrabold mb-2">{{ rekapData.jumlah_pengajuan }}</div>
        <div class="text-sm mb-2">Pengajuan</div>

      </div>
      <!-- Jumlah Dana -->
      <div class="rounded-xl bg-gradient-to-br from-green-400 via-green-500 to-green-600 shadow-xl p-6 flex flex-col justify-between text-white">
        <div class="flex items-center gap-3 mb-2">
          <Icon icon="mdi:currency-usd" class="w-10 h-10 text-white drop-shadow" />
          <span class="text-lg font-bold">Jumlah Dana</span>
        </div>
        <div class="text-3xl font-extrabold mb-2">{{ formatCurrency(rekapData.jumlah_dana) }}</div>
        <div class="text-sm mb-2">&nbsp;</div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { Button, TextField, Card } from '@idds/vue'
import { ref, computed, onMounted } from 'vue'
import { IconFolderCheck, IconChevronDown, IconDatabaseSearch, IconSearch, IconRefresh, IconEye, IconPrinter, IconPencil, IconTrash } from '@tabler/icons-vue';

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

// Sample data based on the HTML
const tableData = ref([
  {
    id: 183417,
    id_pekerjaan: 4723,
    kode_suboutput: '7913.ADI.001',
    suboutput: 'Seleksi dan Uji Kompetensi Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran ASN',
    kode_komponen: '051',
    kode_subkomponen: 'A',
    kode_akun: '521211',
    detil: '000005 Snack Rapat Biasa DKI Jakarta [25 orang x 3 kali]',
    tanggal_pengajuan: '27 Feb 2026',
    jumlah_pengajuan: 577500,
    sisa_anggaran: 1082500,
    jumlah_data_dukung: 9
  },
  {
    id: 183253,
    id_pekerjaan: 4728,
    kode_suboutput: '7916.FAC.001',
    suboutput: 'Pelatihan Struktural Kepemimpinan',
    kode_komponen: '051',
    kode_subkomponen: 'A',
    kode_akun: '522141',
    detil: 'Sewa Laptop',
    tanggal_pengajuan: '18 Feb 2026',
    jumlah_pengajuan: 12925000,
    sisa_anggaran: 12925000,
    jumlah_data_dukung: 1
  },
  {
    id: 183278,
    id_pekerjaan: 4794,
    kode_suboutput: '7919.EBC.954',
    suboutput: 'Layanan Manajemen SDM',
    kode_komponen: '051',
    kode_subkomponen: 'A',
    kode_akun: '521219',
    detil: 'Biaya Diklat Peserta',
    tanggal_pengajuan: '18 Feb 2026',
    jumlah_pengajuan: 1025000,
    sisa_anggaran: 49515000,
    jumlah_data_dukung: 1
  },
  {
    id: 183403,
    id_pekerjaan: 4797,
    kode_suboutput: '4821.EBD.952',
    suboutput: 'Layanan Perencanaan dan Penganggaran',
    kode_komponen: '051',
    kode_subkomponen: 'A',
    kode_akun: '522151',
    detil: 'Honorarium Narasumber (Pejabat Eselon III)',
    tanggal_pengajuan: '27 Feb 2026',
    jumlah_pengajuan: 1800000,
    sisa_anggaran: 1800000,
    jumlah_data_dukung: 6
  }
])

const rekapData = ref({
  jumlah_pengajuan: 4,
  jumlah_dana: 16327500
})

// Computed properties
const totalPages = computed(() => {
  return Math.ceil(tableData.value.length / itemsPerPage.value)
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return tableData.value.slice(start, end)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endIndex = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > tableData.value.length ? tableData.value.length : end
})

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

// Lifecycle
onMounted(() => {
  // Initialize data if needed
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
