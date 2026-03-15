<template>
  <div class="p-6">
    <SuboutputAlert :showAlert="true" />
    <div class="mt-8">
      <SuboutputDetailOutput v-if="outputData" :data="outputData" />
    </div>
    <div class="mt-8">
      <SuboutputDaftar v-if="outputData" :items="suboutputItems" :addUrl="'/pekerjaan/create?id_output=' + outputData.id" />
    </div>
  </div>
</template>

<script setup>
import SuboutputAlert from '@/components/SuboutputAlert.vue'
import SuboutputDetailOutput from '@/components/SuboutputDetailOutput.vue'
    import SuboutputDaftar from '@/components/SuboutputDaftar.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Dummy data, ganti dengan fetch API jika perlu
const route = useRoute()
const outputData = ref(null)

onMounted(async () => {
  const id = route.params.id
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const res = await fetch(`/api/output/${id}`, { headers })
    const json = await res.json()
    if (json.success && json.data) {
      // Mapping agar field cocok dengan SuboutputDetailOutput
      outputData.value = {
        id: json.data.id,
        kode: json.data.kode_output,
        nama: json.data.nama_output,
        program: json.data.program ? json.data.program.nama_program : '',
        kode_program: json.data.program ? json.data.program.kode_program : '',
        kegiatan: json.data.kegiatan ? json.data.kegiatan.nama_kegiatan : '',
        kode_kegiatan: json.data.kegiatan ? json.data.kegiatan.kode_kegiatan : '',
        unit: json.data.unit || '',
        satker: json.data.satker ? json.data.satker.name : '',
        kro: json.data.kro || '',
        tahun: json.data.tahun_anggaran || '',
        total: json.data.total || '',
        jumlah_suboutput: json.data.jumlah_suboutput || 0
      }
    }
  } catch (e) {
    outputData.value = null
  }
})

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
