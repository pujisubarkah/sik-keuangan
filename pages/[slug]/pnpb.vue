<template>
  <div class="pt-14 px-1 md:px-2">
    <!-- Alert -->
    <div v-if="showAlert" class="alert alert-error shadow-lg mb-6 mx-auto max-w-7xl">
      <div>
        <i class="fa fa-exclamation-triangle"></i>
        <span>
          Terdapat 41 Sub Output yang belum ditentukan unitnya. Silahkan
          <NuxtLink to="/admin/suboutput" class="link link-hover underline font-bold">klik di sini</NuxtLink>
          untuk memperbaiki.
        </span>
      </div>
    </div>
    <div class="w-full max-w-7xl mx-auto">
      <h1 class="text-xl md:text-2xl font-bold text-blue-700 mb-3">LAN JAKARTA - PNBP</h1>
      <!-- Filter Form -->
      <div class="card bg-white shadow-xl mb-3 rounded-xl border border-blue-100">
        <div class="card-body p-3 md:p-4">
          <h2 class="card-title text-base font-bold text-blue-700 mb-2 flex items-center gap-2">
            <i class="fa fa-folder text-blue-500"></i>
            Filter Satker
          </h2>
          <form @submit.prevent="filterData">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
              <div class="form-control">
                <select v-model="filterForm.id_satker" class="select select-bordered w-full">
                  <option v-for="satker in satkerOptions" :key="satker.value" :value="satker.value">{{ satker.text }}</option>
                </select>
              </div>
              <div class="form-control flex items-end justify-end h-full">
                <button type="submit" class="btn btn-success btn-sm w-full md:w-auto px-4">
                  <i class="fa fa-search mr-1"></i>
                  Tampilkan
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
        <div class="card bg-white shadow-xl rounded-xl border border-blue-100">
          <div class="card-body">
            <h3 class="card-title text-base font-bold text-blue-700 mb-2 flex items-center gap-2">
              <i class="fa fa-bar-chart-o text-blue-500"></i>
              Grafik Jumlah Realisasi
            </h3>
            <div id="chart-jumlah" ref="chartJumlahRef" style="min-height: 350px;"></div>
          </div>
        </div>
        <div class="card bg-white shadow-xl rounded-xl border border-blue-100">
          <div class="card-body">
            <h3 class="card-title text-base font-bold text-blue-700 mb-2 flex items-center gap-2">
              <i class="fa fa-bar-chart-o text-blue-500"></i>
              Grafik Persentase Realisasi
            </h3>
            <div id="chart-persen" ref="chartPersenRef" style="min-height: 350px;"></div>
          </div>
        </div>
      </div>
      <!-- Rekap Akun PNBP Table -->
      <div class="card bg-white shadow-xl mb-3 rounded-xl border border-blue-100">
        <div class="card-body p-3 md:p-4">
          <h2 class="card-title text-base font-bold text-blue-700 mb-2 flex items-center gap-2">
            <i class="fa fa-bar-list text-blue-500"></i>
            Rekap Akun PNBP
          </h2>
          <div class="w-full overflow-x-auto">
            <table class="table table-hover table-bordered table-striped table-condensed">
              <thead>
                <tr>
                  <th class="text-center">Kode</th>
                  <th class="text-center">Uraian</th>
                  <th class="text-center">Target (Rp.)</th>
                  <th class="text-center">Realisasi (Rp.)</th>
                  <th class="text-center">Lebih / Kurang (Rp.)</th>
                  <th class="text-center">Persen Realisasi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in tableData" :key="row.kode">
                  <td class="text-center">{{ row.kode }}</td>
                  <td class="pl-2">
                    <div class="btn-flat btn-group">
                      <button class="btn-flat btn btn-primary btn-sm dropdown-toggle" type="button">
                        <span class="caret"></span>
                      </button>
                      <ul class="dropdown-menu">
                        <li><a href="#" @click.prevent="addSubAkun(row)"><i class="glyphicon glyphicon-plus"></i> Tambah Sub Akun</a></li>
                        <li><a href="#" @click.prevent="editAkun(row)"><i class="glyphicon glyphicon-pencil"></i> Sunting Akun</a></li>
                        <li><a href="#" @click.prevent="deleteAkun(row)"><i class="glyphicon glyphicon-trash"></i> Hapus Akun</a></li>
                      </ul>
                    </div>
                    {{ row.uraian }}
                  </td>
                  <td class="text-right"><span class="label label-primary">{{ formatCurrency(row.target) }}</span></td>
                  <td class="text-right"><span class="label label-success">{{ formatCurrency(row.realisasi) }}</span></td>
                  <td class="text-right"><span class="label label-danger">{{ formatCurrency(row.selisih) }}</span></td>
                  <td class="text-right"><span class="label label-warning">{{ row.persen }}%</span></td>
                </tr>
                <!-- Total Row -->
                <tr>
                  <th class="text-center">&nbsp;</th>
                  <th class="text-center">Total (Rp.)</th>
                  <th class="text-right"><span class="label label-primary">{{ formatCurrency(totalRow.target) }}</span></th>
                  <th class="text-right"><span class="label label-success">{{ formatCurrency(totalRow.realisasi) }}</span></th>
                  <th class="text-right"><span class="label label-danger">{{ formatCurrency(totalRow.selisih) }}</span></th>
                  <th class="text-right"><span class="label label-warning">{{ totalRow.persen }}%</span></th>
                </tr>
                <tr>
                  <td colspan="6">&nbsp;</td>
                </tr>
                <tr>
                  <th>&nbsp;</th>
                  <th class="text-center">Total Keseluruhan (Rp.)</th>
                  <th class="text-right"><span class="label label-primary">{{ formatCurrency(totalAll.target) }}</span></th>
                  <th class="text-right"><span class="label label-success">{{ formatCurrency(totalAll.realisasi) }}</span></th>
                  <th class="text-right"><span class="label label-danger">{{ formatCurrency(totalAll.selisih) }}</span></th>
                  <th class="text-right"><span class="label label-warning">{{ totalAll.persen }}%</span></th>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Export Buttons -->
          <div class="mt-4 flex gap-2">
            <button class="btn btn-primary btn-sm" @click="addIndukAkun"><i class="glyphicon glyphicon-plus"></i> Tambah Akun Induk</button>
            <button class="btn btn-success btn-sm" @click="exportExcel"><i class="glyphicon glyphicon-download"></i> Export ke Excel</button>
            <button class="btn btn-success btn-sm" @click="exportRealisasi"><i class="glyphicon glyphicon-file"></i> Export Realisasi</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
      seriesname: 'Realisasi',
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
function deleteAkun(row) {
  // TODO: Implement delete akun logic
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
