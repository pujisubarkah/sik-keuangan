<template>
  <!-- Alert -->
  <SuboutputAlert :showAlert="showAlert" />

      <!-- Detail Suboutput Section -->
      <Card class="mb-0 p-0">
        <template #header>
          <h3 class="text-xl font-bold text-blue-700">Detail Suboutput</h3>
        </template>
        <SuboutputDetail :data="subOutputData" class="pb-0" />
      </Card>



    <!-- Rekap Perencanaan Section diganti dengan komponen -->
    <SuboutputRekap :stats="stats" :formatCurrency="formatCurrency" />

    <div class="pt-2 flex flex-col gap-2">
      <!-- Chart Section Sejajar -->
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Chart Penyerapan -->
        <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                <IconChartBar class="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">Penyerapan Anggaran</h3>
                <p class="text-xs text-gray-500">Tren bulanan tahun {{ subOutputData.tahun }}</p>
              </div>
            </div>
          </div>
          <div class="p-5">
            <client-only>
              <apexchart
                type="bar"
                :options="chartPenyerapanOptions"
                :series="chartPenyerapanSeries"
                height="400"
              />
            </client-only>
          </div>
        </div>
        <!-- Chart Pengeluaran -->
        <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100">
                <IconChartLine class="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">Pengeluaran Anggaran</h3>
                <p class="text-xs text-gray-500">Tren bulanan tahun {{ subOutputData.tahun }}</p>
              </div>
            </div>
          </div>
          <div class="p-5">
            <client-only>
              <apexchart
                type="area"
                :options="chartPengeluaranOptions"
                :series="chartPengeluaranSeries"
                height="320"
              />
            </client-only>
          </div>
        </div>
      </div>

<!-- 4. Rincian Anggaran (Tabel) -->
      <!-- Rincian Anggaran (RKAKL) pakai komponen -->
      <div class="row">
        <div class="col-sm-12">
          <SuboutputRkakl :data="rkaklDetail" />
        </div>
      </div>

<!-- Tambahkan SuboutputActions dengan id -->
<SuboutputActions v-if="route.params.id" :id="route.params.id" :stats="stats" />

 

 
    </div>
</template>

<script setup>
import SuboutputDetail from '@/components/SuboutputDetail.vue';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user.js';
import { navigateTo } from '#app';
import { useRoute, useRouter } from 'vue-router';
import { $fetch } from 'ofetch';
import { ref, reactive } from 'vue';
import { IconChartBar, IconChartLine } from '@tabler/icons-vue';
import SuboutputAlert from '@/components/SuboutputAlert.vue';
import SuboutputRkakl from '@/components/SuboutputRkakl.vue';
// State untuk data RKAKL detail
const rkaklDetail = ref(null);
import SuboutputActions from '@/components/SuboutputActions.vue';

// Chart Penyerapan (ApexCharts)
const chartPenyerapanOptions = {
  chart: {
    id: 'penyerapan-chart',
    toolbar: { show: false }
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei']
  },
  title: {
    text: 'Grafik Penyerapan Anggaran',
    align: 'center',
    style: { fontSize: '16px', fontWeight: 'bold' }
  },
  yaxis: {
    labels: { formatter: val => `Rp ${val.toLocaleString('id-ID')}` }
  }
};
const chartPenyerapanSeries = [
  {
    name: 'Penyerapan',
    data: [200000000, 300000000, 150000000, 250000000, 176950000]
  }
];

// Chart Pengeluaran (ApexCharts)
const chartPengeluaranOptions = {
  chart: {
    id: 'pengeluaran-chart',
    toolbar: { show: false }
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei']
  },
  title: {
    text: 'Grafik Pengeluaran Anggaran',
    align: 'center',
    style: { fontSize: '16px', fontWeight: 'bold' }
  },
  yaxis: {
    labels: { formatter: val => `Rp ${val.toLocaleString('id-ID')}` }
  }
};
const chartPengeluaranSeries = [
  {
    name: 'Pengeluaran',
    data: [100000000, 120000000, 90000000, 110000000, 50000000]
  }
];

// --- State Data ---
const showAlert = ref(true);

const subOutputData = reactive({});
const userStore = useUserStore();

const route = useRoute();
const router = useRouter();

const fetchSuboutput = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    userStore.clearUser();
    await navigateTo('/login');
    return;
  }
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const d = await $fetch(`/api/suboutput/${route.params.id}`, { headers });
    // Simpan seluruh response ke subOutputData
    Object.assign(subOutputData, d);
  } catch (err) {
    console.error('Gagal fetch data suboutput', err);
  }
};

onMounted(fetchSuboutput);

const stats = reactive({
  pagu: 1076950000,
  perencanaan: 0,
  selisih: 1076950000,
  pengeluaranCount: 29,
  pengajuanCount: 0
});

// Fetch data anggaran hierarkis dari API dan flatten untuk table
const budgetItems = ref([]);

const fetchRkaklDetail = async () => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  try {
    const res = await $fetch(`/api/rkakl_detail/${route.params.id}`, { headers });
    console.log('API /api/rkakl_detail response:', res);
    rkaklDetail.value = res && res[0] ? res[0] : null;
  } catch (err) {
    console.error('Gagal fetch RKAKL detail', err);
    rkaklDetail.value = null;
  }
};

