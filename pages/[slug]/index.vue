<template>
  <div class="pt-6">
    <!-- Alert -->
    <SuboutputAlert :showAlert="showAlert" />


    <!-- Page Header -->
    <section class="content-header mb-2">
      <h2 class="text-xl font-bold text-blue-700 flex items-center gap-3 mt-0 mb-2">
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

      <div class="mt-6 flex flex-col gap-6">
        <SatkerRealization 
          v-if="satkerRealizationData && satkerRealizationData.length > 0" 
          :satkerData="satkerRealizationData" 
          :currentYear="currentYear" 
        />
        
        <BudgetRecapitulation 
          :budgetData="budgetData" 
          :currentYear="currentYear" 
        />
        
        <ChartsSection 
          :absorptionData="absorptionChartData" 
          :expenditureData="expenditureChartData" 
          :currentYear="currentYear"
        />
        
        <ProgramTable 
          :programs="programs" 
          :totalProgram="totalProgram" 
          :currentYear="currentYear" 
        />
        
        <ActivityTable 
          :activities="activities" 
          :totalActivity="totalActivity" 
          :currentYear="currentYear" 
        />
        
        <OutputTable 
          :outputs="outputs" 
          :totalOutput="totalOutput" 
          :currentYear="currentYear" 
        />
        
        <SubOutputTable 
          :subOutputs="subOutputs" 
          :totalSubOutput="totalSubOutput" 
          :currentYear="currentYear" 
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'

definePageMeta({
  middleware: ['auth']
})

const userStore = useUserStore()
const userRole = computed(() => userStore.role)
const userSatkerId = computed(() => userStore.satker_id)
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
const satkerRealizationData = ref<any[]>([])

const fetchSatkerRealizationData = async () => {
  try {
    const token = localStorage.getItem('token');
    // Ambil role_id dan satker_id dari userStore
    const roleId = userStore.role_id;
    const satkerId = userStore.satker_id;
    let url = '/api/dashboard/satker';
    // Jika role_id 8 (Admin Satker), gunakan endpoint khusus
    if (roleId === 8) {
      url = `/api/dashboard/unit_kerja/satker/${satkerId}`;
    }
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      // Map to match frontend usage if needed
      satkerRealizationData.value = data.data.map((item: any) => ({
        id: item.id,
        name: item.nama_unit || item.nama_satker || item.name || '',
        percentage: item.percentage
      }));
    }
  } catch (e) {
    console.error('Failed to fetch satker realization data', e);
  }
};

// Budget Data
const budgetData = reactive({
  totalBudget: 0,
  submissionCount: 0,
  submissionAmount: 0,
  treasurerRealization: 0,
  treasurerBalance: 0,
  treasurerAbsorption: 0,
  sp2dRealization: 0,
  sp2dBalance: 0,
  sp2dAbsorption: 0
})

const fetchBudgetData = async () => {
  try {
    const token = localStorage.getItem('token');
    // Contoh: jika role 'satker', tambahkan param satker_id
    let url = '/api/total_pengajuan';
    if (userRole.value === 'satker' && userSatkerId.value) {
      url += `?satker_id=${userSatkerId.value}`
    }
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = await res.json();
    if (data.success) {
      budgetData.totalBudget = data.totalBudget;
      budgetData.submissionCount = data.submissionCount;
      budgetData.submissionAmount = data.submissionAmount;
      budgetData.treasurerRealization = data.treasurerRealization;
      budgetData.treasurerBalance = data.treasurerBalance;
      budgetData.treasurerAbsorption = data.treasurerAbsorption;
      budgetData.sp2dRealization = data.sp2dRealization;
      budgetData.sp2dBalance = data.sp2dBalance;
      budgetData.sp2dAbsorption = data.sp2dAbsorption;
    }
  } catch (e) {
    console.error('Failed to fetch budgetData', e);
  }
};

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

const programs = ref<any[]>([])
const totalProgram = computed(() => {
  if (!programs.value.length) return {
    activities: 0,
    outputs: 0,
    subOutputs: 0,
    budget: 0,
    treasurerRealization: 0,
    treasurerAbsorption: 0,
    treasurerBalance: 0,
    sp2dRealization: 0,
    sp2dAbsorption: 0,
    sp2dBalance: 0
  };
  const activities = programs.value.reduce((sum, p) => sum + (p.jumlah_kegiatan || 0), 0);
  const outputs = programs.value.reduce((sum, p) => sum + (p.jumlah_output || 0), 0);
  const subOutputs = programs.value.reduce((sum, p) => sum + (p.jumlah_suboutput || 0), 0);
  const budget = programs.value.reduce((sum, p) => sum + Number(p.pagu || 0), 0);
  const treasurerRealization = programs.value.reduce((sum, p) => sum + Number(p.treasurerRealization || 0), 0);
  const treasurerBalance = programs.value.reduce((sum, p) => sum + Number(p.treasurerBalance || 0), 0);
  const sp2dRealization = programs.value.reduce((sum, p) => sum + Number(p.sp2dRealization || 0), 0);
  const sp2dBalance = programs.value.reduce((sum, p) => sum + Number(p.sp2dBalance || 0), 0);
  const treasurerAbsorption = budget > 0 ? (treasurerRealization / budget) * 100 : 0;
  const sp2dAbsorption = budget > 0 ? (sp2dRealization / budget) * 100 : 0;
  return {
    activities,
    outputs,
    subOutputs,
    budget,
    treasurerRealization,
    treasurerAbsorption,
    treasurerBalance,
    sp2dRealization,
    sp2dAbsorption,
    sp2dBalance
  };
});

