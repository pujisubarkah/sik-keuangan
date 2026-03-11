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
        Detail Program
      </h1>

      <!-- Breadcrumb -->
      <ul class="breadcrumb flex gap-2 text-sm text-gray-600">
        <li><NuxtLink to="/index.php?r=/site/index">Dashboard</NuxtLink></li>
        <li>/</li>
        <li><NuxtLink to="/index.php?r=program/index">Programs</NuxtLink></li>
        <li>/</li>
        <li class="font-medium text-slate-700">242</li>
      </ul>
    </section>

    <!-- Main content -->
    <section class="content mt-6">
      <div class="max-w-5xl mx-auto px-4 space-y-6">

        <!-- Program Info Card -->
        <div class="box">
          <div class="box-body">
            <table class="w-full detail-view">
              <tbody>
                <tr>
                  <th>Tahun</th>
                  <td>2026</td>
                </tr>
                <tr>
                  <th>Satker</th>
                  <td>LAN JAKARTA</td>
                </tr>
                <tr>
                  <th>Kode</th>
                  <td>086.01.CO</td>
                </tr>
                <tr>
                  <th>Nama</th>
                  <td>Program Kebijakan, Pembinaan Profesi, dan Tata Kelola ASN</td>
                </tr>
                <tr>
                  <th>Jumlah</th>
                  <td class="text-right">Rp 11.498.813.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Suboutput Table -->
        <div class="box">
          <div class="box-body">
            <table class="w-full main-table">
              <thead>
                <tr>
                  <th class="w-16">No</th>
                  <th>Suboutput</th>
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
                  <th class="text-right">11.747.761.000</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { NuxtLink } from '#components'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

const suboutputs = [
  { nama: 'Seleksi dan Uji Kompetensi Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran ASN', pagu: '1.076.950.000' },
  { nama: 'Penguatan Kapasitas Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran ASN', pagu: '270.776.000' },
  { nama: 'Evaluasi Tata Kelola Kebijakan Instansi Pemerintah', pagu: '123.703.000' },
  { nama: 'Penerapan Sistem Pembelajaran Terintegrasi', pagu: '125.101.000' },
  { nama: 'Pemenuhan Prioritas Direktif Presiden', pagu: '1.367.623.000' },
  { nama: 'Pelatihan Struktural Kepemimpinan', pagu: '3.448.390.000' },
  { nama: 'Pelatihan Dasar CPNS', pagu: '1.073.040.000' },
  { nama: 'Pelatihan Teknis dan Fungsional', pagu: '2.360.835.000' },
  { nama: 'Pelatihan Kebahasaan', pagu: '554.115.000' },
  { nama: 'Akreditasi Pelatihan ASN', pagu: '1.272.228.000' },
  { nama: 'Pengembangan Teknologi dan Digitalisasi Pembelajaran ASN', pagu: '75.000.000' },
]
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
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-weight: 600;
}

/* ===== Alert Wrapper ===== */
.alert-wide-wrapper {
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

</style>