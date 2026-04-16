<template>
  <div class="pt-14 px-1 md:px-2">
    <!-- Alert -->
    <SuboutputAlert :showAlert="showAlert" />
    <div class="w-full max-w-7xl mx-auto">
      <h1 class="text-xl md:text-2xl font-bold text-blue-700 mb-3">Penerimaan Negara Bukan Pajak (PNBP)</h1>
      <!-- Filter Form: Konsisten dengan DashboardFilter.vue -->
      <div class="filter-card bg-gradient-to-br from-white to-blue-50/30 shadow-xl mb-6 rounded-2xl border border-blue-200/60 backdrop-blur-sm overflow-hidden animate-fade-in-up">
        <div class="h-1 bg-[#D69009]" />
        <div class="p-5 md:p-6">
          <div class="flex items-center justify-between mb-5 pb-4 border-b border-blue-100">
            <h2 class="text-lg font-bold text-blue-800 flex items-center gap-2.5">
              <div class="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <i class="fa fa-folder text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <span>Filter Satker</span>
            </h2>
          </div>
          <form @submit.prevent="filterData" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div class="md:col-span-6">
                <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <i class="fa fa-building text-blue-500" />
                  <span>Satker</span>
                  <!-- Ceklis dihapus sesuai permintaan -->
                </label>
                <div class="relative">
                  <select v-model="filterForm.id_satker"
                    class="block w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer">
                    <option value="" disabled selected>Pilih Satker...</option>
                    <option v-for="satker in satkerOptions" :key="satker.value" :value="satker.value">{{ satker.text }}</option>
                  </select>
                  <!-- Icon building dihapus sesuai permintaan -->
                  <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <i class="fa fa-chevron-down text-gray-400" />
                  </div>
                </div>
              </div>
              <div class="md:col-span-2 flex items-end">
<<<<<<< HEAD
                <button type="submit" class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-800 hover:shadow-lg" :disabled="loading">
                  <Icon icon="tabler:search" v-if="!loading" class="w-4 h-4" />
                  <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
=======
                <button 
                  type="submit"
                  class="w-full bg-brandBlue-600 hover:bg-brandBlue-700 active:bg-brandBlue-800 border border-brandBlue-700 hover:border-brandBlue-800 active:border-brandBlue-800 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-brandBlue-300"
                  style="min-height:44px"
                >
                  <i class="fa fa-search w-5 h-5 group-hover:scale-110 transition-transform" />
>>>>>>> 7f81c7ed4af8c029214cd2e342963f8aed59d98e
                  <span>Tampilkan</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <StatBox title="Target" :value="formatCurrency(stats.target)" color="blue">
          <template #icon><i class="fa fa-tags"></i></template>
          <template #silhouette><i class="fa fa-tags text-6xl"></i></template>
        </StatBox>
        <StatBox title="Realisasi" :value="formatCurrency(stats.realisasi)" color="red">
          <template #icon><i class="fa fa-tags"></i></template>
          <template #silhouette><i class="fa fa-shopping-cart text-6xl"></i></template>
        </StatBox>
        <StatBox title="Selisih" :value="formatCurrency(stats.selisih)" color="green">
          <template #icon><i class="fa fa-tags"></i></template>
          <template #silhouette><i class="fa fa-money text-6xl"></i></template>
        </StatBox>
        <StatBox title="Persen Realisasi" :value="stats.persen + ' %'" color="yellow">
          <template #icon><i class="fa fa-tags"></i></template>
          <template #silhouette><i class="fa fa-percent text-6xl"></i></template>
        </StatBox>
      </div>
      <!-- Charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="card bg-white shadow rounded-lg border border-gray-200 p-2">
          <div class="card-body p-2">
            <!-- Judul dan icon Grafik Jumlah Realisasi dihapus -->
            <div id="chart-jumlah" ref="chartJumlahRef" style="min-height: 220px;"></div>
          </div>
        </div>
        <div class="card bg-white shadow rounded-lg border border-gray-200 p-2">
          <div class="card-body p-2">
            <!-- Judul dan icon Grafik Persentase Realisasi dihapus -->
            <div id="chart-persen" ref="chartPersenRef" style="min-height: 220px;"></div>
          </div>
        </div>
      </div>
