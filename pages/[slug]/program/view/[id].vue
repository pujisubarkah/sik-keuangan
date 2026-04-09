<template>
  <div class="content-wrapper min-h-screen pt-24 bg-[#F8F9FB] font-inter">

    <!-- Alert -->
    <section class="content-header">
      <div class="alert-wide-wrapper">
        <SuboutputAlert :showAlert="true" />
        <!-- Mismatch Alert (pindah ke sini) -->
        <div v-if="showMismatch" class="mb-4 p-4 rounded-xl bg-yellow-100 border border-yellow-300 text-yellow-800 font-semibold mt-4">
          <span class="mr-2">⚠️</span>
          Jumlah anggaran di Master Program dan Total Suboutput tidak sama!
        </div>
      </div>
    </section>

    <!-- Header -->
    <section class="content-header max-w-5xl mx-auto px-4">
      <h1 class="text-3xl font-semibold text-slate-800 tracking-tight mb-3">
        Detail Program
      </h1>

      <!-- Breadcrumb -->
      <ul class="breadcrumb flex gap-2 text-sm text-gray-600">
        <li><NuxtLink to="/index.php?r=/site/index">Beranda</NuxtLink></li>
        <li>/</li>
        <li><NuxtLink to="/index.php?r=program/index">Program</NuxtLink></li>
        <li>/</li>
        <li class="font-medium text-slate-700">{{ programInfo.program_nama }}</li>
      </ul>
    </section>

    <!-- Main content -->
    <section class="content mt-6">
      <div class="max-w-5xl mx-auto px-4 space-y-6">

        <!-- Program Info Card -->
        <div class="box bg-transparent max-w-3xl mx-auto">
          <div class="box-body">
            <table class="w-full detail-view">
              <tbody>
                <tr>
                  <th>Tahun</th>
                  <td>{{ programInfo.tahun_anggaran }}</td>
                </tr>
                <tr>
                  <th>Satker</th>
                  <td>{{ programInfo.satker_name }}</td>
                </tr>
                <tr>
                  <th>Kode</th>
                  <td>{{ programInfo.program_kode }}</td>
                </tr>
                <tr>
                  <th>Nama</th>
                  <td>{{ programInfo.program_nama }}</td>
                </tr>
                <tr>
                  <th>Jumlah (Master Program)</th>
                  <td class="text-left">Rp {{ masterTotal ?? '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Suboutput Table -->
        <div class="box bg-transparent max-w-3xl mx-auto">
          <div class="box-body">
            <table class="w-full main-table">
              <thead>
                <tr>
                  <th class="w-16">No</th>
                  <th>Rincian Output</th>
                  <th class="text-right">Pagu Anggaran</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(item, idx) in suboutputs"
                  :key="idx"
                >
                  <td>{{ idx + 1 }}</td>
                  <td>{{ item.nama }}</td>
                  <td class="text-right">{{ item.pagu }}</td>
                </tr>

                <tr class="total-row">
                  <th colspan="2" class="text-right">Total</th>
                  <th class="text-right">{{ programInfo.total_anggaran }}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mismatch Alert -->

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
const programInfo = ref({
  tahun_anggaran: '',
  satker_name: '',
  program_kode: '',
  program_nama: '',
  total_anggaran: 0
})
const masterTotal = ref(null)
const showMismatch = ref(false)

const route = useRoute()

async function fetchProgramDetail() {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const id = route.params.id
  try {
    // Ambil summary anggaran_program
    const res = await fetch(`/api/anggaran_program/by-program/${id}`, { headers })
    const json = await res.json()
    let totalSuboutput = 0
    if (json.success) {
      suboutputs.value = (json.data || []).map(item => ({
        nama: item.suboutput_nama,
        pagu: Number(item.anggaran).toLocaleString('id-ID')
      }))
      totalSuboutput = Number(json.total_anggaran)
      programInfo.value = {
        tahun_anggaran: json.tahun_anggaran,
        satker_name: json.satker_name,
        program_kode: json.program_kode,
        program_nama: json.program_nama,
        total_anggaran: totalSuboutput.toLocaleString('id-ID')
      }
    }
    // Ambil total dari master_program
    const res2 = await fetch(`/api/program/${id}`, { headers })
    const json2 = await res2.json()
    let totalMaster = null
    if (json2.success && json2.data && json2.data.total !== undefined && json2.data.total !== null) {
      totalMaster = Number(json2.data.total)
      masterTotal.value = totalMaster.toLocaleString('id-ID')
    } else {
      masterTotal.value = null
    }
    // Cek mismatch
    showMismatch.value = (totalMaster !== null && totalSuboutput !== null && totalMaster !== totalSuboutput)
  } catch (e) {
    // handle error
  }
}

onMounted(fetchProgramDetail)
</script>

<style scoped>

/* ===== Background ===== */
.content-wrapper {
  background: #F8F9FB;
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
  background: #F8F9FB;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.05);
  transition: 0.25s;
  border-top: 4px solid #D69009; /* border-gold */
  border-bottom: none;
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
  font-family: 'Inter', sans-serif;
}

.detail-view td {
  padding: 10px 8px;
  font-weight: 500;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
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
  font-family: 'Inter', sans-serif;
}


.main-table tbody td {
  padding: 12px 10px;
  border-bottom: 1px solid #f1f5f9;
  font-weight: 500;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
}

.main-table tbody tr:hover {
  background: #f1f5f9;
}

/* Zebra */
.main-table tbody tr:nth-child(even) {
  background: #F8F9FB;
}

/* ===== Total Row ===== */
.total-row {
  background: #F8F9FB;
  font-weight: 700;
  color: #0f172a;
  font-family: 'Inter', sans-serif;
}

/* ===== Angka ===== */
.text-right {
  text-align: right;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}

/* ===== Alert Wrapper ===== */
.alert-wide-wrapper {
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

</style>