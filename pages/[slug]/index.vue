<template>
  <div class="pt-14">
    <!-- Alert -->
    <SuboutputAlert :showAlert="showAlert" />


    <!-- Page Header -->
    <section class="content-header">
      <h2 class="text-xl font-bold text-blue-700 flex items-center gap-3">
        <span class="inline-flex items-center justify-center bg-blue-100 rounded-full p-2 mr-1">
          <i class="fa fa-dashboard"></i>
        </span>
        <!-- Icon chart-bar dihapus agar tidak dobel fa-dashboard -->
        Rekapitulasi Realisasi Semua Satker Tahun {{ currentYear }}
      </h2>
      <!-- Breadcrumb dihapus sesuai permintaan -->
    </section>

    <!-- Main Content -->
    <section class="content">
      <!-- Filter Section -->
      <DashboardFilter 
        :satkers="satkers"
        :units="units"
        :currentYear="currentYear"
        @filter="handleFilter"
        @loadUnits="loadUnits"
      />

      <!-- Satker Realization Cards -->
      <SatkerRealization 
        :satkerData="satkerRealizationData"
      />

      <!-- Budget Recapitulation Cards -->
      <BudgetRecapitulation 
        :budgetData="budgetData"
      />

      <!-- Charts Section -->
      <ChartsSection 
        :absorptionData="absorptionChartData"
        :expenditureData="expenditureChartData"
        :currentYear="currentYear"
      />

      <!-- Program Table -->
      <ProgramTable 
        :programs="programs"
        :totalProgram="totalProgram"
      />

      <!-- Activity Table -->
      <ActivityTable 
        :activities="activities"
        :totalActivity="totalActivity"
      />

      <!-- Output Table - TODO: Create component -->
      <OutputTable 
        :outputs="outputs"
        :totalOutput="totalOutput"
      /> 

      <!-- Sub Output Table - TODO: Create component -->
      <SubOutputTable 
        :subOutputs="subOutputs"
        :totalSubOutput="totalSubOutput"
      /> 
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
// import ClientOnly from 'vue-client-only' // REMOVE this line
import DashboardFilter from '~/components/DashboardFilter.vue'
import SatkerRealization from '~/components/SatkerRealization.vue'
import BudgetRecapitulation from '~/components/BudgetRecapitulation.vue'
import ChartsSection from '~/components/ChartsSection.vue'
import ProgramTable from '~/components/ProgramTable.vue'
import ActivityTable from '~/components/ActivityTable.vue'
import OutputTable from '~/components/OutputTable.vue'
import SubOutputTable from '~/components/SubOutputTable.vue'

// State
const currentYear = ref(2026)
const showAlert = ref(true)
const hasUnassignedUnits = ref(true)
const unassignedUnitsCount = ref(41)

const satkers = ref([
  { value: '', label: '- Semua Satker -' },
  { value: '1', label: 'LAN JAKARTA' },
  { value: '2', label: 'PUSJAR SKTASN NAS' },
  { value: '3', label: 'PUSJAR SKMP' },
  { value: '4', label: 'PUSJAR SKPP' },
  { value: '5', label: 'PUSJAR SKMK' },
  { value: '6', label: 'STIA LAN BANDUNG' },
  { value: '7', label: 'STIA LAN JAKARTA' },
  { value: '8', label: 'STIA MAKASSAR' }
])

const units = ref([])
const selectedSatker = ref('')
const selectedUnit = ref('')

// Satker Realization Data
const satkerRealizationData = ref([
  { id: 1, name: 'LAN JAKARTA', percentage: 14.00 },
  { id: 2, name: 'PUSJAR SKTASN NAS', percentage: 4.37 },
  { id: 3, name: 'PUSJAR SKMP', percentage: 0 },
  { id: 4, name: 'PUSJAR SKPP', percentage: 0 },
  { id: 5, name: 'PUSJAR SKMK', percentage: 0.00 },
  { id: 6, name: 'STIA LAN BANDUNG', percentage: 0 },
  { id: 7, name: 'STIA LAN JAKARTA', percentage: 0.00 },
  { id: 8, name: 'STIA MAKASSAR', percentage: 0 }
])

// Budget Data
const budgetData = reactive({
  totalBudget: 209029781000,
  submissionCount: 4,
  submissionAmount: 16327500,
  treasurerRealization: 19539547658,
  treasurerBalance: 189490233342,
  treasurerAbsorption: 9.35,
  sp2dRealization: 19370360710,
  sp2dBalance: 189659420290,
  sp2dAbsorption: 9.27
})

