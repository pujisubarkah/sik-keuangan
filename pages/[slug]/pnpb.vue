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
                <button 
                  type="submit"
                  class="w-full bg-brandBlue-600 hover:bg-brandBlue-700 active:bg-brandBlue-800 border border-brandBlue-700 hover:border-brandBlue-800 active:border-brandBlue-800 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-brandBlue-300"
                  style="min-height:44px"
                >
                  <i class="fa fa-search w-5 h-5 group-hover:scale-110 transition-transform" />
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
      <!-- Rekap Akun PNBP Table -->
      <div class="mb-2">
        <h2 class="text-xl md:text-2xl font-bold text-blue-700 mb-3">Rekap Akun PNBP</h2>
      </div>
      <div class="card bg-white shadow-xl mb-3 rounded-xl border border-blue-100 overflow-hidden">
        <div class="h-1 bg-[#D69009]" />
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
                <tr v-for="row in tableData" :key="row.kode" class="hover:bg-yellow-50 align-middle">
                  <DeleteModal 
                    :show-delete-modal="showDeleteModal"
                    :delete-loading="deleteLoading"
                    :delete-error="deleteError"
                    :delete-success="deleteSuccess"
                    @close="closeDeleteModal"
                    @confirm="doDelete"
                  />
                  <td class="px-3 py-2 text-center align-middle">{{ row.kode }}</td>
                  <td class="px-3 py-2 align-middle">
                    <div class="inline-flex gap-1">
                      <button class="rounded bg-blue-100 text-blue-700 px-2 py-1 text-xs font-semibold hover:bg-blue-200 transition" @click.prevent="addSubAkun(row)"><i class="fa fa-plus"></i></button>
                      <button class="rounded bg-yellow-100 text-yellow-700 px-2 py-1 text-xs font-semibold hover:bg-yellow-200 transition" @click.prevent="editAkun(row)"><i class="fa fa-pencil"></i></button>
                      <button class="rounded bg-red-100 text-red-700 px-2 py-1 text-xs font-semibold hover:bg-red-200 transition" @click.prevent="deleteAkun(row)"><i class="fa fa-trash"></i></button>
                    </div>
                    <span class="ml-2">{{ row.uraian }}</span>
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
                <tr class="bg-blue-50 font-bold">
                  <td class="px-3 py-2 text-center align-middle">&nbsp;</td>
                  <td class="px-3 py-2 text-center align-middle">Total (Rp.)</td>
                  <td class="px-3 py-2 text-right align-middle">
                    <span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(totalRow.target) }}</span>
                  </td>
                  <td class="px-3 py-2 text-right align-middle">
                    <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(totalRow.realisasi) }}</span>
                  </td>
                  <td class="px-3 py-2 text-right align-middle">
                    <span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(totalRow.selisih) }}</span>
                  </td>
                  <td class="px-3 py-2 text-right align-middle">
                    <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ totalRow.persen }}%</span>
                  </td>
                </tr>
                <tr><td colspan="6" class="py-1"></td></tr>
                <tr class="bg-blue-100 font-bold">
                  <td class="px-3 py-2">&nbsp;</td>
                  <td class="px-3 py-2 text-center align-middle">Total Keseluruhan (Rp.)</td>
                  <td class="px-3 py-2 text-right align-middle">
                    <span class="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(totalAll.target) }}</span>
                  </td>
                  <td class="px-3 py-2 text-right align-middle">
                    <span class="inline-block bg-green-100 text-green-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(totalAll.realisasi) }}</span>
                  </td>
                  <td class="px-3 py-2 text-right align-middle">
                    <span class="inline-block bg-red-100 text-red-700 rounded px-2 py-1 font-semibold">{{ formatCurrency(totalAll.selisih) }}</span>
                  </td>
                  <td class="px-3 py-2 text-right align-middle">
                    <span class="inline-block bg-yellow-100 text-yellow-700 rounded px-2 py-1 font-semibold">{{ totalAll.persen }}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Export Buttons -->
          <div class="mt-4 flex gap-2">
            <button @click="addIndukAkun"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2663A3] hover:bg-brandBlue-700 text-white font-semibold shadow transition-all">
              <span class="text-xl font-bold leading-none">+</span> Tambah Akun Induk
            </button>
            <button @click="exportExcel"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00B925] hover:bg-green-700 text-white font-semibold shadow transition-all">
              <i class="fa fa-download text-white"></i> Export Excel
            </button>
            <button @click="exportRealisasi"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow transition-all">
              <i class="fa fa-download text-white"></i> Export Realisasi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SuboutputAlert from '@/components/SuboutputAlert.vue'
import { ref, onMounted } from 'vue'
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
const totalRow = { target: 5000000, realisasi: 1000000, selisih: 4000000, persen: 0 }
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

function formatCurrency(value) {
  if (value == null) return '-'
  return value.toLocaleString('id-ID')
}
function filterData() {
  // TODO: Implement filter logic
}
function addSubAkun(row) {
  // TODO: Implement add sub akun logic
}
function editAkun(row) {
  // TODO: Implement edit akun logic
}
import DeleteModal from '~/components/UI/DeleteModal.vue'

const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const deleteLoading = ref(false)
const deleteError = ref('')
const deleteSuccess = ref(false)

function deleteAkun(row) {
  itemToDelete.value = row
  showDeleteModal.value = true
  deleteError.value = ''
  deleteSuccess.value = false
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
  deleteError.value = ''
  
  try {
    // Simulate API call - replace with actual delete API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Remove from tableData
    const idx = tableData.value.findIndex(r => r.kode === itemToDelete.value.kode)
    if (idx > -1) {
      tableData.value.splice(idx, 1)
    }
    
    deleteSuccess.value = true
    setTimeout(() => {
      closeDeleteModal()
    }, 1500)
  } catch (error) {
    deleteError.value = 'Gagal menghapus akun. Silakan coba lagi.'
  } finally {
    deleteLoading.value = false
  }
}
function addIndukAkun() {
  // TODO: Implement add induk akun logic
}
function exportExcel() {
  // TODO: Implement export excel logic
}
function exportRealisasi() {
  // TODO: Implement export realisasi logic
}
</script>

<style scoped>
.table-condensed th, .table-condensed td {
  padding: 0.5rem;
}
</style>