<<<<<<< HEAD
      <div class="card bg-white shadow-xl mb-3 rounded-xl border border-blue-100">
=======
      <!-- Rekap Akun PNBP Table -->
      <div class="mb-2">
        <h2 class="text-xl md:text-2xl font-bold text-blue-700 mb-3">Rekap Akun PNBP</h2>
      </div>
      <div class="card bg-white shadow-xl mb-3 rounded-xl border border-blue-100 overflow-hidden">
        <div class="h-1 bg-[#D69009]" />
>>>>>>> 7f81c7ed4af8c029214cd2e342963f8aed59d98e
        <div class="card-body p-3 md:p-4">
          <div class="w-full overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 text-sm rounded-xl shadow-lg border border-blue-100 bg-white" style="table-layout: auto;">
              <thead class="bg-blue-100 sticky top-0 z-10">
                <tr>
                  <th class="px-3 py-2 text-center font-semibold text-blue-700 align-middle">Kode</th>
                  <th class="px-3 py-2 font-semibold text-blue-700 align-middle">Uraian</th>
                  <th class="px-3 py-2 text-right font-semibold text-blue-700 align-middle">Target (Rp.)</th>
                  <th class="px-3 py-2 text-right font-semibold text-green-700 align-middle">Realisasi (Rp.)</th>
                  <th class="px-3 py-2 text-right font-semibold text-red-700 align-middle">Lebih / Kurang (Rp.)</th>
                  <th class="px-3 py-2 text-right font-semibold text-yellow-700 align-middle">Persen Realisasi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="row in filteredTableData" :key="row.kode" class="hover:bg-yellow-50 align-middle">
                  <td class="px-3 py-2 text-center align-middle">{{ row.kode }}</td>
                  <td class="px-3 py-2 align-middle">
                    <div class="inline-flex gap-1">
                      <button class="rounded bg-blue-100 text-blue-700 px-2 py-1 text-xs font-semibold hover:bg-blue-200 transition" @click.prevent="openAddModal(row)"><i class="fa fa-plus"></i></button>
                      <button class="rounded bg-yellow-100 text-yellow-700 px-2 py-1 text-xs font-semibold hover:bg-yellow-200 transition" @click.prevent="openEditModal(row)"><i class="fa fa-pencil"></i></button>
                      <button class="rounded bg-red-100 text-red-700 px-2 py-1 text-xs font-semibold hover:bg-red-200 transition" @click.prevent="confirmDelete(row)"><i class="fa fa-trash"></i></button>
                    </div>
                    <span class="ml-2 font-semibold text-indigo-700" v-if="row.kode.length <= 3">{{ row.uraian }}</span>
                    <span class="ml-6 text-gray-700" v-else>{{ row.uraian }}</span>
                  </td>
                  <td class="px-3 py-2 text-right align-middle">
                    <span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(row.target) }}</span>
                  </td>
                  <td class="px-3 py-2 text-right align-middle">
                    <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(row.realisasi) }}</span>
                  </td>
                  <td class="px-3 py-2 text-right align-middle">
                    <span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(row.selisih) }}</span>
                  </td>
                  <td class="px-3 py-2 text-right align-middle">
                    <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ row.persen }}%</span>
                  </td>
                </tr>
                <!-- Total Row -->
                <tr class="bg-blue-50 font-extrabold text-blue-900 border-t-2 border-blue-200">
                  <td class="px-3 py-2 text-center align-middle">&nbsp;</td>
                  <td class="px-3 py-2 text-center align-middle uppercase">Total (Rp.)</td>
                  <td class="px-3 py-2 text-right align-middle">{{ formatCurrency(totalRow.target) }}</td>
                  <td class="px-3 py-2 text-right align-middle text-green-700">{{ formatCurrency(totalRow.realisasi) }}</td>
                  <td class="px-3 py-2 text-right align-middle text-red-700">{{ formatCurrency(totalRow.selisih) }}</td>
                  <td class="px-3 py-2 text-right align-middle text-yellow-700">{{ totalRow.persen }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Export Buttons -->
<<<<<<< HEAD
          <div class="mt-8 flex flex-wrap gap-3">
            <button class="inline-flex items-center gap-2 rounded-md border border-blue-700 bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0" @click="openAddModal()">
               <IconPlus class="w-4 h-4" />
               <span>Tambah Akun Induk</span>
            </button>
            <button class="inline-flex items-center gap-2 rounded-md border border-green-700 bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0" @click="exportToCSV">
               <Icon icon="tabler:file-spreadsheet" class="w-4 h-4" />
               <span>Export ke Excel</span>
            </button>
            <button class="inline-flex items-center gap-2 rounded-md border border-emerald-700 bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0" @click="exportToCSV">
               <Icon icon="tabler:file-invoice" class="w-4 h-4" />
               <span>Export Realisasi</span>
=======
          <div class="mt-4 flex gap-2">
            <button @click="addIndukAkun"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-green-800 bg-green-700 hover:bg-[#0d5a2e] text-white font-semibold shadow-md transition-all">
              <span class="text-xl font-bold leading-none">+</span> Tambah Akun Induk
            </button>
            <button @click="exportExcel"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00B925] hover:bg-[#008B1F] text-white font-semibold shadow transition-all">
              <i class="fa fa-download text-white"></i> Export Excel
            </button>
            <button @click="exportRealisasi"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow transition-all">
              <i class="fa fa-download text-white"></i> Export Realisasi
>>>>>>> 7f81c7ed4af8c029214cd2e342963f8aed59d98e
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <VDialog v-model="showAddModal" :title="editMode ? 'Edit Akun' : 'Tambah Akun'" @cancel="showAddModal = false" @confirm="saveAccount">
       <div class="space-y-4">
          <div>
             <label class="block text-sm font-semibold text-gray-700 mb-1">Kode Akun</label>
             <input v-model="accountForm.kode" type="text" class="input input-bordered w-full" placeholder="Contoh: 423" />
          </div>
          <div>
             <label class="block text-sm font-semibold text-gray-700 mb-1">Uraian</label>
             <input v-model="accountForm.uraian" type="text" class="input input-bordered w-full" placeholder="Nama Akun" />
          </div>
          <div>
             <label class="block text-sm font-semibold text-gray-700 mb-1">Target (Rp)</label>
             <input v-model.number="accountForm.target" type="number" class="input input-bordered w-full" />
          </div>
          <div>
             <label class="block text-sm font-semibold text-gray-700 mb-1">Realisasi (Rp)</label>
             <input v-model.number="accountForm.realisasi" type="number" class="input input-bordered w-full" />
          </div>
       </div>
    </VDialog>

    <DeleteModal 
      :show-delete-modal="showDeleteModal"
      :delete-loading="deleteLoading"
      :delete-error="deleteError"
      :delete-success="deleteSuccess"
      @close="closeDeleteModal"
      @confirm="doDelete"
    />
  </div>
</template>

<script setup>
import SuboutputAlert from '@/components/SuboutputAlert.vue'
import { ref, onMounted, computed, reactive } from 'vue'
import StatBox from '~/components/UI/StatBox.vue'

let FusionChartsLib = null

const showAlert = ref(true)

const filterForm = ref({
  id_satker: '1',
})
const satkerOptions = [
  { value: '1', text: 'LAN JAKARTA' },
  { value: '2', text: 'PUSJAR SKTASN NAS' },
  { value: '3', text: 'PUSJAR SKMP' },
  { value: '4', text: 'PUSJAR SKPP' },
  { value: '5', text: 'PUSJAR SKMK' },
  { value: '6', text: 'STIA LAN BANDUNG' },
  { value: '7', text: 'STIA LAN JAKARTA' },
  { value: '8', text: 'STIA MAKASSAR' },
]

const stats = ref({
  target: 5000000,
  realisasi: 1000000,
  selisih: 4000000,
  persen: 20,
})

const chartJumlahData = {
  chart: {
    caption: 'Grafik Jumlah Realisasi',
    xAxisName: 'Bulan',
    yAxisName: 'Jumlah Penerimaan',
    formatNumberScale: 0,
    theme: 'fusion',
    numberPrefix: 'Rp ',
  },
  data: [
    { label: 'Jan', value: '0' },
    { label: 'Feb', value: '1000000' },
    { label: 'Mar', value: '0' },
    { label: 'Apr', value: '0' },
    { label: 'Mei', value: '0' },
    { label: 'Jun', value: '0' },
    { label: 'Jul', value: '0' },
    { label: 'Aug', value: '0' },
    { label: 'Sep', value: '0' },
    { label: 'Oct', value: '0' },
    { label: 'Nov', value: '0' },
    { label: 'Des', value: '0' },
  ],
}

const chartPersenData = {
  chart: {
    caption: 'Grafik Persentase Realisasi',
    xAxisName: 'Bulan',
    yAxisName: 'Persentase Penyerapan',
    yAxisMaxValue: 100,
    theme: 'fusion',
    numberSuffix: '%',
  },
  categories: [{
    category: [
      { label: 'Jan' }, { label: 'Feb' }, { label: 'Mar' }, { label: 'Apr' }, { label: 'May' }, { label: 'Jun' }, { label: 'Jul' }, { label: 'Aug' }, { label: 'Sep' }, { label: 'Oct' }, { label: 'Nov' }, { label: 'Dec' },
    ],
  }],
  dataset: [
    {
      // seriesname: 'Realisasi',
      data: [{ value: '0' }, { value: '20' }],
    },
  ],
}

const tableData = ref([
  { kode: '123', uraian: 'abc', target: 5000000, realisasi: 1000000, selisih: 4000000, persen: 20 },
  { kode: '234', uraian: 'rty', target: 5000000, realisasi: 1000000, selisih: 4000000, persen: 20 },
])
// Total calculated via computed property below
const totalAll = { target: 5000000, realisasi: 1000000, selisih: 4000000, persen: 20 }

const renderChartJumlah = () => {
  if (!FusionChartsLib || !process.client) return
  
  console.log('Rendering chart-jumlah...')
  const chartContainer = document.getElementById('chart-jumlah')
  console.log('Chart container:', chartContainer)
  
  new FusionChartsLib({
    type: 'column3d',
    renderAt: 'chart-jumlah',
    width: '100%',
    height: '350',
    dataFormat: 'json',
    dataSource: chartJumlahData
  }).render()
}

const renderChartPersen = () => {
  if (!FusionChartsLib || !process.client) return
  
  console.log('Rendering chart-persen...')
  const chartContainer = document.getElementById('chart-persen')
  console.log('Chart container:', chartContainer)
  
  new FusionChartsLib({
    type: 'msline',
    renderAt: 'chart-persen',
    width: '100%',
    height: '350',
    dataFormat: 'json',
    dataSource: chartPersenData
  }).render()
}

onMounted(async () => {
  if (process.client) {
    try {
      console.log('Loading FusionCharts...')
      const FusionCharts = (await import('fusioncharts')).default
      const Charts = (await import('fusioncharts/fusioncharts.charts')).default
      
      Charts(FusionCharts)
      FusionChartsLib = FusionCharts
      console.log('FusionCharts loaded successfully')
      
      // Wait for next tick to ensure DOM is ready
      setTimeout(() => {
        console.log('Rendering charts...')
        renderChartJumlah()
        renderChartPersen()
      }, 100)
    } catch (error) {
      console.error('Error loading FusionCharts:', error)
    }
  }
})

import VDialog from '~/components/UI/v-dialog.vue'
import DeleteModal from '~/components/UI/DeleteModal.vue'
import Icon from '~/components/Icon.vue'
import { IconPlus } from '@tabler/icons-vue'

const showAddModal = ref(false)
const showDeleteModal = ref(false)
const editMode = ref(false)
const accountForm = reactive({
  id: null,
  kode: '',
  uraian: '',
  target: 0,
  realisasi: 0
})

const itemToDelete = ref(null)
const deleteLoading = ref(false)
const deleteError = ref('')
const deleteSuccess = ref(false)

const filteredTableData = computed(() => {
  if (!filterForm.value.id_satker) return tableData.value
  // Mock filter logic based on satker
  return tableData.value
})

const totalRow = computed(() => {
  const target = tableData.value.reduce((sum, r) => sum + r.target, 0)
  const realisasi = tableData.value.reduce((sum, r) => sum + r.realisasi, 0)
  const selisih = target - realisasi
  const persen = target > 0 ? ((realisasi / target) * 100).toFixed(2) : 0
  return { target, realisasi, selisih, persen }
})

function formatCurrency(value) {
  if (value == null) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

const loading = ref(false)

async function filterData() {
  console.log('Filtering PNBP data for satker:', filterForm.value.id_satker)
  loading.value = true
  // Mock API call delay
  await new Promise(resolve => setTimeout(resolve, 800))
  // Actual filtering happens reactively via filteredTableData
  loading.value = false
}

function openAddModal(parent = null) {
  editMode.value = false
  accountForm.id = null
  accountForm.kode = parent ? parent.kode + '.' : ''
  accountForm.uraian = ''
  accountForm.target = 0
  accountForm.realisasi = 0
  showAddModal.value = true
}

function openEditModal(row) {
  editMode.value = true
  Object.assign(accountForm, {
    ...row
  })
  showAddModal.value = true
}

function saveAccount() {
  const selisih = accountForm.target - accountForm.realisasi
  const persen = accountForm.target > 0 ? Number(((accountForm.realisasi / accountForm.target) * 100).toFixed(2)) : 0
  
  if (editMode.value) {
    const idx = tableData.value.findIndex(r => r.id === accountForm.id || r.kode === accountForm.kode)
    if (idx > -1) {
      tableData.value[idx] = { ...accountForm, selisih, persen }
    }
  } else {
    tableData.value.push({
      ...accountForm,
      id: Date.now(),
      selisih,
      persen
    })
  }
  showAddModal.value = false
}

function confirmDelete(row) {
  itemToDelete.value = row
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  itemToDelete.value = null
  deleteLoading.value = false
  deleteError.value = ''
  deleteSuccess.value = false
}

const doDelete = async () => {
  if (!itemToDelete.value) return
  deleteLoading.value = true
  try {
    const idx = tableData.value.findIndex(r => r.kode === itemToDelete.value.kode)
    if (idx > -1) tableData.value.splice(idx, 1)
    deleteSuccess.value = true
    setTimeout(closeDeleteModal, 1000)
  } catch (e) {
    deleteError.value = 'Gagal menghapus data'
  } finally {
    deleteLoading.value = false
  }
}

function exportToCSV() {
  const headers = ['Kode', 'Uraian', 'Target', 'Realisasi', 'Selisih', 'Persen']
  const rows = tableData.value.map(r => [r.kode, `"${r.uraian}"`, r.target, r.realisasi, r.selisih, r.persen])
  let csvContent = "\uFEFF" + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n")
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `rekap_pnbp_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.table-condensed th, .table-condensed td {
  padding: 0.5rem;
}
</style>
