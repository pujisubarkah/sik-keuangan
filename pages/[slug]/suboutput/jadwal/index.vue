<template>
  <SuboutputAlert :showAlert="true" />
  <SuboutputDetail :data="subOutputData" />
  <SuboutputJadwal />
  <!-- Konten jadwal di sini -->
</template>

<script setup>
import SuboutputAlert from '@/components/SuboutputAlert.vue'
import SuboutputDetail from '@/components/SuboutputDetail.vue'
import SuboutputJadwal from '@/components/SuboutputJadwal.vue'

// Dummy data, ganti dengan fetch API jika perlu
const subOutputData = {
  kode: '001',
  nama: 'Suboutput Contoh',
  unit: 'Unit A',
  satker: 'Satker B',
  program: 'Program C',
  kegiatan: 'Kegiatan D',
  kro: 'KRO E',
  tahun: 2026
}
</script>
