<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="box box-primary">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-blue-700 flex items-center gap-3">
            <span class="inline-flex items-center justify-center bg-blue-100 rounded-full p-2 mr-1">
              <i class="fa fa-bar-chart-o text-2xl text-blue-600"></i>
            </span>
            Statistik Semua Satker Tahun {{ currentYear }}
          </h2>
        </div>
        <div class="box-body" v-show="!collapsed">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Absorption Chart -->
            <div class="flex-1">
              <div class="panel panel-primary">
                <div class="panel-heading">
                  <span class="glyphicon glyphicon-signal"></span>
                  <span class="font-semibold text-green-700 text-lg">Grafik Penyerapan Anggaran</span>
                </div>
                <div class="panel-body">
                  <div id="absorption-chart" ref="absorptionChart"></div>
                </div>
              </div>
            </div>

            <!-- Expenditure Chart -->
            <div class="flex-1">
              <div class="panel panel-primary">
                <div class="panel-heading">
                  <span class="glyphicon glyphicon-signal"></span>
                  <span class="font-semibold text-blue-700 text-lg">Grafik Pengeluaran Anggaran</span>
                </div>
                <div class="panel-body">
                  <div id="expenditure-chart" ref="expenditureChart"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  absorptionData: {
    type: Object,
    required: true
  },
  expenditureData: {
    type: Object,
    required: true
  },
  currentYear: {
    type: Number,
    default: 2026
  }
})

const collapsed = ref(false)
let FusionChartsLib = null

const renderAbsorptionChart = () => {
  if (!FusionChartsLib || !process.client) return
  
  const chartData = props.absorptionData.realization.map((value, index) => ({
    label: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'][index],
    value: value
  }))

  new FusionChartsLib({
    type: 'column3d',
    renderAt: 'absorption-chart',
    width: '100%',
    height: '400',
    dataFormat: 'json',
    dataSource: {
      chart: {
        caption: 'Grafik Penyerapan Anggaran',
        subCaption: `Tahun ${props.currentYear}`,
        xAxisName: 'Bulan',
        yAxisName: 'Persentase (%)',
        theme: 'fusion',
        numberSuffix: '%'
      },
      data: chartData
    }
  }).render()
}

const renderExpenditureChart = () => {
  if (!FusionChartsLib || !process.client) return
  
  const chartData = props.expenditureData.values.map((value, index) => ({
    label: props.expenditureData.labels[index],
    value: value
  }))

  new FusionChartsLib({
    type: 'line',
    renderAt: 'expenditure-chart',
    width: '100%',
    height: '400',
    dataFormat: 'json',
    dataSource: {
      chart: {
        caption: 'Grafik Pengeluaran Anggaran',
        subCaption: `Tahun ${props.currentYear}`,
        xAxisName: 'Bulan',
        yAxisName: 'Rupiah',
        theme: 'fusion',
        numberPrefix: 'Rp '
      },
      data: chartData
    }
  }).render()
}

onMounted(async () => {
  if (process.client) {
    const FusionCharts = (await import('fusioncharts')).default
    const Charts = (await import('fusioncharts/fusioncharts.charts')).default
    
    Charts(FusionCharts)
    FusionChartsLib = FusionCharts
    
    renderAbsorptionChart()
    renderExpenditureChart()
  }
})

watch(() => props.absorptionData, () => {
  renderAbsorptionChart()
}, { deep: true })

watch(() => props.expenditureData, () => {
  renderExpenditureChart()
}, { deep: true })
</script>
