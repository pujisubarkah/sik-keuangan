<template>
  <div class="p-6">
    <SuboutputAlert :showAlert="true" />
    <div class="mt-8">
      <SuboutputDetailOutput :data="outputData" />
    </div>
    <div class="mt-8">
      <SuboutputDaftar :items="suboutputItems" :addUrl="'/pekerjaan/create?id_output=' + outputData.id" />
    </div>
  </div>
</template>

<script setup>
import SuboutputAlert from '@/components/SuboutputAlert.vue'
import SuboutputDetailOutput from '@/components/SuboutputDetailOutput.vue'
    import SuboutputDaftar from '@/components/SuboutputDaftar.vue'

// Dummy data, ganti dengan fetch API jika perlu
const outputData = {
  id: 123, // ganti dengan id sebenarnya
  slug: 'contoh-slug', // ganti dengan slug sebenarnya
  kode: '001',
  nama: 'Output Contoh',
  unit: 'Unit A',
  satker: 'Satker B',
  program: 'Program C',
  kegiatan: 'Kegiatan D',
  kro: 'KRO E',
  tahun: 2026
}
    const suboutputItems = [
      {
        id: 4732,
        kode: '7917.ADE.001',
        nama: 'Akreditasi Pelatihan ASN',
        detailUrl: '/pekerjaan/view?id=4732',
        tahun: 2026,
        pagu: '1.272.228.000',
        realisasiBendahara: '36.155.100',
        persenBendahara: '2.84%',
        realisasiSp2d: '36.155.100',
        persenSp2d: '2.84%',
        sisa: '1.236.072.900'
      }
    ]
</script>
