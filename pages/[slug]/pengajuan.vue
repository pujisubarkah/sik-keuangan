definePageMeta({ layout: 'default' });
<!-- filepath: c:\Users\user\Documents\sik-keuangan\pages\admin\pengajuan.vue -->
<template>
  <div class="pt-14">
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
    <h1 class="text-3xl font-bold text-blue-700 mb-6">Daftar Pengajuan Tahun 2026</h1>
    <!-- Filter Form -->
    <div class="card bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <div class="card-body">
        <h2 class="card-title text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
          <Icon icon="mdi:magnify" class="w-6 h-6 text-blue-500" />
          Filter Data
        </h2>
        <form @submit.prevent="filterData">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div class="form-control md:col-span-4">
              <label class="label">
                <span class="label-text">Status Data Dukung</span>
              </label>
              <select v-model="filterForm.status_berkas" class="select select-bordered w-full">
                <option value="">Semua Status</option>
                <option value="1">Tersedia</option>
                <option value="0">Belum Tersedia</option>
              </select>
            </div>
            <div class="form-control md:col-span-3">
              <label class="label">
                <span class="label-text">Tanggal Pengajuan Awal</span>
              </label>
              <input v-model="filterForm.tanggal_pengajuan_awal" type="date" placeholder="Tanggal Awal" class="input input-bordered w-full" />
            </div>
            <div class="form-control md:col-span-1 flex items-end justify-center">
              <span class="pb-3">s/d</span>
            </div>
            <div class="form-control md:col-span-3">
              <label class="label">
                <span class="label-text">Tanggal Pengajuan Akhir</span>
              </label>
              <input v-model="filterForm.tanggal_pengajuan_akhir" type="date" placeholder="Tanggal Akhir" class="input input-bordered w-full" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Status Data</span>
              </label>
              <select v-model="filterForm.status_verifikator" class="select select-bordered w-full">
                <option value="">Semua Data</option>
                <option value="0">Hanya Pengajuan Baru</option>
              </select>
            </div>
          </div>
          <div>
            <button type="submit" class="btn btn-success w-auto px-6">
              <Icon icon="mdi:magnify" class="w-4 h-4 mr-2" />
              Filter Data
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Data Table -->
    <div class="card bg-white shadow-xl mb-6 rounded-xl border border-blue-100">
      <div class="card-body">
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
                  <div class="flex gap-1 justify-center">
                    <NuxtLink :to="`/pengeluaran/view?id=${item.id}`" class="btn btn-xs btn-circle btn-info tooltip" data-tip="Lihat Berkas">
                      <Icon icon="tabler:eye" class="w-5 h-5" />
                    </NuxtLink>
                    <NuxtLink :to="`/pengeluaran/exportExcelUmk?id=${item.id}`" class="btn btn-xs btn-circle btn-success tooltip" data-tip="Export UMK">
                      <Icon icon="tabler:printer" class="w-5 h-5" />
                    </NuxtLink>
                    <NuxtLink :to="`/pengeluaran/update?id=${item.id}`" class="btn btn-xs btn-circle btn-warning tooltip" data-tip="Sunting">
                      <Icon icon="tabler:pencil" class="w-5 h-5" />
                    </NuxtLink>
                    <button @click="confirmDelete(item.id)" class="btn btn-xs btn-circle btn-error tooltip text-white" data-tip="Hapus">
                      <Icon icon="tabler:trash" class="w-5 h-5" />
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
            <button class="btn btn-sm" :disabled="currentPage === 1" @click="currentPage--">«</button>
            <button class="btn btn-sm">Page {{ currentPage }} of {{ totalPages }}</button>
            <button class="btn btn-sm" :disabled="currentPage === totalPages" @click="currentPage++">»</button>
          </div>
        </div>
      </div>
    </div>
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
import { ref, computed, onMounted } from 'vue'
definePageMeta({ layout: 'default' });
import { Icon } from '@iconify/vue';


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
</style>