// Chart Data
const absorptionChartData = reactive({
  realization: [2.1, 8.3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  plan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
})

const expenditureChartData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des'],
  values: [4350820986, 12956676510, 2232050162, 0, 0, 0, 0, 0, 0, 0, 0, 0]
})

// Table Data
const programs = ref([])
const totalProgram = ref({
  activities: 22,
  outputs: 35,
  subOutputs: 50,
  budget: 208068456000,
  treasurerRealization: 19507960058,
  treasurerAbsorption: 9.38,
  treasurerBalance: 188560495942,
  sp2dRealization: 19341473110,
  sp2dAbsorption: 9.30,
  sp2dBalance: 188726982890
})

const activities = ref([])
const totalActivity = ref({
  outputs: 43,
  subOutputs: 62,
  budget: 208068456000,
  treasurerRealization: 19539547658,
  treasurerAbsorption: 9.39,
  treasurerBalance: 188528908342,
  sp2dRealization: 19370360710,
  sp2dAbsorption: 9.31,
  sp2dBalance: 188698095290
})

const outputs = ref([])
const totalOutput = ref({
  subOutputs: 62,
  budget: 209029781000,
  treasurerRealization: 19539547658,
  treasurerAbsorption: 9.35,
  treasurerBalance: 189490233342,
  sp2dRealization: 19370360710,
  sp2dAbsorption: 9.27,
  sp2dBalance: 189659420290
})

const subOutputs = ref([])
const totalSubOutput = ref({
  budget: 209029781000,
  treasurerRealization: 19539547658,
  treasurerAbsorption: 9.35,
  treasurerBalance: 189490233342,
  sp2dRealization: 19370360710,
  sp2dAbsorption: 9.27,
  sp2dBalance: 189659420290
})

// Methods
const handleFilter = (filterData) => {
  console.log('Filter applied:', filterData)
  // Fetch filtered data
  fetchData(filterData)
}

const loadUnits = async (satkerId) => {
  try {
    const response = await fetch(`/index.php?r=satker/loadList&id_satker=${satkerId}`)
    const data = await response.text()
    units.value = parseUnitsData(data)
  } catch (error) {
    console.error('Error loading units:', error)
  }
}

const fetchData = async (filterData) => {
  // Fetch data based on filters
  // Implementation depends on your API
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`
}

onMounted(async () => {
  // Initialize data
  fetchData({ year: currentYear.value })
  if (process.client) {
    const FusionCharts = (await import('fusioncharts')).default
    const Charts = (await import('fusioncharts/fusioncharts.charts')).default
    // ...initialize charts here
  }
})
</script>

<style scoped>
.content-wrapper {
  background-color: #ecf0f5;
}

.content-header h1 {
  margin: 0;
  font-size: 24px;
}

.breadcrumb {
  background-color: transparent;
  padding: 0;
  margin: 5px 0;
}

.box {
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.box-header {
  padding: 10px 15px;
  border-bottom: 1px solid #f4f4f4;
}

.box-body {
  padding: 15px;
}

.small-box {
  border-radius: 2px;
  position: relative;
  display: block;
  margin-bottom: 20px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.small-box .inner {
  padding: 10px;
}

.small-box h3 {
  font-size: 38px;
  font-weight: bold;
  margin: 0 0 10px 0;
  white-space: nowrap;
  padding: 0;
}

.small-box p {
  font-size: 14px;
}

.small-box-footer {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 3px 0;
  text-align: center;
  display: block;
  color: #fff;
  text-decoration: none;
}

.table {
  width: 100%;
  margin-bottom: 0;
}

.table-condensed > tbody > tr > td {
  padding: 5px;
}

.label {
  display: inline-block;
  padding: 0.2em 0.6em 0.3em;
  font-size: 75%;
  font-weight: bold;
  border-radius: 0.25em;
  color: #fff;
}

.label-primary { background-color: #337ab7; }
.label-success { background-color: #5cb85c; }
.label-warning { background-color: #f0ad4e; }
.label-danger { background-color: #d9534f; }
.label-info { background-color: #5bc0de; }

.bg-green { background-color: #00a65a !important; }
.bg-blue { background-color: #0073b7 !important; }
.bg-aqua { background-color: #00c0ef !important; }
.bg-olive { background-color: #3d9970 !important; }
.bg-red { background-color: #dd4b39 !important; }
.bg-yellow { background-color: #f39c12 !important; }
.bg-orange { background-color: #ff851b !important; }
</style>