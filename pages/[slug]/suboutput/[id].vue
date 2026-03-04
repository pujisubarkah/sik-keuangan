<template>
     <!-- Alert -->
    <div v-if="showAlert" class="alert shadow-lg mb-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white">
      <div>
        <Icon icon="tabler:alert-circle" class="w-6 h-6 text-blue-600" />
        <span>
          Terdapat 1 Sub Output yang belum ditentukan unitnya. Silahkan
          <NuxtLink to="/admin/suboutput" class="link link-hover underline">klik di sini</NuxtLink>
          untuk memperbaiki.
        </span>
      </div>
    </div>
   

      <!-- Detail Suboutput Section -->
      <Card class="mb-6">
        <template #header>
          <h3 class="text-xl font-bold text-blue-700">Detail Suboutput</h3>
        </template>
        <div class="p-4">
          <table class="table table-hover table-condensed">
            <tbody>
              <tr><th>Unit</th><td>{{ subOutputData.unit }}</td></tr>
              <tr><th>Program</th><td><a :href="subOutputData.programLink">{{ subOutputData.program }}</a></td></tr>
              <tr><th>Kegiatan</th><td><a :href="subOutputData.kegiatanLink">{{ subOutputData.kegiatan }}</a></td></tr>
              <tr><th>Output</th><td><a :href="subOutputData.outputLink">{{ subOutputData.output }}</a></td></tr>
              <tr><th>Kode</th><td>{{ subOutputData.kode }}</td></tr>
              <tr><th>Suboutput</th><td>{{ subOutputData.nama }}</td></tr>
              <tr><th>Tahun</th><td>{{ subOutputData.tahun }}</td></tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- Tombol Aksi Section -->
      <div class="flex flex-wrap gap-2 items-center mb-6">
        <button class="btn bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition flex items-center gap-1" @click="handleEdit">
          <Icon icon="tabler:pencil" class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Sunting</span>
        </button>
        <button class="btn bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition flex items-center gap-1" @click="handleAnggaran">
          <Icon icon="tabler:cash" class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Anggaran</span>
        </button>
        <button class="btn bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition flex items-center gap-1" @click="handlePengeluaran">
          <Icon icon="tabler:shopping-cart" class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Pengeluaran</span> <span class="ml-1">({{ stats.pengeluaranCount }})</span>
        </button>
        <button class="btn bg-yellow-400 text-white rounded-lg shadow-md hover:bg-yellow-500 transition flex items-center gap-1" @click="handlePengajuan">
          <Icon icon="tabler:arrow-up-circle" class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Pengajuan</span> <span class="ml-1">({{ stats.pengajuanCount }})</span>
        </button>
        <button class="btn bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition flex items-center gap-1" @click="handlePerencanaan">
          <Icon icon="tabler:calendar" class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Perencanaan</span>
        </button>
        <button class="btn bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition flex items-center gap-1" @click="handleSalin">
          <Icon icon="tabler:copy" class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Salin Suboutput</span>
        </button>
        <div class="relative inline-block">
          <button class="btn bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition flex items-center gap-1" @click="showDropdown = !showDropdown">
            <Icon icon="tabler:refresh" class="w-5 h-5 align-middle mr-1" /> <span class="align-middle">Refresh</span>
            <span class="caret"></span>
          </button>
          <div v-if="showDropdown" class="absolute z-10 mt-2 w-40 bg-white border rounded shadow-lg">
            <a href="#" class="block px-4 py-2 hover:bg-blue-50" @click.prevent="refreshData('pagu')">Refresh Pagu</a>
            <a href="#" class="block px-4 py-2 hover:bg-blue-50" @click.prevent="refreshData('realisasi')">Refresh Realisasi</a>
            <a href="#" class="block px-4 py-2 hover:bg-blue-50" @click.prevent="refreshData('perencanaan')">Refresh Perencanaan</a>
          </div>
        </div>
      </div>

    <!-- Rekap Perencanaan Section -->
    <Card class="mb-6">
      <template #header>
        <h3 class="text-xl font-bold text-blue-700">Rekap Perencanaan</h3>
      </template>
      <div class="p-4 flex flex-col md:flex-row gap-4 w-full">
        <!-- Pagu -->
        <div class="flex-1 bg-blue-50 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <p class="text-blue-700 font-semibold">Pagu Anggaran</p>
            <h3 class="text-2xl font-bold text-blue-900">Rp {{ formatCurrency(stats.pagu) }}</h3>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <Icon icon="tabler:shopping-cart" class="w-6 h-6 text-blue-500" />
            <span class="text-xs text-blue-500">More info</span>
          </div>
        </div>
        <!-- Perencanaan -->
        <div class="flex-1 bg-green-50 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <p class="text-green-700 font-semibold">Perencanaan</p>
            <h3 class="text-2xl font-bold text-green-900">Rp {{ formatCurrency(stats.perencanaan) }}</h3>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <Icon icon="tabler:tags" class="w-6 h-6 text-green-500" />
            <span class="text-xs text-green-500">More info</span>
          </div>
        </div>
        <!-- Selisih -->
        <div class="flex-1 bg-red-50 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <p class="text-red-700 font-semibold">Selisih</p>
            <h3 class="text-2xl font-bold text-red-900">Rp {{ formatCurrency(stats.selisih) }}</h3>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <Icon icon="tabler:circle" class="w-6 h-6 text-red-500" />
            <span class="text-xs text-red-500">More info</span>
          </div>
        </div>
      </div>
    </Card>

   
    <div class="pt-14 flex flex-col gap-6">
      <!-- Chart Section Sejajar -->
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Chart Penyerapan -->
        <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                <Icon icon="tabler:chart-bar" class="w-4 h-4 text-blue-600" />
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
                <Icon icon="tabler:chart-line" class="w-4 h-4 text-green-600" />
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
      <div class="row">
        <div class="col-sm-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title"><i class="fa fa-bar-list"></i> Rincian Anggaran</h3>
            </div>
            <div class="box-body">
              <div class="flex flex-wrap gap-2 mb-4">
                <button class="btn btn-success btn-flat shadow-lg hover:scale-105 transition-transform duration-200 flex items-center gap-2 px-5 py-2 text-white bg-gradient-to-r from-green-500 via-green-400 to-green-600 border-0 rounded-xl font-poppins" @click="exportExcel">
                  <i class="mdi mdi-file-excel text-2xl"></i>
                  <span class="font-semibold tracking-wide">Export ke Excel</span>
                </button>
                <button class="btn btn-primary btn-flat shadow-lg hover:scale-105 transition-transform duration-200 flex items-center gap-2 px-5 py-2 text-white bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 border-0 rounded-xl font-poppins" @click="tambahAnggaran">
                  <i class="mdi mdi-plus text-2xl"></i>
                  <span class="font-semibold tracking-wide">Tambah Anggaran</span>
                </button>
              </div>
              
              <table class="table table-hover table-condensed">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Uraian</th>
                    <th style="text-align:center">Rev</th>
                    <th style="text-align:center">Volume</th>
                    <th style="text-align:center">Satuan</th>
                    <th style="text-align:center">Harga Satuan</th>
                    <th style="text-align:center">Jumlah</th>
                    <th style="text-align:center">Perencanaan</th>
                    <th style="text-align:center">Selisih</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in budgetItems" :key="item.id">
                    <td>{{ item.kode }}</td>
                    <td :style="{ paddingLeft: (item.level * 15) + 'px' }">
                      <div class="btn-group btn-flat">
                        <button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                          <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a href="#" @click.prevent="inputPerencanaan(item.id)">Input Perencanaan</a></li>
                        </ul>
                      </div> &nbsp;
                      <span :title="item.uraianFull">{{ item.uraian }}</span>
                    </td>
                    <td style="text-align:center">{{ item.rev }}</td>
                    <td style="text-align:center">{{ item.volume }}</td>
                    <td style="text-align:center">{{ item.satuan }}</td>
                    <td style="text-align:right">{{ formatCurrency(item.hargaSatuan) }}</td>
                    <td style="text-align:right"><span class="label label-primary">{{ formatCurrency(item.jumlah) }}</span></td>
                    <td style="text-align:right"><span class="label label-danger">{{ formatCurrency(item.perencanaan) }}</span></td>
                    <td style="text-align:right"><span class="label label-warning">{{ formatCurrency(item.selisih) }}</span></td>
                  </tr>
                </tbody>
              </table>

              <div>&nbsp;</div>
              <div class="box-footer with-border" style="text-align:left">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Icon } from '@iconify/vue';
