<template>
  <div class="content-wrapper min-h-screen pt-24">
    <!-- Alert -->
    <section class="content-header">
      <div class="alert-wide-wrapper">
        <SuboutputAlert :showAlert="true" />
      </div>
    </section>

    <!-- Header -->
    <section class="content-header max-w-5xl mx-auto px-4">
      <h1 class="text-3xl font-semibold text-slate-800 tracking-tight mb-3">
        Detail Kegiatan
      </h1>
      <!-- Breadcrumb -->
      <ul class="breadcrumb flex gap-2 text-sm text-gray-600">
        <li><NuxtLink to="/index.php?r=/site/index">Dashboard</NuxtLink></li>
        <li>/</li>
        <li><NuxtLink to="/index.php?r=kegiatan/index">Kegiatan</NuxtLink></li>
        <li>/</li>
        <li class="font-medium text-slate-700">{{ kegiatanInfo.kegiatan_nama }}</li>
      </ul>
    </section>

    <!-- Main content -->
    <section class="content mt-6">
      <div class="max-w-5xl mx-auto px-4 space-y-6">
        <!-- Kegiatan Info Card -->
        <div class="box">
          <div class="box-body">
            <table class="w-full detail-view">
              <tbody>
                <tr>
                  <th>Tahun</th>
                  <td>{{ kegiatanInfo.tahun_anggaran }}</td>
                </tr>
                <tr>
                  <th>Program</th>
                  <td>{{ kegiatanInfo.nama_program }}</td>
                </tr>
                <tr>
                  <th>Kode</th>
                  <td>{{ kegiatanInfo.kegiatan_kode }}</td>
                </tr>
                <tr>
                  <th>Nama</th>
                  <td>{{ kegiatanInfo.kegiatan_nama }}</td>
                </tr>
                <tr>
                  <th>Jumlah</th>
                  <td class="text-right font-inter-number">Rp {{ kegiatanInfo.total_anggaran }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Suboutput Table -->
          <!-- Removed Suboutput Table -->
      </div>
    </section>
  </div>
</template>

<script setup>
import { NuxtLink } from '#components'
import SuboutputAlert from '~/components/SuboutputAlert.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const suboutputs = ref([])
const kegiatanInfo = ref({
  tahun_anggaran: '',
  nama_program: '',
  kegiatan_kode: '',
  kegiatan_nama: '',
  total_anggaran: 0
})

const route = useRoute()

async function fetchKegiatanDetail() {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const id = route.params.id
  try {
    const res = await fetch(`/api/kegiatan/${id}`, { headers })
    const json = await res.json()
    if (json.success && json.data) {
      kegiatanInfo.value = {
        tahun_anggaran: json.data.tahun_anggaran,
        nama_program: json.data.nama_program || '',
        kegiatan_kode: json.data.kode_kegiatan,
        kegiatan_nama: json.data.nama_kegiatan,
        total_anggaran: json.data.total ? Number(json.data.total).toLocaleString('id-ID') : ''
      }
    }
  } catch (e) {
    // handle error
  }
}

onMounted(fetchKegiatanDetail)
</script>

<style scoped>

/* ===== Background ===== */
.content-wrapper {
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
}

/* ===== Breadcrumb ===== */
.breadcrumb {
  background: #ffffff;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

/* ===== Card / Box ===== */


.box {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-top: 4px solid #D69009; /* outline gold di atas */
  border-bottom: none;
  border-radius: 16px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.05);
  transition: 0.25s;
}

.box:hover {
  box-shadow: 0 14px 40px rgba(0,0,0,0.08);
}

.box-body {
  padding: 22px;
}

/* ===== Detail Table ===== */
.detail-view th {
  width: 30%;
  text-align: left;
  padding: 10px 8px;
  color: #64748b;
  font-weight: 600;
}

.detail-view td {
  padding: 10px 8px;
  font-weight: 500;
  color: #1e293b;
}

.font-inter-number {
  font-family: 'Inter', 'Arial', sans-serif;
  letter-spacing: 0.01em;
}

.detail-view tr {
  border-bottom: 1px solid #f1f5f9;
}

/* ===== Main Table ===== */
.main-table {
  border-collapse: separate;
  border-spacing: 0;
}

.main-table thead th {
  text-align: left;
  padding: 12px 10px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: #64748b;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
}

.main-table tbody td {
  padding: 12px 10px;
  border-bottom: 1px solid #f1f5f9;
  font-weight: 500;
  color: #1e293b;
}

.main-table tbody tr:hover {
  background: #f1f5f9;
}

/* Zebra */
.main-table tbody tr:nth-child(even) {
  background: #f8fafc;
}

/* ===== Total Row ===== */
.total-row {
  background: #f1f5f9;
  font-weight: 700;
  color: #0f172a;
}

/* ===== Angka ===== */
.text-right {
  text-align: right;
  font-weight: 600;
}

.font-inter-number {
  font-family: 'Inter', 'Arial', sans-serif !important;
  letter-spacing: 0.01em;
}

/* ===== Alert Wrapper ===== */
.alert-wide-wrapper {
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

</style>