const fetchPrograms = async () => {
  try {
    const token = localStorage.getItem('token');
    let url = '/api/dashboard/program';
    if (userRole.value === 'satker' && userSatkerId.value) {
      url += `?satker_id=${userSatkerId.value}`
    }
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      programs.value = data.data;
    }
  } catch (e) {
    console.error('Failed to fetch programs', e);
  }
};


const activities = ref<any[]>([])
const totalActivity = computed(() => {
  if (!activities.value.length) return {
    outputs: 0,
    subOutputs: 0,
    budget: 0,
    treasurerRealization: 0,
    treasurerAbsorption: 0,
    treasurerBalance: 0,
    sp2dRealization: 0,
    sp2dAbsorption: 0,
    sp2dBalance: 0
  };
  const outputs = activities.value.reduce((sum, a) => sum + (a.jumlah_output || 0), 0);
  const subOutputs = activities.value.reduce((sum, a) => sum + (a.jumlah_suboutput || 0), 0);
  const budget = activities.value.reduce((sum, a) => sum + Number(a.pagu || 0), 0);
  const treasurerRealization = activities.value.reduce((sum, a) => sum + Number(a.treasurerRealization || 0), 0);
  const treasurerBalance = activities.value.reduce((sum, a) => sum + Number(a.treasurerBalance || 0), 0);
  const sp2dRealization = activities.value.reduce((sum, a) => sum + Number(a.sp2dRealization || 0), 0);
  const sp2dBalance = activities.value.reduce((sum, a) => sum + Number(a.sp2dBalance || 0), 0);
  const treasurerAbsorption = budget > 0 ? (treasurerRealization / budget) * 100 : 0;
  const sp2dAbsorption = budget > 0 ? (sp2dRealization / budget) * 100 : 0;
  return {
    outputs,
    subOutputs,
    budget,
    treasurerRealization,
    treasurerAbsorption,
    treasurerBalance,
    sp2dRealization,
    sp2dAbsorption,
    sp2dBalance
  };
});

const fetchActivities = async () => {
  try {
    const token = localStorage.getItem('token');
    let url = '/api/dashboard/kegiatan';
    if (userRole.value === 'satker' && userSatkerId.value) {
      url += `?satker_id=${userSatkerId.value}`
    }
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      activities.value = data.data;
    }
  } catch (e) {
    console.error('Failed to fetch activities', e);
  }
};

const outputs = ref<any[]>([])

const fetchOutputs = async () => {
  try {
    const token = localStorage.getItem('token');
    let url = '/api/dashboard/output';
    if (userRole.value === 'satker' && userSatkerId.value) {
      url += `?satker_id=${userSatkerId.value}`
    }
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      outputs.value = data.data;
    }
  } catch (e) {
    console.error('Failed to fetch outputs', e);
  }
};
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

const subOutputs = ref<any[]>([])

const fetchSubOutputs = async () => {
  try {
    const token = localStorage.getItem('token');
    let url = '/api/dashboard/suboutput';
    if (userRole.value === 'satker' && userSatkerId.value) {
      url += `?satker_id=${userSatkerId.value}`
    }
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      subOutputs.value = data.data;
    }
  } catch (e) {
    console.error('Failed to fetch subOutputs', e);
  }
};
const totalSubOutput = computed(() => {
  if (!subOutputs.value.length) return {
    budget: 0,
    treasurerRealization: 0,
    treasurerAbsorption: 0,
    treasurerBalance: 0,
    sp2dRealization: 0,
    sp2dAbsorption: 0,
    sp2dBalance: 0
  };
  const budget = subOutputs.value.reduce((sum, s) => sum + Number(s.pagu || 0), 0);
  const treasurerRealization = subOutputs.value.reduce((sum, s) => sum + Number(s.treasurerRealization || 0), 0);
  const treasurerBalance = subOutputs.value.reduce((sum, s) => sum + Number(s.treasurerBalance || 0), 0);
  const sp2dRealization = subOutputs.value.reduce((sum, s) => sum + Number(s.sp2dRealization || 0), 0);
  const sp2dBalance = subOutputs.value.reduce((sum, s) => sum + Number(s.sp2dBalance || 0), 0);
  // Persentase rata-rata (atau total/total)
  const treasurerAbsorption = budget > 0 ? (treasurerRealization / budget) * 100 : 0;
  const sp2dAbsorption = budget > 0 ? (sp2dRealization / budget) * 100 : 0;
  return {
    budget,
    treasurerRealization,
    treasurerAbsorption,
    treasurerBalance,
    sp2dRealization,
    sp2dAbsorption,
    sp2dBalance
  };
});

// Methods
const handleFilter = (filterData: any) => {
  console.log('Filter applied:', filterData)
  // Fetch filtered data
  fetchData(filterData)
}

const loadUnits = async (satkerId: string) => {
  try {
    const response = await fetch(`/index.php?r=satker/loadList&id_satker=${satkerId}`)
    const data = await response.text()
    // units.value = parseUnitsData(data)
  } catch (error) {
    console.error('Error loading units:', error)
  }
}

const fetchData = async (filterData: any) => {
  // Fetch data based on filters
  // Implementation depends on your API
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`
}

onMounted(async () => {
  // Initialize data
  await fetchBudgetData();
  await fetchSubOutputs();
  await fetchOutputs();
  await fetchActivities();
  await fetchPrograms();
  await fetchSatkerRealizationData();
  fetchData({ year: currentYear.value });
  if (process.client) {
    // const FusionCharts = (await import('fusioncharts')).default;
    // const Charts = (await import('fusioncharts/fusioncharts.charts')).default;
    // ...initialize charts here
  }
});
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