// ...existing code...
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

const subOutputData = reactive({
  nama: "Seleksi dan Uji Kompetensi Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran ASN",
  satker: "LAN JAKARTA",
  unit: "Direktorat Penguatan Kapasitas Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran ASN",
  program: "Program Kebijakan, Pembinaan Profesi, dan Tata Kelola ASN",
  programLink: "/index.php?r=program/view&id=242",
  kegiatan: "Penguatan Kapasitas Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran Aparatur Sipil Negara",
  kegiatanLink: "/index.php?r=kegiatan/view&id=659",
  output: "Sertifikasi Profesi dan SDM[Base Line]",
  outputLink: "/index.php?r=output/view&id=2243",
  kode: "7913.ADI.001",
  tahun: 2026
});

const stats = reactive({
  pagu: 1076950000,
  perencanaan: 0,
  selisih: 1076950000,
  pengeluaranCount: 29,
  pengajuanCount: 0
});

// Sample Data Struktur Hierarkis (Diambil dari HTML)
const budgetItems = ref([
  { id: 4723, level: 0, kode: '7913.ADI.001', uraian: 'Seleksi dan Uji Kompetensi Jabatan Fungsional ...', uraianFull: 'Seleksi dan Uji Kompetensi Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran ASN', rev: '-', volume: '-', satuan: '-', hargaSatuan: 0, jumlah: 1076950000, perencanaan: 0, selisih: 1076950000 },
  { id: 228598, level: 1, kode: '051', uraian: 'Pelaksanaan Seleksi dan Uji Kompetensi JF ...', uraianFull: 'Pelaksanaan Seleksi dan Uji Kompetensi JF di Bidang Pengembangan Kapasitas dan Pembelajaran ASN', rev: 0, volume: '0.00', satuan: '', hargaSatuan: 0, jumlah: 1055080000, perencanaan: 0, selisih: 1055080000 },
  { id: 228599, level: 2, kode: 'A', uraian: 'Seleksi dan Uji Kompetensi Analis Kebija ...', uraianFull: 'Seleksi dan Uji Kompetensi Analis Kebijakan', rev: 0, volume: '0.00', satuan: '', hargaSatuan: 0, jumlah: 952000000, perencanaan: 0, selisih: 952000000 },
  { id: 228600, level: 3, kode: '521211', uraian: 'Belanja Bahan', uraianFull: 'Belanja Bahan', rev: 0, volume: '0.00', satuan: '', hargaSatuan: 0, jumlah: 464220000, perencanaan: 0, selisih: 464220000 },
  { id: 228602, level: 5, kode: '', uraian: '000012 Alat Tulis Kantor', uraianFull: '000012 Alat Tulis Kantor', rev: 0, volume: '5.00', satuan: 'paket', hargaSatuan: 3500000, jumlah: 17500000, perencanaan: 0, selisih: 17500000 },
  { id: 228603, level: 5, kode: '', uraian: '000964 Penggandaan', uraianFull: '000964 Penggandaan', rev: 0, volume: '5.00', satuan: 'paket', hargaSatuan: 478000, jumlah: 2390000, perencanaan: 0, selisih: 2390000 },
  // ... Tambahkan data lainnya sesuai kebutuhan
]);

// --- Methods ---

const formatCurrency = (value) => {
  if (!value && value !== 0) return '0';
  return new Intl.NumberFormat('id-ID').format(value);
};

import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
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
  // Navigasi ke halaman tambah anggaran sesuai slug
  const route = useRoute();
  const router = useRouter();
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