onMounted(() => {
  fetchSuboutput();
  fetchRkaklDetail();
});

// --- Methods ---

const formatCurrency = (value) => {
  if (!value && value !== 0) return '0';
  return new Intl.NumberFormat('id-ID').format(value);
};

// Sudah dideklarasikan di atas
const handleEdit = () => {
  router.push(`/${route.params.slug}/suboutput/update/${route.params.id}`);
};
const handleAnggaran = () => alert('Navigasi ke Detail Anggaran');
const handlePengeluaran = () => alert('Navigasi ke Pengeluaran');
const handlePengajuan = () => alert('Navigasi ke Pengajuan');
const handlePerencanaan = () => alert('Navigasi ke Perencanaan');
const handleSalin = () => {
  if(confirm('Yakin akan menyalin data?')) {
    alert('Data disalin');
  }
};

const refreshData = (type) => {
  alert(`Refreshing data ${type}...`);
  // Logic API call here
};

const inputPerencanaan = (id) => {
  alert(`Input perencanaan untuk ID: ${id}`);
};

const exportExcel = () => {
  alert('Exporting to Excel...');
};

const tambahAnggaran = () => {
  router.push(`/${route.params.slug}/anggaran/create`);
};

// --- Lifecycle ---
// Pada mounted(), Anda bisa menginisialisasi FusionCharts jika menggunakan library JS murni
// Namun disarankan menggunakan komponen Vue wrapper untuk chart.
</script>

<style scoped>
/* Meniru style AdminLTE/Bootstrap jika tidak ada global CSS */
.content-wrapper { background-color: #ecf0f5; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
.content-header { padding: 10px 15px; }
.breadcrumb { background: #fff; padding: 10px; list-style: none; border-radius: 4px; margin-bottom: 20px; }
.breadcrumb li { display: inline; }
.box { background: #fff; border-top: 3px solid #3c8dbc; margin-bottom: 20px; box-shadow: 0 1px 1px rgba(0,0,0,0.1); border-radius: 3px; }
.box-header { border-bottom: 1px solid #f4f4f4; padding: 10px; color: #444; }
.box-body { padding: 10px; }
.box-footer { border-top: 1px solid #f4f4f4; padding: 10px; background: #fff; }
.table { width: 100%; max-width: 100%; margin-bottom: 20px; border-collapse: collapse; }
.table th, .table td { padding: 8px; line-height: 1.42857; vertical-align: top; border-top: 1px solid #ddd; }
.table-striped tbody tr:nth-of-type(odd) { background-color: #f9f9f9; }
.table-bordered { border: 1px solid #ddd; }
.table-bordered th, .table-bordered td { border: 1px solid #ddd; }
.btn { display: inline-block; padding: 6px 12px; margin-bottom: 0; font-size: 14px; font-weight: 400; line-height: 1.42857; text-align: center; white-space: nowrap; vertical-align: middle; cursor: pointer; border: 1px solid transparent; border-radius: 4px; }
.btn-flat { border-radius: 0; box-shadow: none; border-width: 1px; }
.btn-primary { color: #fff; background-color: #337ab7; border-color: #2e6da4; }
.btn-success { color: #fff; background-color: #5cb85c; border-color: #4cae4c; }
.btn-danger { color: #fff; background-color: #d9534f; border-color: #d43f3a; }
.btn-warning { color: #fff; background-color: #f0ad4e; border-color: #eea236; }
.small-box { border-radius: 2px; position: relative; display: block; margin-bottom: 20px; box-shadow: 0 1px 1px rgba(0,0,0,0.1); color: #fff; }
.small-box .inner { padding: 10px; }
.small-box.bg-blue { background-color: #0073b7; }
.small-box.bg-green { background-color: #00a65a; }
.small-box.bg-red { background-color: #dd4b39; }
.small-box h3 { font-size: 38px; font-weight: bold; margin: 0 0 10px 0; white-space: nowrap; padding: 0; }
.small-box p { font-size: 15px; }
.small-box-footer { position: relative; text-align: center; padding: 3px 0; color: rgba(255,255,255,0.8); display: block; z-index: 10; background: rgba(0,0,0,0.1); text-decoration: none; }
.dropdown-menu { position: absolute; top: 100%; left: 0; z-index: 1000; display: none; float: left; min-width: 160px; padding: 5px 0; margin: 2px 0 0; font-size: 14px; text-align: left; list-style: none; background-color: #fff; background-clip: padding-box; border: 1px solid #ccc; border: 1px solid rgba(0,0,0,.15); border-radius: 4px; box-shadow: 0 6px 12px rgba(0,0,0,.175); }
.btn-group { position: relative; display: inline-block; vertical-align: middle; }
.label { display: inline; padding: .2em .6em .3em; font-size: 75%; font-weight: 700; line-height: 1; color: #fff; text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: .25em; }
.label-primary { background-color: #337ab7; }
.label-danger { background-color: #d9534f; }
.label-warning { background-color: #f0ad4e; }
.label-info { background-color: #5bc0de; }
</style>
