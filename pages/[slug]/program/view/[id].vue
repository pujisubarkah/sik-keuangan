<template>
  <div class="content-wrapper bg-gray-100 min-h-screen font-sans pt-24">
    <section class="content-header">
      <div class="alert alert-error shadow-lg mb-6 flex items-center gap-3">
        <Icon icon="mdi:alert" class="w-6 h-6" />
        <span>
          Terdapat 41 Sub Output yang belum ditentukan unitnya. Silahkan
          <NuxtLink to="/index.php?r=pekerjaan/admin&id_unit=null" class="link link-hover underline">klik di sini</NuxtLink>
          untuk memperbaiki.
        </span>
      </div>
    </section>

    <section class="content-header">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Detail Program</h1>
      <!-- Breadcrumb -->
      <ul class="breadcrumb flex gap-2 text-sm text-gray-600">
        <li><NuxtLink to="/index.php?r=/site/index"><i class="fa fa-dashboard"></i></NuxtLink></li>
        <li><NuxtLink to="/index.php?r=program/index">Programs</NuxtLink></li>
        <li><span>242</span></li>
      </ul>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="max-w-2xl mx-auto">
        <div class="box box-primary rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div class="box-body p-6">
            <table class="w-full table-auto detail-view table-striped table-condensed">
              <tbody>
                <tr class="odd">
                  <th class="text-left w-1/3 py-2 text-gray-600">Tahun</th>
                  <td class="py-2">2026</td>
                </tr>
                <tr class="even">
                  <th class="text-left py-2 text-gray-600">Satker</th>
                  <td class="py-2">LAN JAKARTA</td>
                </tr>
                <tr class="odd">
                  <th class="text-left py-2 text-gray-600">Kode</th>
                  <td class="py-2">086.01.CO</td>
                </tr>
                <tr class="even">
                  <th class="text-left py-2 text-gray-600">Nama</th>
                  <td class="py-2">Program Kebijakan, Pembinaan Profesi, dan Tata Kelola ASN</td>
                </tr>
                <tr class="odd">
                  <th class="text-left py-2 text-gray-600">Jumlah</th>
                  <td class="py-2">Rp 11.498.813.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="box box-primary rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="box-body p-6">
            <table class="w-full table-auto table-hover table-striped">
              <thead>
                <tr class="bg-gray-50">
                  <th class="py-2 px-2 text-left">No</th>
                  <th class="py-2 px-2 text-left">Suboutput</th>
                  <th class="py-2 px-2 text-right">Pagu Anggaran</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in suboutputs" :key="idx" :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                  <td class="py-2 px-2">{{ idx + 1 }}</td>
                  <td class="py-2 px-2">{{ item.nama }}</td>
                  <td class="py-2 px-2 text-right">{{ item.pagu }}</td>
                </tr>
                <tr class="font-bold border-t">
                  <th class="py-2 px-2 text-right" colspan="2">Total</th>
                  <th class="py-2 px-2 text-right">11.747.761.000</th>
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
import { NuxtLink } from '#components';
import Icon from '~/components/Icon.vue';

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
  { nama: 'Pengembangan Teknologi dan Digitalisasi Pembelajaran Aparatur Sipil Negara', pagu: '75.000.000' },
];
</script>

<style scoped>
.table-striped tbody tr:nth-of-type(odd) { background-color: #f9f9f9; }
.table-hover tbody tr:hover { background-color: #f1f5f9; }
.box { background: #fff; border-top: 3px solid #3b82f6; margin-bottom: 20px; box-shadow: 0 1px 1px rgba(0,0,0,0.06); border-radius: 12px; }
.box-body { padding: 10px; }
.breadcrumb { background: #fff; padding: 10px; list-style: none; border-radius: 4px; margin-bottom: 20px; }
.breadcrumb li { display: inline; }
.alert-error { background: #fee2e2; color: #991b1b; border: 1.5px solid #fca5a5; border-radius: 8px; padding: 12px 18px; }
</style>
