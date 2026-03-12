<template>
  <div class="p-6">
    <SuboutputAlert :showAlert="true" />
    <div class="mt-8">
      <SuboutputDetail :data="outputData" />
    </div>
  </div>
</template>

<script setup>
import SuboutputAlert from '@/components/SuboutputAlert.vue'
import SuboutputDetail from '@/components/SuboutputDetail.vue'

// Dummy data, ganti dengan fetch API jika perlu
const outputData = {
  kode: '001',
  nama: 'Output Contoh',
  unit: 'Unit A',
  satker: 'Satker B',
  program: 'Program C',
  kegiatan: 'Kegiatan D',
  kro: 'KRO E',
  tahun: 2026
}
</script>
